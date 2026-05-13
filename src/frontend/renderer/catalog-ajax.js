document.addEventListener("DOMContentLoaded", () => {
  const DATA_URL = "./data/catalog.json";

  const categoryContainer = document.getElementById("catalog-page-category-container");
  const carsContainer = document.getElementById("catalog-page-cars-container");

  async function loadCatalog() {
    try {
      showLoading();

      const response = await fetch(DATA_URL);

      if (!response.ok) {
        throw new Error("Не вдалося завантажити catalog.json");
      }

      const data = await response.json();

      if (!data.categories.length || !data.cars.length) {
        throw new Error("Файл catalog.json порожній або має неправильну структуру");
      }

      window.catalogState.data = data;
      window.catalogState.activeCategory = "all";

      renderCatalog();
      setupCategoryEvents();

      if (window.setupCatalogSearch) window.setupCatalogSearch();
      if (window.setupCatalogFilters) window.setupCatalogFilters();
      if (window.setupContactForm) window.setupContactForm();
      if (window.setupCarDetails) window.setupCarDetails();
      if (window.showSavedUserGreeting) window.showSavedUserGreeting();

    } catch (error) {
      showError(error.message);
    }
  }

  window.renderCatalog = function () {
    const state = window.catalogState;

    if (window.renderCatalogCategories) {
      window.renderCatalogCategories(state.data.categories, state.activeCategory);
    }

    const filteredCars = window.getFilteredCars
      ? window.getFilteredCars()
      : state.data.cars.filter(car => car.category === state.activeCategory);

    if (window.renderCatalogCars) {
      window.renderCatalogCars(filteredCars, state.activeCategory);
    }

    if (filteredCars.length === 0) {
      showEmptyMessage();
    }
  };

  function setupCategoryEvents() {
    if (!categoryContainer) return;

    categoryContainer.addEventListener("click", event => {
      const button = event.target.closest("[data-catalog-category]");

      if (!button) return;

      window.catalogState.activeCategory = button.dataset.catalogCategory;
      window.renderCatalog();
    });
  }

  function showLoading() {
    if (carsContainer) {
      carsContainer.innerHTML = "<p>Завантаження каталогу...</p>";
    }
  }

  function showError(message) {
    if (carsContainer) {
      carsContainer.innerHTML = `<p class="text-danger">${message}</p>`;
    }
  }

  function showEmptyMessage() {
    if (carsContainer) {
      carsContainer.innerHTML = "<p>За вибраними параметрами автомобілі не знайдено.</p>";
    }
  }

  loadCatalog();
});