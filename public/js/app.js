import { homePage, aboutPage, notFoundPage } from '../pages/homepage.js';
import { loginPage } from "../pages/login.js";
const routes = {
    '/': {
        page: homePage,
        title: 'Home'
    },
    '/about': {
        page: aboutPage,
        title: 'About'
    },
    '/404': {
        page: notFoundPage,
        title: '404 - Page Not Found'
    },
    "/login": {
        page: loginPage,
        title: "Login"
    }
};

function router() {
    const path = window.location.pathname;
    const page = routes[path] || routes['/404'];
    document.title = page.title;
    document.getElementById('app').innerHTML = page.page();
}

window.addEventListener('popstate', router);
document.querySelectorAll('.route').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', e.target.href);
        router();
    });
});

router(); // Initial call to load the default page
