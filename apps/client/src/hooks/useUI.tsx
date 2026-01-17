import { parse } from "yaml";

// TODO: Improve this
export async function loadUI(ui_file: string) {
  async function f() {
    const resp = await fetch("./config/" + ui_file);
    const ui = await resp.text();
    let parsed = undefined;

    try {
      parsed = await parse(ui);
    } catch (err) {
      console.error(err);
      return;
    }

    return parsed;
  }

  return f();
}
