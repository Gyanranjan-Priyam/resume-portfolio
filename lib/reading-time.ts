type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "pullquote"; text: string };

const WORDS_PER_MINUTE = 238;

/**
 * Extracts all text content from blog content blocks
 */
function extractText(content: ContentBlock[]): string {
  const parts: string[] = [];

  for (const block of content) {
    if (block.type === "list") {
      parts.push(...block.items);
    } else {
      parts.push(block.text);
    }
  }

  return parts.join(" ");
}

/**
 * Counts words in a string
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculates estimated reading time for a blog post
 * @param content - Array of content blocks from the blog
 * @returns Formatted reading time string (e.g., "5 min read")
 */
export function calculateReadingTime(content: ContentBlock[]): string {
  const text = extractText(content);
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return `${minutes} min read`;
}
