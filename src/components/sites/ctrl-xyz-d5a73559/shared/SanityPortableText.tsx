import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { AppLink, type AppLinkProps } from "./AppLink";
import type { LinkTo } from "./content";

/** A Sanity portable-text node: block, span, mark definition, list item or custom type. */
export interface PortableTextNode {
  _type: string;
  _key?: string | null;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PortableTextNode[];
  markDefs?: PortableTextNode[];
  text?: string;
  marks?: string[];
  [field: string]: unknown;
}

/** Component serializers get the node's fields (minus `_type`, `_key`, `markDefs`, `children`) and the rendered content. */
export type SerializerProps = { children?: ReactNode } & Record<string, unknown>;
/** A tag name or a component. */
export type Serializer = string | ComponentType<SerializerProps>;

export interface Serializers {
  types: Record<string, Serializer>;
  marks: Record<string, Serializer>;
  styles: Record<string, Serializer>;
  listItem: Serializer;
  container: Serializer;
}

export type SerializersOverride = Partial<Pick<Serializers, "types" | "marks" | "styles">> &
  Partial<Pick<Serializers, "listItem" | "container">>;

const defaults: Serializers = {
  types: { span: "span", image: "img" },
  marks: { strong: "strong", em: "em", link: "a" },
  styles: {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    normal: "p",
    blockquote: "blockquote",
  },
  listItem: "li",
  container: "div",
};

/** Fields that string (tag) serializers forward as attributes. */
const validAttrs = new Set(
  (
    "abbr accesskey accessKey action alt autocomplete autofocus autoplay charset checked cite class cols colspan " +
    "command content datetime default disabled download draggable dropzone headers height hidden href hreflang id " +
    "maxlength minlength muted placeholder preload radiogroup readonly required role selected src srcdoc srcset " +
    "tabindex title value width wrap"
  ).split(" "),
);

/** Marker for the built-in list serializer (`createListSerializer` in the original). */
const LIST = "sanity-list";

const isSpan = (node: PortableTextNode) => node._type === "span";

function findSerializer(node: PortableTextNode | undefined, serializers: Serializers): Serializer | undefined {
  if (node?.listItem && node._type !== "list") return serializers.listItem || "li";
  if (node?._type === "list") return serializers.types.list || LIST;
  if (node?._type) return serializers.types[node._type] || serializers.marks[node._type];
  return undefined;
}

function extractProps(node: PortableTextNode, forTag: boolean) {
  const props: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(node)) {
    if (field === "_type" || field === "_key" || field === "markDefs" || field === "children") continue;
    if (!forTag) props[field] = value;
    else if (validAttrs.has(field)) props[field === "class" ? "className" : field] = value;
  }
  return props;
}

function element(serializer: Serializer, node: PortableTextNode, content: ReactNode) {
  return createElement(serializer, extractProps(node, typeof serializer === "string"), content);
}

function render(serializers: Serializers, node: PortableTextNode | undefined, content: () => ReactNode): ReactNode {
  const serializer = findSerializer(node, serializers);
  if (!serializer) return content();
  if (!node) return undefined;
  if (node._type === "list" && serializer === LIST) return renderList(node, serializers);
  return element(serializer, node, content());
}

function renderMarks(
  text: string | undefined,
  [mark, ...rest]: string[] = [],
  serializers: Serializers,
  markDefs: PortableTextNode[] = [],
): ReactNode {
  if (!mark) return text;
  const node = mark in serializers.marks ? { _type: mark, _key: "" } : markDefs.find((def) => def._key === mark);
  return render(serializers, node, () => renderMarks(text, rest, serializers, markDefs));
}

function renderInSerializer(node: PortableTextNode, serializers: Serializers) {
  return render(serializers, node, () =>
    (node.children || []).map((child, index) => (
      <Fragment key={child._key || index}>
        {isSpan(child)
          ? renderMarks(child.text, child.marks, serializers, node.markDefs)
          : render(serializers, child, () => renderMarks(child.text, child.marks, serializers, node.markDefs))}
      </Fragment>
    )),
  );
}

function renderStyle(node: PortableTextNode, serializers: Serializers, content: () => ReactNode) {
  const serializer = node.style ? serializers.styles[node.style] : undefined;
  return !node.listItem && node.style && serializer ? element(serializer, node, content()) : content();
}

function renderBlocks(blocks: PortableTextNode[], serializers: Serializers) {
  return blocks.map((block, index) => (
    <Fragment key={block._key || index}>
      {renderStyle(block, serializers, () => renderInSerializer(block, serializers))}
    </Fragment>
  ));
}

