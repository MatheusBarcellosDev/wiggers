import type { HTMLAttributes } from "react";

type BrandMarkProps = {
  className?: string;
  size?: number;
  opacity?: number;
  decorative?: boolean;
} & HTMLAttributes<HTMLImageElement>;

export function BrandMark({
  className = "",
  size = 64,
  opacity = 1,
  decorative = true,
  ...rest
}: BrandMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/wiggers-mark.png"
      alt={decorative ? "" : "Wiggers"}
      width={size}
      height={size}
      className={`select-none object-contain ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden={decorative || undefined}
      draggable={false}
      {...rest}
    />
  );
}
