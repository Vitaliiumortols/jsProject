document.addEventListener("DOMContentLoaded", () => {
  const testCategories = [
    { id: "sedans", title: "Седани" }
  ];

  const testCars = [
    {
      category: "sedans",
      categoryTitle: "Седани",
      title: "Mercedes C-Class",
      text: "Стильний седан для щоденного міського ритму та комфортних поїздок.",
      year: "2024",
      transmission: "Автомат",
      fuel: "Бензин",
      price: "від $52,000",
      image: "../images/c-class.avif"
    }
  ];

  if (window.renderCatalogCategories) {
    window.renderCatalogCategories(testCategories, "sedans");
  }

  if (window.renderCatalogCars) {
    window.renderCatalogCars(testCars, "sedans");
  }
});
