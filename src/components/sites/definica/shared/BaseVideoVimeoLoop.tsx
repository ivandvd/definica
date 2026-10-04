"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type SyntheticEvent,
} from "react";

/** Shape of the `vimeo` objects in the clone's content data (local mp4 instead of Vimeo renditions). */
export interface VimeoVideo {
  src: string;
  id?: string;
  name?: string;
  width?: number;
  height?: number;
}

export interface BaseVideoVimeoLoopHandle {
  /** Calls `video.play()` (rewinding first when `restartOnPlay`), without forcing a load. */
  playVideo: () => void;
  /** Loads the source if needed, then plays. */
  play: () => void;
  /** Pauses now, or at the end of the current loop when `completeLoop` is set. */
  pause: (options?: { completeLoop?: boolean }) => void;
}

export interface BaseVideoVimeoLoopProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  video: VimeoVideo | null | undefined;
  restartOnPlay?: boolean;
  /** Declared by the original but never read. */
  sources?: unknown[];
  /** Declared by the original but never read. */
  posterImage?: unknown;
  /** Declared by the original but never read. */
  preferMp4?: boolean;
  /** Declared by the original but never read. */
  useSmallResolution?: boolean;
  preload?: boolean;
  autoplay?: boolean;
  /** Port of the `loaded` emit: fired once, on the first canplay/playing/pause. */
  onLoaded?: () => void;
  ref?: Ref<BaseVideoVimeoLoopHandle>;
}

const WIDTH = 16;
const HEIGHT = 9;
const IS_PORTRAIT = WIDTH < HEIGHT;
const FIGURE_STYLE = { "--ce2eed44": `${WIDTH} / ${HEIGHT}` } as CSSProperties;

/** True when at least `percent`% of the element is inside the viewport vertically. */
function isVisible(el: Element, percent: number) {
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return !(
    Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) < percent ||
    Math.floor(100 - ((rect.bottom - viewportHeight) / rect.height) * 100) < percent
  );
}

/** Port of `BaseVideoVimeoLoop`: muted looping video that lazy-loads its source and plays only while near the viewport. */
export function BaseVideoVimeoLoop({
  video,
  restartOnPlay = false,
  sources: _sources,
  posterImage: _posterImage,
  preferMp4: _preferMp4 = true,
  useSmallResolution: _useSmallResolution = false,
  preload = false,
  autoplay = true,
  onLoaded,
  className,
  style,
  ref,
  ...rest
}: BaseVideoVimeoLoopProps) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const firstLoaded = useRef(false);
  const sourceLoaded = useRef(false);
  const pendingPlay = useRef(false);

  const latest = useRef({ src: video?.src, restartOnPlay, autoplay, onLoaded });
  useEffect(() => {
    latest.current = { src: video?.src, restartOnPlay, autoplay, onLoaded };
  });

  // Stable helpers (they only touch refs), created once so effects and the handle share them.
  const [api] = useState(() => ({
    load() {
      const el = videoEl.current;
      if (sourceLoaded.current) return;
      if (el && latest.current.src) el.src = latest.current.src;
      el?.load();
      sourceLoaded.current = true;
    },
    playVideo() {
      const el = videoEl.current;
      if (!el) return;
      if (latest.current.restartOnPlay) el.currentTime = 0;
      el.play()?.catch(() => {});
    },
  }));

  const onStatus = (event: SyntheticEvent<HTMLVideoElement>) => {
    const el = event.currentTarget;
    const isPlaying = !el.paused && !el.ended && el.readyState > el.HAVE_CURRENT_DATA;
    setPlaying(isPlaying);
    if (!firstLoaded.current) {
      firstLoaded.current = true;
      latest.current.onLoaded?.();
      if (!isPlaying && pendingPlay.current) {
        api.playVideo();
        pendingPlay.current = false;
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      playVideo: api.playVideo,
      play: () => {
        api.load();
        api.playVideo();
      },
      pause: ({ completeLoop = false } = {}) => {
        const el = videoEl.current;
        if (!el) return;
        if (completeLoop) {
          el.loop = false;
          el.addEventListener(
            "ended",
            () => {
              el.pause();
              el.loop = true;
            },
            { once: true },
          );
        } else el.pause();
      },
    }),
    [api],
  );

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!latest.current.autoplay && entry.isIntersecting) api.load();
        else if (entry.isIntersecting) {
          api.load();
          api.playVideo();
        } else {
          pauseTimer = setTimeout(() => el.pause(), 100);
        }
      },
      { threshold: 0, rootMargin: `${window.innerHeight || "1000"}px` },
    );
    observer.observe(el);

    const mountTimer = setTimeout(() => {
      if (isVisible(el, 1) && latest.current.autoplay) {
        pendingPlay.current = true;
        api.load();
        api.playVideo();
      }
    }, 0);

    return () => {
      observer.disconnect();
      clearTimeout(pauseTimer);
      clearTimeout(mountTimer);
    };
  }, [api]);

  useEffect(() => {
    if (preload) api.load();
  }, [preload, api]);

  const classes = ["VideoLoop VideoVimeoLoop", playing && "--playing", IS_PORTRAIT && "--portrait", className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure data-v-5e2f9dfa="" {...rest} className={classes} style={{ ...FIGURE_STYLE, ...style }}>
      <video
        ref={videoEl}
        className="VideoLoop-video"
        muted
        playsInline
        disablePictureInPicture
        loop
        preload="metadata"
        width={WIDTH}
        height={HEIGHT}
        crossOrigin="anonymous"
        data-v-5e2f9dfa=""
        onCanPlay={onStatus}
        onPlaying={onStatus}
        onPause={onStatus}
      />
    </figure>
  );
}
