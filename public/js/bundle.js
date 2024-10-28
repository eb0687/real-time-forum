(()=>{function u(t){document.getElementById("app").innerHTML=t}function c(t){history.pushState({},"",t),i()}function s(){document.querySelectorAll("a").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault(),history.pushState({},"",e.target.href),i()})})}function l(t){var e=document.cookie,r=t+"=",o=e.indexOf("; "+r);if(o==-1){if(o=e.indexOf(r),o!=0)return null}else{o+=2;var n=document.cookie.indexOf(";",o);n==-1&&(n=e.length)}return decodeURI(e.substring(o+r.length,n))}var m=()=>`
    <nav>
        <a href="/" class="route">Home</a>
        <a href="/about" class="route">About</a>
        <a href="/login" class="route">login</a>
        <a href="/register" class="route">register</a>
    </nav>
`;function a(t){u(`
        ${m()}
        ${t}
    `),s()}function p(){a(`
        <div>home page</div>
    `)}function f(){console.log("loginPage");let t=l("uuid");if(console.log("document.cookie",document.cookie),t){c("/");return}a(`
        <form id="login-form">
            <input type="text" name="email" id="email">
            <input type="password" name="password" id="password">
            <button type="submit">login</button>
        </form>
    `),x()}function x(){document.getElementById("login-form").addEventListener("submit",async t=>{t.preventDefault();let e=document.getElementById("email").value,r=document.getElementById("password").value;try{let o=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:r})});if(!o)throw"could not get the response";if(o.status===404)throw"please create an account";if(o.status===401)throw"your email or password is incorrect";o.headers.forEach((h,v,y)=>{console.log("name",v),console.log("value",h),console.log("parent",y)});let n=await o.json();console.log("data",n),c("/")}catch(o){console.log("error",o)}})}function g(){a(`
        <div>The Page you are looking for does not exist</div>
    `)}var d={"/":{page:p,title:"Home"},"/404":{page:g,title:"404 - Page Not Found"},"/login":{page:f,title:"Login"}};function i(){let t=window.location.pathname,e=d[t]||d["/404"];document.title=e.title,e.page()}window.addEventListener("popstate",i);s();i();})();
