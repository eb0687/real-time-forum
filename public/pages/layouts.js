import { Nav } from "../components/nav.js";
import { attach, getCookie, PreventDefaultATag, reRoute } from "../js/utils.js";


export async function attachBaseLayout(content, capabilities) {

    console.log("attachBaseLayout");
    
    
    const { nav, cap } = await Nav();

    console.log('content',content)

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
    console.log("attach capabilities");
    
    capabilities();
    cap()

    console.log("-------------------");
    
}
