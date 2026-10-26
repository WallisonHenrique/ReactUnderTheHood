import { App } from "./app.js";
import { createRooter } from "./react/index.js";

export function Main() {
  return createRooter(document.getElementById("root")).render(App);
}

Main();
