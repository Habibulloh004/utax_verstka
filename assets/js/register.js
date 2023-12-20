const form = document.getElementById('form');
const fName = document.getElementById('firstName');
const lName = document.getElementById('lastName');
const pNumber = document.getElementById('phoneNumber');

const user = {
    name: '',
    comment: '',
    phone: '',
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = fName.value+ " "+ lName.value;
    user.phone = pNumber.value;
    window.location.href = '/rules.html';
    localStorage.setItem('user', JSON.stringify(user));
})
