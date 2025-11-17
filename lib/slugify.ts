export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ & /g, "-")            // replace & 
    .replace(/[^a-z0-9]+/g, "-")     // replace spaces & special chars
    .replace(/^-+|-+$/g, "");        // trim
}
