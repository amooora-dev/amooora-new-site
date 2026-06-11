const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'span', 'h3', 'h4', 'blockquote',
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

function plainTextToHtml(text: string): string {
  const blocks = text.trim().split(/\n\n+/);
  if (blocks.length === 0) return '';

  return blocks
    .map((block) => {
      const lines = block.split('\n').map(inlineMarkdown);
      if (lines.length === 1) return `<p>${lines[0]}</p>`;
      return `<p>${lines.join('<br />')}</p>`;
    })
    .join('');
}

/** Remove tags e atributos perigosos; mantém formatação básica do admin. */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag: string) => {
      const t = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(t)) return '';
      if (match.startsWith('</')) return `</${t}>`;
      if (t === 'br') return '<br />';
      return `<${t}>`;
    });
}

export function formatProductDescription(raw: string): string {
  const text = raw?.trim() ?? '';
  if (!text) return '';

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(text);
  return looksLikeHtml ? sanitizeHtml(text) : plainTextToHtml(text);
}
