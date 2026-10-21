// robots.txt: preview builds ask search engines to stay away; production lists the sitemap.
export function GET({ site }) {
  const preview = import.meta.env.PUBLIC_PREVIEW === '1';
  const lines = preview
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /', ...(site ? [`Sitemap: ${new URL('/sitemap-index.xml', site).href}`] : [])];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
