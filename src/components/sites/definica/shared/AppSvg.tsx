import type { HTMLAttributes, Ref } from "react";
import { icons, type IconName } from "./icons";

interface AppSvgProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "dangerouslySetInnerHTML"> {
  name: IconName;
  ref?: Ref<HTMLSpanElement>;
}

/** Port of `AppSvg`: inlines an icon by name inside `<span class="AppSvg">`. */
export function AppSvg({ name, className, ref, ...rest }: AppSvgProps) {
  return (
    <span
      ref={ref}
      data-v-19e1002b=""
      // Decorative unless it's given a name: the text beside it says what it is.
      aria-hidden={rest["aria-label"] || rest.title ? undefined : true}
      {...rest}
      className={className ? `AppSvg ${className}` : "AppSvg"}
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}
