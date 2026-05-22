(function() {
  const indexPath = "publication/papers/index.json?v=20260522";

  function fetchJson(path) {
    return fetch(path).then(function(response) {
      if (!response.ok) {
        throw new Error("Failed to load " + path + ": " + response.status);
      }
      return response.json();
    });
  }

  function appendText(parent, text) {
    parent.appendChild(document.createTextNode(text));
  }

  function renderAuthors(authors) {
    const authorLine = document.createElement("p");
    authorLine.className = "authors";

    authors.forEach(function(author, index) {
      const name = author.name + (author.suffix || "");
      const node = author.highlight ? document.createElement("strong") : document.createTextNode(name);

      if (author.highlight) {
        node.textContent = name;
      }

      authorLine.appendChild(node);

      if (index < authors.length - 1) {
        appendText(authorLine, ", ");
      }
    });

    return authorLine;
  }

  function renderVenue(paper) {
    const venueLine = document.createElement("p");
    venueLine.className = "venue";

    const venue = document.createElement("em");
    venue.textContent = paper.year ? paper.venue + ", " + paper.year : paper.venue;
    venueLine.appendChild(venue);

    paper.badges.forEach(function(badge) {
      const badgeNode = document.createElement("span");
      badgeNode.textContent = badge;
      venueLine.appendChild(badgeNode);
    });

    return venueLine;
  }

  function renderMedia(media) {
    const mediaWrap = document.createElement("div");
    mediaWrap.className = "publication-media";

    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = media.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = media.playOnHover ? "metadata" : "auto";

      if (media.poster) {
        video.poster = media.poster;
      }

      if (media.alt) {
        video.setAttribute("aria-label", media.alt);
      }

      if (media.playOnHover) {
        mediaWrap.classList.add("play-on-hover");
        video.tabIndex = 0;

        const playVideo = function() {
          video.play().catch(function() {});
        };

        const resetVideo = function() {
          video.pause();
          video.currentTime = 0;
        };

        mediaWrap.addEventListener("mouseenter", playVideo);
        mediaWrap.addEventListener("mouseleave", resetVideo);
        video.addEventListener("focus", playVideo);
        video.addEventListener("blur", resetVideo);
      } else {
        video.autoplay = true;
      }

      mediaWrap.appendChild(video);
      return mediaWrap;
    }

    if (media.type === "image") {
      const image = document.createElement("img");
      image.src = media.src;
      image.alt = media.alt;
      mediaWrap.appendChild(image);
      return mediaWrap;
    }

    throw new Error("Unsupported publication media type: " + media.type);
  }

  function renderLinks(links) {
    const linkLine = document.createElement("p");
    linkLine.className = "paper-links";

    links.forEach(function(link) {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.textContent = link.label;

      if (link.url.indexOf("http") === 0) {
        anchor.target = "_blank";
        anchor.rel = "noopener";
      }

      linkLine.appendChild(anchor);
    });

    return linkLine;
  }

  function renderPaper(paper) {
    const article = document.createElement("article");
    article.className = paper.group === "selected" ? "publication-card featured" : "publication-card";

    const body = document.createElement("div");
    body.className = "publication-body";

    const title = document.createElement("h3");
    title.textContent = paper.title;

    body.appendChild(title);
    body.appendChild(renderAuthors(paper.authors));
    body.appendChild(renderVenue(paper));
    body.appendChild(renderLinks(paper.links));

    article.appendChild(renderMedia(paper.media));
    article.appendChild(body);

    return article;
  }

  function renderPublications(papers) {
    const selectedList = document.querySelector("#selected-publications");
    const recentList = document.querySelector("#recent-publications");
    const status = document.querySelector("#publication-status");

    selectedList.replaceChildren();
    recentList.replaceChildren();

    papers.forEach(function(paper) {
      const target = paper.group === "selected" ? selectedList : recentList;
      target.appendChild(renderPaper(paper));
    });

    status.remove();
  }

  window.renderPublications = function() {
    const status = document.querySelector("#publication-status");

    return fetchJson(indexPath)
      .then(function(index) {
        return Promise.all(index.papers.map(function(slug) {
          return fetchJson("publication/papers/" + slug + "/paper.json");
        }));
      })
      .then(renderPublications)
      .catch(function(error) {
        status.textContent = error.message;
        throw error;
      });
  };
})();
