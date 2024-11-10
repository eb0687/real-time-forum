import { attachBaseLayout } from "./layouts.js";

export async function internalServerErrorPage() {
    await attachBaseLayout(errPage(
        {
            title: "Internal Server Error",
            message: "An internal server error occurred."
        }
    ), capabilities);
}

export async function notFoundPage() {
    await attachBaseLayout(errPage(
        {
            title: "Not Found",
            message: "The page you requested could not be found."
        }
    ), capabilities);
}


function errPage({
    title,
    message
}) {

    return /*html*/ `
        <div class="h-100dvh flex justify-center items-center">
            <div class="b-1px-white w-30rem h-10rem flex flex-col justify-center items-center rounded-lg">
                <h1 class="w-fit">${title}</h1>
                <p class="w-fit">${message}</p>
            </div>
        </div>
    `;

}

function capabilities() {

}