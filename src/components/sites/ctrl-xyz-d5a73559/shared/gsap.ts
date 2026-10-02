import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Same plugin set the original bundle registers.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable, SplitText, CustomEase);
}

export { gsap, CustomEase, Draggable, ScrollTrigger, SplitText };
