/**
 * Model ids carry characters (":", "@") that don't belong in a URL segment.
 * The slug isn't reversible on its own — callers look the real model string
 * up by re-slugging every candidate and matching, rather than decoding.
 */
export function slugModel(model: string): string {
  return model.replace(/[^a-zA-Z0-9._-]/g, "_");
}
