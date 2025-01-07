# how to create a new page

- add login to the router [here](public/js/app.js#L5)
- create the page in public/pages
- make something similar to this

```js
import { attach } from "../js/utils.js";
import { attachBaseLayout } from "./layouts.js";

export function notFoundPage() {
  await attachBaseLayout(
    /*html*/ `
        // the page content
    `,
    capabilities,
  );
}

function capabilities() {
  // all event listeners here
}
```

- if there is a form, add the event listener to the capabilities function
- send request to golang for example

```js
try {
  const response = await SpecialFetch("/auth/login", "POST", {
    email,
    password,
  });
  if (!response) throw "could not get the response";
  if (response.status === 404) throw "please create an account";
  if (response.status === 401) throw "your email or password is incorrect";
  response.headers.forEach((value, name, parent) => {
    console.log("name", name);
    console.log("value", value);
    console.log("parent", parent);
  });
  const data = await response.json();

  console.log("data", data);
  reRoute("/");
} catch (error) {
  console.log("error", error);
}
```

- create golang handler with /api/<action name>
- [temp] make the auth middleware to check the token
- check the db in go if you need
- return the result to js
- do whatever you want

- errors
- when register error happen no message shown

