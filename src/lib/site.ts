/**
 * The deployed hostname has exactly one source of truth: `site` in
 * astro.config.mjs. Every absolute URL the pages print — curl examples,
 * hreflang links — goes through here, so changing the domain is one config
 * edit plus a rebuild, with no template to grep.
 *
 * `Astro.site` is typed `URL | undefined` because a config may omit `site`;
 * ours never does, and a build that lost it should die loudly rather than
 * emit relative curl commands.
 */
export function siteUrl(path: string, site: URL | undefined): string {
  if (!site) {
    throw new Error(
      `astro.config.mjs must set \`site\`: cannot build an absolute URL for ${path}`,
    );
  }
  return new URL(path, site).href;
}