/** Groups consecutive list items into (nested) `_type: "list"` nodes. */
function walkList(acc: PortableTextNode[], block: PortableTextNode): PortableTextNode[] {
  if (!block.listItem) {
    acc.push(block);
    return acc;
  }
  const last = acc[acc.length - 1] as PortableTextNode | undefined;
  if (!last || last._type !== "list" || !last.children || (block.level === 1 && block.listItem !== last.listItem)) {
    acc.push({ _type: "list", listItem: block.listItem, level: block.level, children: [block] });
    return acc;
  }
  if (block.level === last.level && block.listItem === last.listItem) {
    last.children.push(block);
    return acc;
  }
  walkList(last.children, block);
  return acc;
}

function renderList(node: PortableTextNode, serializers: Serializers) {
  const children = node.children ?? [];
  const list = createElement(children[0]?.listItem === "number" ? "ol" : "ul", {}, renderBlocks(children, serializers));
  return (node.level ?? 1) > 1 ? createElement(serializers.listItem || "li", null, list) : list;
}

export interface SanityContentProps {
  blocks?: readonly PortableTextNode[] | null;
  serializers?: SerializersOverride;
}

/**
 * Port of `SanityContent` (@nuxtjs/sanity): renders portable text with the default serializers,
 * optionally overridden. Outputs the blocks as siblings, without a wrapper.
 */
export function SanityContent({ blocks = [], serializers = {} }: SanityContentProps) {
  const merged: Serializers = {
    types: { ...defaults.types, ...serializers.types },
    marks: { ...defaults.marks, ...serializers.marks },
    styles: { ...defaults.styles, ...serializers.styles },
    listItem: serializers.listItem ?? defaults.listItem,
    container: serializers.container ?? defaults.container,
  };

  // `walkList` nests list items into new list nodes; the source blocks are left untouched.
  const nodes = (blocks ?? []).reduce<PortableTextNode[]>(walkList, []);
  return <>{renderBlocks(nodes, merged)}</>;
}

export interface SanityPortableTextElementProps {
  style?: string;
  children?: ReactNode;
}

/** Port of `SanityPortableTextElement`: the heading/small styles of the site's rich text. */
export function SanityPortableTextElement({ style = "", children }: SanityPortableTextElementProps) {
  if (style === "h2") return <h2 className="text-base">{children}</h2>;
  if (style === "h3") return <h3 className="text-base">{children}</h3>;
  if (style === "h4") return <h4 className="text-base">{children}</h4>;
  if (style === "small") return <p className="text-sm">{children}</p>;
  return <p>{children}</p>;
}

const linkTypes = ["email", "tel", "place", "submit"] as const;
type LinkType = (typeof linkTypes)[number];
const text = (value: unknown) => (typeof value === "string" ? value : null);
const flag = (value: unknown) => (typeof value === "boolean" ? value : undefined);

/**
 * `link` / `internalLink` marks: the original hands the mark definition to `AppLink` as-is, so only
 * fields that are AppLink props act as such; anything else (e.g. `href`, `blank`) lands as a plain attribute.
 */
function LinkMark({ children, tag, title, type, to, openInNewTab, trailingSlash, lang, ...fields }: SerializerProps) {
  const attrs: Record<string, string> = {};
  for (const [field, value] of Object.entries(fields)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") attrs[field] = String(value);
  }
  const props: AppLinkProps = {
    tag: text(tag),
    title: text(title),
    type: linkTypes.includes(type as LinkType) ? (type as LinkType) : null,
    to: typeof to === "string" || (typeof to === "object" && to !== null) ? (to as LinkTo) : null,
    openInNewTab: flag(openInNewTab) ?? false,
    trailingSlash: flag(trailingSlash) ?? true,
    lang: text(lang),
  };
  return (
    <AppLink {...attrs} {...props}>
      {children}
    </AppLink>
  );
}

function StyleElement({ style, children }: SerializerProps) {
  return <SanityPortableTextElement style={text(style) ?? ""}>{children}</SanityPortableTextElement>;
}

const portableTextSerializers: SerializersOverride = {
  marks: {
    link: LinkMark,
    internalLink: LinkMark,
    underline: "u",
    "strike-through": "s",
    code: "code",
  },
  styles: {
    normal: "p",
    h1: StyleElement,
    h2: StyleElement,
    h3: StyleElement,
    small: StyleElement,
  },
};

export interface SanityPortableTextProps {
  blocks?: readonly PortableTextNode[] | null;
}

/** Port of `SanityPortableText`: `SanityContent` with the site's serializers. */
export function SanityPortableText({ blocks = [] }: SanityPortableTextProps) {
  return <SanityContent blocks={blocks} serializers={portableTextSerializers} />;
}
