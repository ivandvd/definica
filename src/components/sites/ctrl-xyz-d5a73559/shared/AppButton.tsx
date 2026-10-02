import { AppLink, type AppLinkProps } from "./AppLink";
import { AppSvg } from "./AppSvg";
import type { IconName } from "./icons";

export interface AppButtonProps extends AppLinkProps {
  label?: string | null;
  icon?: IconName | null;
  size?: "small" | "medium";
  theme?: "light" | "dark" | "border-light" | "grey";
  loading?: boolean;
}

/** Port of `AppButton` (scope data-v-a045cdd8). */
export function AppButton({
  label,
  icon,
  size = "medium",
  theme = "dark",
  loading = false,
  className,
  ...link
}: AppButtonProps) {
  const classes = ["AppButton ButtonHover", `--theme-${theme}`, `--size-${size}`, icon ? "--has-icon" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <AppLink data-v-a045cdd8="" {...link} className={classes}>
      {icon ? (
        <div data-v-a045cdd8="" className={`AppButton-icon --${icon}`}>
          <AppSvg data-v-a045cdd8="" name={icon} className="AppButton-iconSvg" />
        </div>
      ) : null}
      {label && !loading ? (
        <span data-v-a045cdd8="" className="AppButton-label --tablet-text-16 --mobile-text-12 --fw-600">
          {label}
        </span>
      ) : null}
      {loading ? (
        <span data-v-a045cdd8="" className="AppButton-loading">
          <div data-v-a045cdd8="" className="loader loader--style3" title="2">
            <svg
              data-v-a045cdd8=""
              id="loader-1"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40px"
              height="40px"
              viewBox="0 0 50 50"
            >
              <path
                data-v-a045cdd8=""
                d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
              >
                <animateTransform
                  attributeType="xml"
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </span>
      ) : null}
    </AppLink>
  );
}
