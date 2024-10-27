
function LoginForm() {
    return /*html*/`
        <form id="login-form" onsubmit="setUpForm(event)">
            <input type="text" name="email" id="email">
            <input type="password" name="password" id="password">
            <button type="submit">login</button>
        </form>
    `
}


export async function setUpForm(e) {
    e.preventDefault(); // Prevent default form submission
    const form = document.querySelector("login-form")
    if (!form) return;
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response) throw "fuck";
        // Handle successful login
        const data = await response.json();
        console.log('Login successful:', data);
    } catch (error) {
        console.log('error', error)
    }
}




export const loginPage = () => {
    const f = document.querySelector('login-form')
    if (!f) return;
    console.log("fuck");
    f.addEventListener("submit", setUpForm)


    return /*html*/`
        ${LoginForm()}
        <script>
            // No need for a separate setup function; handleLogin is directly bound
            
        </script>
    `
}