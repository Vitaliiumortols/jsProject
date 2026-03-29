window.renderCatalogCategories = function (categories, activeCategory) {
  const categoryContainer = document.getElementById("catalog-page-category-container");
  const categoryTemplate = document.getElementById("catalog-page-category-template");

  if (!categoryContainer || !categoryTemplate) {
    return;
  }

  categoryContainer.innerHTML = "";

  categories.forEach((category) => {
    const clone = categoryTemplate.content.cloneNode(true);
    const button = clone.querySelector(".catalog-page-category-button");
    const text = clone.querySelector(".catalog-page-category-button-text");

    button.dataset.catalogCategory = category.id;
    text.textContent = category.title;

    if (category.id === activeCategory) {
      button.classList.add("catalog-page-category-button-active");
    }

    categoryContainer.appendChild(clone);
  });
};
