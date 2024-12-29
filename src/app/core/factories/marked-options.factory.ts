import { MarkedOptions, MarkedRenderer } from 'marked';

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  // Customize link rendering
  renderer.link = (href: string, title: string, text: string) => {
    const isExternal = href?.startsWith('http');
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${target}${title ? ` title="${title}"` : ''}>${text}</a>`;
  };

  // Customize code block rendering
  renderer.code = (code: string, language: string | undefined) => {
    const validLanguage = language || 'plaintext';
    return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
  };

  // Customize heading rendering
  renderer.heading = (text: string, level: number) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `
      <h${level} id="${escapedText}">
        ${text}
        <a class="header-anchor" href="#${escapedText}">
          <span class="anchor-icon">#</span>
        </a>
      </h${level}>`;
  };

  return {
    renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: true,
    headerIds: true,
    mangle: false
  };
}
