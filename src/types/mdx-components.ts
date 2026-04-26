import type { ComponentType, SVGProps } from "react";

/** Types attendus par `useMDXComponents` (équivalent minimal de mdx/types, compatible TypeScript strict). */
export type MDXComponents = {
  [Key in string]?: ComponentType<Record<string, unknown>> | string;
} & {
  a?: ComponentType<Record<string, unknown>>;
  p?: ComponentType<Record<string, unknown>>;
  h1?: ComponentType<Record<string, unknown>>;
  h2?: ComponentType<Record<string, unknown>>;
  svg?: ComponentType<SVGProps<SVGSVGElement>>;
};
