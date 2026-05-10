 window.getFilteredCars = function () {
  const state = window.catalogState;

  const minPriceInput = document.getElementById("filter-price-from");
  const maxPriceInput = document.getElementById("filter-price-to");
  const fuelSelect = document.getElementById("filter-fuel");
  const transmissionSelect = document.getElementById("filter-transmission");
  const yearSelect = document.getElementById("filter-year");
  const sortSelect = document.getElementById("filter-sort");

  let cars = state.data.cars.filter(car => car.category === state.activeCategory);

  const minPrice = Number(minPriceInput?.value) || 0;
  const maxPrice = Number(maxPriceInput?.value) || Infinity;

  const fuelValue = fuelSelect?.value || "Усі варіанти";
  const transmissionValue = transmissionSelect?.value || "Усі варіанти";
  const yearValue = yearSelect?.value || "Будь-який";
  const sortValue = sortSelect?.value || "За замовчуванням";
  const searchValue = state.searchValue.trim().toLowerCase();

  cars = cars.filter(car => {
    const matchesSearch =
      searchValue === "" ||
      car.title.toLowerCase().includes(searchValue);

    const matchesMinPrice = car.priceNumber >= minPrice;
    const matchesMaxPrice = car.priceNumber <= maxPrice;
    const matchesFuel = fuelValue === "Усі варіанти" || car.fuel === fuelValue;
    const matchesTransmission = transmissionValue === "Усі варіанти" || car.transmission === transmissionValue;
    const matchesYear = yearValue === "Будь-який" || String(car.year) === String(yearValue);

    return (
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesFuel &&
      matchesTransmission &&
      matchesYear
    );
  });

  if (sortValue === "Спочатку дешевші") {
    cars.sort((a, b) => a.priceNumber - b.priceNumber);
  }

  if (sortValue === "Спочатку дорожчі") {
    cars.sort((a, b) => b.priceNumber - a.priceNumber);
  }

  if (sortValue === "Новіші") {
    cars.sort((a, b) => Number(b.year) - Number(a.year));
  }

  return cars;
};

window.setupCatalogSearch = function () {
  const catalogHeader = document.querySelector(".catalog-page-header");

  if (!catalogHeader) return;
  if (document.getElementById("catalog-search-input")) return;

  const searchWrapper = document.createElement("div");
  searchWrapper.className = "catalog-search-wrapper";

  searchWrapper.innerHTML = `
    <input
      id="catalog-search-input"
      class="catalog-search-input"
      type="text"
      placeholder="Пошук автомобіля за назвою..."
    >
  `;

  catalogHeader.insertAdjacentElement("afterend", searchWrapper);

  const searchInput = document.getElementById("catalog-search-input");

  searchInput.addEventListener("input", event => {
    const searchText = event.target.value.trim();

    window.catalogState.searchValue = searchText;

    if (searchText !== "") {
      const foundCar = window.catalogState.data.cars.find(car =>
        car.title.toLowerCase().includes(searchText.toLowerCase())
      );

      if (foundCar) {
        window.catalogState.activeCategory = foundCar.category;
      }
    }

    if (window.renderCatalog) {
      window.renderCatalog();
    }
  });

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (window.renderCatalog) {
        window.renderCatalog();
      }
    }
  });
};

window.setupCatalogFilters = function () {
  const minPriceInput = document.getElementById("filter-price-from");
  const maxPriceInput = document.getElementById("filter-price-to");
  const fuelSelect = document.getElementById("filter-fuel");
  const transmissionSelect = document.getElementById("filter-transmission");
  const yearSelect = document.getElementById("filter-year");
  const sortSelect = document.getElementById("filter-sort");

  const applyButton = document.querySelector(".catalog-filter-apply-button");
  const resetButton = document.querySelector(".catalog-filter-reset-button");

  function applyFilters() {
    const currentScroll = window.scrollY;

    if (window.renderCatalog) {
      window.renderCatalog();
    }

    window.scrollTo({
      top: currentScroll,
      behavior: "auto"
    });
  }

  if (applyButton) {
    applyButton.addEventListener("click", event => {
      event.preventDefault();
      applyFilters();
    });
  }

  [minPriceInput, maxPriceInput, fuelSelect, transmissionSelect, yearSelect, sortSelect].forEach(element => {
    if (!element) return;

    element.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
      }
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", event => {
      event.preventDefault();

      const currentScroll = window.scrollY;

      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";

      if (fuelSelect) fuelSelect.selectedIndex = 0;
      if (transmissionSelect) transmissionSelect.selectedIndex = 0;
      if (yearSelect) yearSelect.selectedIndex = 0;
      if (sortSelect) sortSelect.selectedIndex = 0;

      window.catalogState.searchValue = "";

      const searchInput = document.getElementById("catalog-search-input");

      if (searchInput) {
        searchInput.value = "";
      }

      if (window.renderCatalog) {
        window.renderCatalog();
      }

      window.scrollTo({
        top: currentScroll,
        behavior: "auto"
      });
    });
  }
};
