const mainPage = document.getElementById('mainPage');

if (window.location.pathname === '/about.html') {
    mainPage.classList.remove('hidden')
    mainPage.classList.add('block')
}