import { cn } from "@/lib/utils";
import { motion, MotionProps } from "motion/react";

interface LineShadowTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  shadowColor?: string;
  as?: React.ElementType;
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motion.create(Component);
  const content = typeof children === "string" ? children : null;

  if (!content) {
    throw new Error("LineShadowText only accepts string content");
  }

  return (
    <MotionComponent
      style={{ "--shadow-color": shadowColor } as React.CSSProperties}
      className={cn(
        "relative z-0 inline-flex whitespace-nowrap",
        "after:absolute after:left-[0.08em] after:top-[0.08em] after:content-[attr(data-text)]", // Increased offset
        "after:bg-[linear-gradient(45deg,transparent_40%,var(--shadow-color)_40%,var(--shadow-color)_60%,transparent_0)]", // Wider gradient
        "after:-z-10 after:bg-[length:0.1em_0.1em] after:bg-clip-text after:text-transparent", // bigger pattern
        "after:animate-line-shadow",
        className,
      )}
      data-text={content}
      {...props}
    >
      {content}
    </MotionComponent>
  );
}
