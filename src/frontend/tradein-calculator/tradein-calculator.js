document.addEventListener("DOMContentLoaded", () => {
  const currentPriceInput = document.getElementById("tradein-current-price");
  const conditionSelect = document.getElementById("tradein-condition");
  const targetCarSelect = document.getElementById("tradein-target-car");

  const estimatedValue = document.getElementById("tradein-estimated-value");
  const targetValue = document.getElementById("tradein-target-value");
  const differenceValue = document.getElementById("tradein-difference");

  if (!currentPriceInput || !conditionSelect || !targetCarSelect) {
    return;
  }

  function formatPrice(value) {
    return `$${Number(value).toLocaleString("en-US")}`;
  }

  function calculateTradein() {
    const currentPrice = Number(currentPriceInput.value) || 0;
    const condition = Number(conditionSelect.value) || 1;
    const targetPrice = Number(targetCarSelect.value) || 0;

    const estimated = Math.round(currentPrice * condition);
    const difference = Math.max(targetPrice - estimated, 0);

    estimatedValue.textContent = formatPrice(estimated);
    targetValue.textContent = formatPrice(targetPrice);
    differenceValue.textContent = formatPrice(difference);
  }

  currentPriceInput.addEventListener("input", calculateTradein);
  conditionSelect.addEventListener("change", calculateTradein);
  targetCarSelect.addEventListener("change", calculateTradein);

  calculateTradein();
});
