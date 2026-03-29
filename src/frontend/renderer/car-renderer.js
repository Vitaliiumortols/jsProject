window.renderCatalogCars = function (cars, activeCategory) {
  const carsContainer = document.getElementById("catalog-page-cars-container");
  const carTemplate = document.getElementById("catalog-page-car-template");

  if (!carsContainer || !carTemplate) {
    return;
  }

  carsContainer.innerHTML = "";

  const filteredCars = cars.filter((car) => car.category === activeCategory);

  filteredCars.forEach((car) => {
    const clone = carTemplate.content.cloneNode(true);

    const image = clone.querySelector(".catalog-page-car-image");
    const category = clone.querySelector(".catalog-page-car-category");
    const title = clone.querySelector(".catalog-page-car-title");
    const text = clone.querySelector(".catalog-page-car-text");
    const year = clone.querySelector(".catalog-page-car-year");
    const transmission = clone.querySelector(".catalog-page-car-transmission");
    const fuel = clone.querySelector(".catalog-page-car-fuel");
    const price = clone.querySelector(".catalog-page-car-price");

    image.src = car.image;
    image.alt = car.title;
    category.textContent = car.categoryTitle;
    title.textContent = car.title;
    text.textContent = car.text;
    year.textContent = car.year;
    transmission.textContent = car.transmission;
    fuel.textContent = car.fuel;
    price.textContent = car.price;

    carsContainer.appendChild(clone);
  });
};
