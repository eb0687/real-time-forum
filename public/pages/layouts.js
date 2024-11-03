import { Nav } from "../components/nav.js";
import { attach, PreventDefaultATag } from "../js/utils.js";

export function attachBaseLayout(content, capabilities) {
    let { nav, cap } = Nav();

    attach(/*html*/ `
        ${nav}
        ${content}
    `);
    PreventDefaultATag();
    capabilities();

    cap()

}
