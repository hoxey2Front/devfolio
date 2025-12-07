'use client';

import { motion, HTMLMotionProps } from 'motion/react';

interface ShinyTextProps extends HTMLMotionProps<"div"> {
  text: string;
  disabled?: boolean;
  hoverOnSelf?: boolean;
  initialColor?: string;
}

export const ShinyText = ({ text, disabled = false, hoverOnSelf = true, initialColor = "var(--foreground)", className, ...props }: ShinyTextProps) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial="initial"
      whileHover={disabled || !hoverOnSelf ? undefined : "hover"}
      {...props}
    >
      <motion.span
        className="block bg-clip-text"
        style={{
          backgroundImage: "linear-gradient(-90deg, var(--grad-a), var(--grad-b), var(--grad-c), var(--grad-a))",
          backgroundSize: "200% auto",
        }}
        variants={{
          initial: {
            backgroundPosition: "0% 50%",
            color: initialColor,
          },
          hover: {
            backgroundPosition: ["0% 50%", "-200% 50%"],
            color: "transparent",
            transition: {
              backgroundPosition: {
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              },
              color: {
                duration: 0.2,
                ease: "easeOut",
              }
            },
          },
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};
