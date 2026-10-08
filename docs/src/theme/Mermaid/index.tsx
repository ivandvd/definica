import React, {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {ErrorBoundaryErrorMessageFallback} from '@docusaurus/theme-common';
import {
  MermaidContainerClassName,
  useMermaidRenderResult,
} from '@docusaurus/theme-mermaid/client';
import type {Props} from '@theme/Mermaid';

/**
 * Definica's Mermaid renderer.
 *
 * 1. Fonts first. Mermaid measures every label when it lays a diagram out. If that happens while
 *    the fallback font is showing, boxes are sized for Arial and the Tomato Grotesk labels are
 *    clipped once the web font arrives. Diagrams therefore render only after the weights they use
 *    have loaded (or after a short timeout, so a blocked font never hides a diagram).
 * 2. Phones. Below 640px, left-to-right flowcharts (and left-to-right subgraphs) are laid out top
 *    to bottom, so they grow down the page instead of shrinking to an unreadable width.
 * 3. Legibility. A diagram is never scaled below 80% of its natural size; if it is still wider
 *    than the column, it scrolls sideways inside its card rather than shrinking its text.
 * 4. House style. Flowchart boxes are rounded and start nodes are lime (see `applyHouseStyle`);
 *    colours, font and spacing come from `themeConfig.mermaid` and `src/css/custom.css`.
 */
const FONT_FACES = [
  '400 16px "Tomato Grotesk"',
  '500 16px "Tomato Grotesk"',
  '600 16px "Tomato Grotesk"',
];
const FONT_TIMEOUT_MS = 2500;
const NARROW_QUERY = '(max-width: 640px)';
const MIN_SCALE = 0.8;

let fontsReady: Promise<void> | null = null;

function waitForFonts(): Promise<void> {
  if (fontsReady) {
    return fontsReady;
  }
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }
  const {fonts} = document;
  const loaded = Promise.all(FONT_FACES.map((face) => fonts.load(face).catch(() => [])))
    .then(() => fonts.ready)
    .then(
      () => undefined,
      () => undefined,
    );
  const timeout = new Promise<void>((resolve) => {
    setTimeout(resolve, FONT_TIMEOUT_MS);
  });
  fontsReady = Promise.race([loaded, timeout]);
  return fontsReady;
}

function useFontsReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    waitForFonts().then(() => {
      if (active) {
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  return ready;
}

/** `null` until the viewport has been read on the client. */
function useNarrowViewport(): boolean | null {
  const [narrow, setNarrow] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return narrow;
}

/** On narrow screens, lay left-to-right flowcharts and subgraphs out top to bottom. */
function adaptToViewport(text: string, narrow: boolean): string {
  if (!narrow) {
    return text;
  }
  return text
    .replace(/^(\s*(?:flowchart|graph)\s+)(?:LR|RL)\b/m, '$1TB')
    .replace(/^(\s*direction\s+)(?:LR|RL)\b/gm, '$1TB');
}

const FLOWCHART = /^\s*(?:flowchart|graph)\b/;
const BOX_NODE = /\b([A-Za-z][\w-]*)\["([^"]*)"\]/g;
const START_NODE = /\b([A-Za-z][\w-]*)\(\[/g;

/**
 * House style for flowcharts, applied to every diagram so pages stay plain Mermaid:
 * boxes (`A["…"]`) get rounded corners, and start nodes (`A(["…"])`) are filled lime, the
 * landing page's call-to-action colour.
 */
function applyHouseStyle(text: string): string {
  const lines = text.split('\n');
  const firstLine = lines.find((line) => line.trim() !== '') ?? '';
  if (!FLOWCHART.test(firstLine)) {
    return text;
  }
  const startNodes = new Set<string>();
  const styled = lines.map((line) => {
    if (/^\s*(?:subgraph|classDef|class|style|linkStyle|click)\b/.test(line)) {
      return line;
    }
    for (const match of line.matchAll(START_NODE)) {
      startNodes.add(match[1]!);
    }
    return line.replace(BOX_NODE, '$1("$2")');
  });
  if (startNodes.size > 0) {
    styled.push(
      '  classDef dfStart fill:#d1f500,stroke:#0f0f0f,color:#0f0f0f',
      `  class ${[...startNodes].join(',')} dfStart`,
    );
  }
  return styled.join('\n');
}

/** The natural width Mermaid gives the diagram (its `max-width`, else the viewBox width). */
function naturalWidth(svg: string): number | null {
  const maxWidth = /max-width:\s*([\d.]+)px/.exec(svg);
  if (maxWidth) {
    return parseFloat(maxWidth[1]!);
  }
  const viewBox = /viewBox="[-\d.e]+\s+[-\d.e]+\s+([\d.e]+)\s+[\d.e]+"/.exec(svg);
  return viewBox ? parseFloat(viewBox[1]!) : null;
}

function Placeholder(): ReactNode {
  return (
    <div
      className={`${MermaidContainerClassName} df-mermaid df-mermaid--loading`}
      aria-busy="true"
      aria-label="Diagram loading"
    />
  );
}

function MermaidDiagram({text}: {text: string}): ReactNode {
  const renderResult = useMermaidRenderResult({text});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (renderResult && ref.current) {
      renderResult.bindFunctions?.(ref.current);
    }
  }, [renderResult]);

  if (renderResult === null) {
    return <Placeholder />;
  }

  const width = naturalWidth(renderResult.svg);
  const style = width
    ? ({'--df-mermaid-min-width': `${Math.round(width * MIN_SCALE)}px`} as CSSProperties)
    : undefined;

  return (
    <div className={`${MermaidContainerClassName} df-mermaid`}>
      <div
        ref={ref}
        className="df-mermaid__canvas"
        style={style}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: renderResult.svg}}
      />
    </div>
  );
}

export default function Mermaid({value}: Props): ReactNode {
  const fontsReady = useFontsReady();
  const narrow = useNarrowViewport();

  if (!fontsReady || narrow === null) {
    return <Placeholder />;
  }

  const text = applyHouseStyle(adaptToViewport(value, narrow));
  return (
    <ErrorBoundary fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
      <MermaidDiagram key={text} text={text} />
    </ErrorBoundary>
  );
}
