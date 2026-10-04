"use client";

// @ts-expect-error -- the package ships no type declarations; it is cast to AutocompleteConstructor below.
import Autocomplete from "@trevoreyre/autocomplete-js";
import { useEffect, useRef, useState, type FormEvent, type HTMLAttributes } from "react";
import { getDevice } from "../shared/device";
import { BlockchainsWheel, type BlockchainsWheelHandle } from "./BlockchainsWheel";
import type { Blockchain } from "./BlockchainsWheelItem";

/** The parts of the (untyped) vanilla autocomplete instance this slice touches. */
interface AutocompleteInstance {
  position: string;
  updateStyle: () => void;
  destroy: () => void;
  core: { handleBlur: () => void };
}
type AutocompleteConstructor = new (
  root: HTMLElement,
  options: { search: (value: string) => string[] | Promise<string[]>; autoSelect?: boolean },
) => AutocompleteInstance;

export interface SliceBlockchainsSearchProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  title?: string | null;
  text?: string | null;
  placeholder?: string;
  blockchains?: Blockchain[];
  /** CMS bookkeeping fields, accepted so the slice object can be spread in. */
  componentName?: string;
  sliceId?: string;
}

const NO_BLOCKCHAINS: Blockchain[] = [];

const tokenize = (value: string) => value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/**
 * Local stand-in for the original Sanity query `name match $search + '*'`:
 * every search term must equal a word of the name, the last one as a prefix.
 */
function searchBlockchains(blockchains: Blockchain[], search: string) {
  const terms = tokenize(search);
  if (terms.length === 0) return [];
  const last = terms.length - 1;
  return blockchains.filter((blockchain) => {
    const words = tokenize(blockchain.name);
    return terms.every((term, i) => words.some((word) => (i === last ? word.startsWith(term) : word === term)));
  });
}

const isTouchMobile = () => {
  const { mobile, touch } = getDevice();
  return mobile && touch;
};

/** Port of `SliceBlockchainsSearch` (scope data-v-051a504d): autocomplete search driving the blockchains wheel. */
export function SliceBlockchainsSearch({
  title = null,
  text = null,
  placeholder = "Search",
  blockchains = NO_BLOCKCHAINS,
  componentName: _componentName,
  sliceId,
  className,
  ...rest
}: SliceBlockchainsSearchProps) {
  void _componentName;
  const refAutocomplete = useRef<HTMLDivElement>(null);
  const refWheel = useRef<BlockchainsWheelHandle>(null);
  const autocomplete = useRef<AutocompleteInstance | null>(null);

  // The wheel's list: featured chains, with slots swapped for searched non-featured ones.
  const [featured, setFeatured] = useState(() => blockchains.filter((b) => b.isFeatured === true));
  const featuredRef = useRef(featured);
  const blockchainsRef = useRef(blockchains);
  const lastValue = useRef("");
  const results = useRef<Blockchain[]>([]);
  useEffect(() => {
    blockchainsRef.current = blockchains;
  });

  /** Original `p()`: spin the wheel to the chain whose name equals the input value. */
  const applyValue = () => {
    void Promise.resolve().then(() => {
      const input = refAutocomplete.current?.querySelector("input");
      if (!input) return;
      const value = input.value.toLowerCase();
      if (lastValue.current === value) return;
      lastValue.current = value;
      if (blockchainsRef.current.find((b) => b.name.toLowerCase() === value)) {
        const index = featuredRef.current.findIndex((b) => b.name.toLowerCase() === value);
        if (index !== -1) refWheel.current?.goTo(index);
      } else {
        const found = results.current.find((b) => b.name.toLowerCase() === value);
        if (!found) return;
        const index = Math.floor(Math.random() * featuredRef.current.length);
        const next = [...featuredRef.current];
        next.splice(index, 1, found);
        featuredRef.current = next;
        setFeatured(next);
        refWheel.current?.goTo(index, true);
      }
    });
  };

  useEffect(() => {
    const root = refAutocomplete.current;
    const input = root?.querySelector("input");
    const resultList = root?.querySelector("ul");
    if (!root || !input || !resultList) return;

    const instance = new (Autocomplete as AutocompleteConstructor)(root, {
      search: (value) => {
        if (value.length < 1) return [];
        results.current = searchBlockchains(blockchainsRef.current, value);
        return results.current.map((b) => b.name);
      },
      autoSelect: true,
    });
    // The vanilla build starts without a position (the Vue one defaults to "below").
    instance.position = "below";
    instance.updateStyle();
    autocomplete.current = instance;

    // Stand-in for the original watcher on the Vue component's `value`: these run after the
    // library's own handlers, and `applyValue` ignores calls where the value did not change.
    const onValueChange = () => {
      if (!isTouchMobile()) applyValue();
    };
    const onBlur = () => {
      if (isTouchMobile()) applyValue();
    };
    input.addEventListener("input", onValueChange);
    input.addEventListener("keydown", onValueChange);
    input.addEventListener("blur", onBlur);
    resultList.addEventListener("click", onValueChange);

    return () => {
      input.removeEventListener("input", onValueChange);
      input.removeEventListener("keydown", onValueChange);
      input.removeEventListener("blur", onBlur);
      resultList.removeEventListener("click", onValueChange);
      instance.destroy();
      autocomplete.current = null;
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isTouchMobile()) return;
    refAutocomplete.current?.querySelector("input")?.blur();
    autocomplete.current?.core.handleBlur();
    applyValue();
  };

  const onDrag = () => {
    const input = refAutocomplete.current?.querySelector("input");
    if (!input || input.value === "") return;
    input.value = "";
    if (!isTouchMobile()) applyValue();
  };

  return (
    <section
      {...rest}
      {...(sliceId ? { sliceid: sliceId } : null)}
      data-v-051a504d=""
      className={className ? `SliceBlockchainsSearch --bg-grey8 ${className}` : "SliceBlockchainsSearch --bg-grey8"}
    >
      <div data-v-051a504d="" className="SliceBlockchainsSearch-wrapper">
        <div data-v-051a504d="" className="SliceBlockchainsSearch-content">
          <h2 data-v-051a504d="" className="AppTitle-6">
            {title}
          </h2>
          <div data-v-051a504d="" className="SliceBlockchainsSearch-contentText AppText-2 --c-grey1">
            {text}
          </div>
          <form
            data-v-051a504d=""
            className="SliceBlockchainsSearch-inputWrap"
            role="search"
            onSubmit={onSubmit}
          >
            <div data-v-051a504d="" className="SliceBlockchainsSearch-input --text-30">
              {/* Markup of the Vue `Autocomplete`; the vanilla build of the same library drives it (and sets the combobox role and aria-* attributes at init). */}
              <div
                ref={refAutocomplete}
                className="autocomplete"
                data-expanded="false"
                data-loading="false"
                data-position="below"
                style={{ position: "relative" }}
              >
                <input
                  className="autocomplete-input"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="on"
                  spellCheck={false}
                  // The library reads this on Enter before it has ever written it.
                  aria-activedescendant=""
                  placeholder={placeholder}
                  aria-label={placeholder}
                />
                <ul
                  className="autocomplete-result-list"
                  role="listbox"
                  data-lenis-prevent="true"
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    width: "100%",
                    visibility: "hidden",
                    pointerEvents: "none",
                    top: "100%",
                  }}
                />
              </div>
            </div>
          </form>
        </div>
        <div data-v-051a504d="" className="SliceBlockchainsSearch-blockchains">
          <BlockchainsWheel data-v-051a504d="" ref={refWheel} blockchains={featured} onDrag={onDrag} />
        </div>
      </div>
    </section>
  );
}
