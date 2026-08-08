(function () {
  function renderPost() {
    const container = document.querySelector("[data-post-content]");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const post = POSTS.find((p) => p.slug === slug);

    if (!post) {
      container.innerHTML = `
        <p class="empty-state">글을 찾을 수 없습니다.</p>
        <p><a href="index.html">목록으로 돌아가기</a></p>
      `;
      document.title = "글을 찾을 수 없음";
      return;
    }

    const { meta, body } = parseFrontMatter(post.raw);

    document.title = `${meta.title} - my-blog`;

    const tagsHtml = (meta.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    container.innerHTML = `
      <p class="post-back-top"><a href="index.html">← 목록으로</a></p>
      <article class="post">
        <header class="post-header">
          <h1>${escapeHtml(meta.title || post.slug)}</h1>
          <time class="post-date">${escapeHtml(meta.date || "")}</time>
          ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ""}
        </header>
        <div class="post-body">${parseMarkdown(body)}</div>
        <p class="post-back"><a href="index.html">← 목록으로 돌아가기</a></p>
      </article>
    `;
  }

  document.addEventListener("DOMContentLoaded", renderPost);
})();
