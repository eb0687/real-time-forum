import { attachBaseLayout } from "./layouts.js";

export async function internalServerErrorPage() {
    await attachBaseLayout(/*html*/`
        <div>Internal Server Error</div>
    `, capabilities);
}

export async function notFoundPage() {
    await attachBaseLayout(/*html*/`
        <div>The Page you are looking for does not exist</div>
    `, capabilities);
}

function capabilities() {
    
}