/**
 * Joins class strings, dropping falsy values.
 *
 * Deliberately not `clsx` + `tailwind-merge`: every variant map in
 * app/components/ui is exhaustive, so there are no conflicting utilities to
 * merge away. If you find yourself needing a merge, the variant map is wrong.
 *
 * Caveat: a bare utility passed in `className` cannot beat one the component
 * sets itself — `hidden` does not override `inline-flex`, because both are
 * single-class selectors and stylesheet source order decides, not the order of
 * the class attribute. Responsive and state variants (`md:hidden`) are fine.
 * Put layout concerns on a wrapper element instead.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
