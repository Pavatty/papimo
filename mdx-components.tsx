import type { MDXComponents } from "@/types/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-ink mb-4 text-3xl font-bold" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-ink mt-8 mb-3 text-xl font-semibold" {...props} />
    ),
    p: (props) => (
      <p className="text-ink-soft mb-3 leading-relaxed" {...props} />
    ),
    ...components,
  };
}
