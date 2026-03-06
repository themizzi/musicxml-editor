const button = document.getElementById("action-button");
const statusText = document.getElementById("status");

let clickCount = 0;

button.addEventListener("click", () => {
  clickCount += 1;
  statusText.textContent = `Button clicked ${clickCount} time${clickCount === 1 ? "" : "s"}.`;
});
