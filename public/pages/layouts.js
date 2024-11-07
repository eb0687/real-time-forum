import { Nav } from "../components/nav.js";
import { attach, getCookie, PreventDefaultATag, reRoute } from "../js/utils.js";


export async function attachBaseLayout(content, capabilities) {

    
    
    const { nav, cap } = await Nav();


    if (getCookie("auth_token") === null) {
        console.log("re route to login");
        await reRoute("/login");
        return
    }

    attach(/*html*/ `
        ${nav}
        ${content}
    `);
    PreventDefaultATag();
    
    capabilities();
    cap()

    
}
