import { Nav } from "../components/nav.js";
import { attach, PreventDefaultATag } from "../js/utils.js";

export function attachBaseLayout(content, capabilities) {
    attach(/*html*/ `
        ${Nav()}
        ${content}
    `);
    PreventDefaultATag();
    capabilities();

}