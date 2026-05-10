window.setupCarDetails = function () {
  const carsContainer = document.getElementById("catalog-page-cars-container");

  if (!carsContainer) return;

  carsContainer.addEventListener("click", event => {
    const button = event.target.closest(".catalog-page-car-button");

    if (!button) return;

    event.preventDefault();

    const card = button.closest(".catalog-page-car-card");

    if (!card) return;

    const title = card.querySelector(".catalog-page-car-title")?.textContent.trim();
    const car = window.catalogState.data.cars.find(item => item.title === title);

    if (!car) return;

    showCarDetails(car);
  });
};

function showCarDetails(car) {
  let modal = document.getElementById("car-details-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "car-details-modal";
    modal.innerHTML = `
      <div class="car-details-modal-window">
        <button type="button" class="car-details-modal-close">×</button>
        <h3 class="car-details-modal-title"></h3>
        <p class="car-details-modal-text"></p>
        <ul class="car-details-modal-list"></ul>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", event => {
      if (
        event.target.id === "car-details-modal" ||
        event.target.classList.contains("car-details-modal-close")
      ) {
        modal.classList.remove("car-details-modal-active");
      }
    });
  }

  modal.querySelector(".car-details-modal-title").textContent = car.title;
  modal.querySelector(".car-details-modal-text").textContent = car.text;
  modal.querySelector(".car-details-modal-list").innerHTML = `
    <li><strong>Категорія:</strong> ${car.categoryTitle}</li>
    <li><strong>Рік:</strong> ${car.year}</li>
    <li><strong>Паливо:</strong> ${car.fuel}</li>
    <li><strong>Коробка:</strong> ${car.transmission}</li>
    <li><strong>Ціна:</strong> ${car.price}</li>
  `;

  modal.classList.add("car-details-modal-active");
}