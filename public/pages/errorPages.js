import { attachBaseLayout } from "./layouts.js";

export async function internalServerErrorPage() {
  await attachBaseLayout(
    errPage({
      title: "Internal Server Error",
      message: "An internal server error occurred.",
    }),
    capabilities,
  );
}

export async function notFoundPage() {
  await attachBaseLayout(
    errPage({
      title: "Not Found",
      message: "The page you requested could not be found.",
    }),
    capabilities,
  );
}

function errPage({ title, message }) {
  return /*html*/ `
        <link rel="stylesheet" href="/public/css/error.css">
        <main>
            <div >
                <h1>${title}</h1>
                <p>${message}</p>
            </div>
        </main>
    `;
}

function capabilities() {}
