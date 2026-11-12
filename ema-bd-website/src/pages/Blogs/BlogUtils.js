export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export const imageUrl = (file) => `${API_URL}/uploads/${file}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Matches the tags TipTap produces, so plain-text posts that merely
// contain "<" characters (like <name@email.com>) aren't mistaken for HTML.
const HTML_TAG_PATTERN =
  /<(p|h[1-6]|ul|ol|li|blockquote|img|br|strong|em|u|a|span|div)[\s>\\/]/i;

export const isHtmlContent = (text = "") => HTML_TAG_PATTERN.test(text);

// Plain-text preview for cards. Old posts pass through unchanged,
// new HTML posts get their tags stripped.
export const getExcerpt = (text = "") => {
  if (!isHtmlContent(text)) return text;

  const spaced = text.replace(
    /<\/(p|h[1-6]|li|blockquote|div)>|<br\s*\/?>/gi,
    " ",
  );
  const doc = new DOMParser().parseFromString(spaced, "text/html");

  return doc.body.textContent.replace(/\s+/g, " ").trim();
};

// Converts old plain-text content (for example, older event descriptions)
// into safe HTML so the rich text editor keeps the original line breaks.
// Blank lines become new paragraphs; single line breaks become <br>.
export const plainTextToHtml = (text = "") => {
  const normalized = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalized) return "";

  const escaped = normalized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
};