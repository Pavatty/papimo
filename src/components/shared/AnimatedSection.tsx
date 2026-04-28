"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
} & Omit<
  HTMLMotionProps<"section">,
  "initial" | "animate" | "whileInView" | "viewport" | "transition"
>;

export function AnimatedSection({
  children,
  delay = 0,
  className,
  amount = 0.2,
  ...rest
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
