document.addEventListener("DOMContentLoaded", () => {
  const pageLinks = document.querySelectorAll("[data-page]");
  const pages = document.querySelectorAll(".spa-page");
  const navLinks = document.querySelectorAll(".site-header-nav-link");
  const navCollapse = document.getElementById("siteHeaderMenu");

  function showPage(pageName) {
    
    if (pageName === 'game') {
      document.body.classList.add("retro-mode");
    } else {
      document.body.classList.remove("retro-mode");
      if (typeof isGameStarted !== 'undefined') isGameStarted = false;
    }

    pages.forEach((page) => {
      page.classList.remove("spa-page-active");
    });

    const targetPage = document.getElementById(`spa-page-${pageName}`);
    if (targetPage) {
      targetPage.classList.add("spa-page-active");
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.page === pageName) {
        link.classList.add("active");
      }
    });

    history.replaceState(null, "", `#${pageName}`);

    if (navCollapse && navCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }
  }

  pageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const pageName = link.dataset.page;
      showPage(pageName);
    });
  });

  const initialPage = window.location.hash
    ? window.location.hash.replace("#", "")
    : "home";

  showPage(initialPage);
});
