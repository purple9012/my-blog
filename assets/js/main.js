(function () {
  function excerptOf(body) {
    const firstParagraph = body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !p.startsWith("#"));
    if (!firstParagraph) return "";
    const plain = firstParagraph.replace(/[*_`>#]/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "…" : plain;
  }

  function renderPostCard(post, meta, body) {
    const li = document.createElement("li");
    li.className = "post-card";

    const link = document.createElement("a");
    link.className = "post-card-link";
    link.href = `post.html?slug=${encodeURIComponent(post.slug)}`;

    const title = document.createElement("h2");
    title.className = "post-card-title";
    title.textContent = meta.title || post.slug;

    const date = document.createElement("time");
    date.className = "post-card-date";
    date.textContent = meta.date || "";

    const excerpt = document.createElement("p");
    excerpt.className = "post-card-excerpt";
    excerpt.textContent = excerptOf(body);

    link.appendChild(title);
    link.appendChild(date);
    link.appendChild(excerpt);

    if (meta.tags && meta.tags.length) {
      const tagList = document.createElement("div");
      tagList.className = "post-card-tags";
      meta.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagList.appendChild(span);
      });
      link.appendChild(tagList);
    }

    li.appendChild(link);
    return li;
  }

  function renderPosts() {
    const list = document.querySelector("[data-post-list]");
    if (!list) return;

    const parsed = POSTS.map((post) => {
      const { meta, body } = parseFrontMatter(post.raw);
      return { post, meta, body };
    }).sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

    if (parsed.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "아직 작성된 글이 없습니다.";
      list.appendChild(empty);
      return;
    }

    parsed.forEach(({ post, meta, body }) => {
      list.appendChild(renderPostCard(post, meta, body));
    });
  }

  document.addEventListener("DOMContentLoaded", renderPosts);
})();
