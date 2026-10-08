"use client";

import { createElement, useEffect, useImperativeHandle, useRef, useState, type HTMLAttributes, type Ref } from "react";
import type { DotLottiePlayer } from "@dotlottie/player-component";
import { ORIGIN } from "./content";
import { useObserve } from "./observe";

export interface LottiePlayerHandle {
  /** Restarts from frame 0 and plays. */
  play: () => void;
  /** Lets the current loop finish, then pauses. */
  pause: () => void;
}

export interface LottiePlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Name of a bundled animation (`/lottie/<name>.json` on the source site). */
  name?: string | null;
  /** URL of the lottie JSON. */
  url?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  /** Declared by the original but never read. */
  observers?: boolean;
  ref?: Ref<LottiePlayerHandle>;
}

/** Port of `LottiePlayer`: client-only `<dotlottie-player>` that plays while in view (or on demand via the handle). */
export function LottiePlayer({
  name = null,
  url = null,
  autoplay = true,
  loop = true,
  observers: _observers = true,
  className,
  ref,
  ...rest
}: LottiePlayerProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const refPlayer = useRef<DotLottiePlayer>(null);
  // Port of <ClientOnly>: the web component is registered and rendered after mount only.
  const [mounted, setMounted] = useState(false);
  const inView = useRef(false);
  const playRequested = useRef(false);

  const latest = useRef({ autoplay, loop });
  useEffect(() => {
    latest.current = { autoplay, loop };
  });

  const [controls] = useState(() => ({
    // `setCurrentRawFrameValue` exists on lottie-web's AnimationItem but is missing from its typings.
    getLottie: () =>
      refPlayer.current?.getLottie() as
        | (NonNullable<ReturnType<DotLottiePlayer["getLottie"]>> & { setCurrentRawFrameValue: (frame: number) => void })
        | undefined,
    pauseLottie() {
      this.getLottie()?.pause();
    },
    playLottie() {
      this.getLottie()?.play();
    },
    play() {
      playRequested.current = true;
      const lottie = this.getLottie();
      if (!lottie) return;
      lottie.setCurrentRawFrameValue(0);
      lottie.play();
      lottie.removeEventListener("loopComplete");
    },
    pause() {
      playRequested.current = false;
      this.getLottie()?.addEventListener("loopComplete", () => this.pauseLottie());
    },
  }));

  useEffect(() => {
    let cancelled = false;
    void import("@dotlottie/player-component").then(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const player = refPlayer.current;
    if (!player) return;
    // The animation loads asynchronously; replay whatever was requested before it was ready.
    const onReady = () => {
      // This player build drops the `loop` property when it loads the animation, so apply it explicitly.
      player.setLooping(latest.current.loop);
      if (playRequested.current) controls.play();
      else if (inView.current && latest.current.loop && latest.current.autoplay) controls.playLottie();
    };
    player.addEventListener("ready", onReady);
    return () => {
      player.removeEventListener("ready", onReady);
      player.getLottie()?.pause();
    };
  }, [mounted, controls]);

  useObserve(refEl, {
    once: false,
    onEnter: () => {
      inView.current = true;
      if (!loop || !autoplay) return;
      controls.playLottie();
    },
    onLeave: () => {
      inView.current = false;
      if (!loop || !autoplay) return;
      controls.pauseLottie();
    },
  });

  useImperativeHandle(ref, () => ({ play: () => controls.play(), pause: () => controls.pause() }), [controls]);

  const src = name ? `${ORIGIN}/lottie/${name}.json` : url;

  return (
    <div
      ref={refEl}
      data-v-dacb824b=""
      aria-hidden="true"
      {...rest}
      className={className ? `LottiePlayer ${className}` : "LottiePlayer"}
    >
      {mounted
        ? createElement("dotlottie-player", {
            ref: refPlayer,
            "data-v-dacb824b": "",
            class: "LottiePlayer-lottie",
            src,
            controls: false,
            subframe: true,
            loop,
          })
        : null}
    </div>
  );
}
