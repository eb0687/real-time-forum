import { attach } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function notFoundPage() {
    attachBaseLayout(/*html*/`
        <div>The Page you are looking for does not exist</div>
    `);

}