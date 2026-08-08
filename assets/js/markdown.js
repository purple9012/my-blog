/* 외부 라이브러리 없이 동작하는 최소한의 마크다운 -> HTML 파서 */

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* front matter(---로 감싼 메타데이터)를 분리해 { meta, body } 반환 */
function parseFrontMatter(raw) {
  const meta = { title: "", date: "", tags: [] };
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { meta, body: raw };
  }
  const [, block, body] = match;
  block.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (key === "tags") {
      value = value.replace(/^\[|\]$/g, "");
      meta.tags = value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (key === "title" || key === "date") {
      meta[key] = value;
    }
  });
  return { meta, body };
}

/* 인라인 문법(굵게/기울임/코드/링크/이미지) 처리. 입력은 이미 escapeHtml된 텍스트 */
function parseInline(text) {
  let out = text;
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function parseMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;
  let paragraph = [];
  let listType = null; // 'ul' | 'ol'
  let quoteLines = [];

  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${parseInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }
  function flushList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  }
  function flushQuote() {
    if (quoteLines.length) {
      html.push(`<blockquote><p>${parseInline(quoteLines.join(" "))}</p></blockquote>`);
      quoteLines = [];
    }
  }

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 코드 블록
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // 닫는 ``` 건너뜀
      const classAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      html.push(`<pre><code${classAttr}>${codeLines.join("\n")}</code></pre>`);
      continue;
    }

    // 빈 줄
    if (line === "") {
      flushParagraph();
      flushList();
      flushQuote();
      i++;
      continue;
    }

    // 구분선
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push("<hr>");
      i++;
      continue;
    }

    // 헤더
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headerMatch[1].length;
      html.push(`<h${level}>${parseInline(escapeHtml(headerMatch[2]))}</h${level}>`);
      i++;
      continue;
    }

    // 인용구
    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      quoteLines.push(escapeHtml(line.replace(/^>\s?/, "")));
      i++;
      continue;
    }
    flushQuote();

    // 순서 없는 목록
    const ulMatch = line.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${parseInline(escapeHtml(ulMatch[1]))}</li>`);
      i++;
      continue;
    }

    // 순서 있는 목록
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      flushParagraph();
      if (listType !== "ol") {
        flushList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${parseInline(escapeHtml(olMatch[1]))}</li>`);
      i++;
      continue;
    }
    flushList();

    // 일반 문단
    paragraph.push(escapeHtml(line));
    i++;
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join("\n");
}
