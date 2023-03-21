
const error = $("#error-message");

function validateForm() {
    let form = document.forms['username-input'];
    if (form['username'].value == "") {
        error.style.visibility = 'visible';
        return false;
    }
}