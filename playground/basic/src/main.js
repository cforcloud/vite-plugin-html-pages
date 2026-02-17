import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Hello vite-plugin-html-pages: basic!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`;

function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}

setupCounter(document.querySelector("#counter"));
