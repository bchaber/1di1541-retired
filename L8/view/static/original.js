firstname = document.forms['form']['firstname'];
lastname = document.forms['form']['lastname'];
password = document.forms['form']['password'];
password2 = document.forms['form']['password2'];
birthdate = document.forms['form']['birthdate'];
login = document.forms['form']['login'];
pesel = document.forms['form']['pesel'];
female = document.forms['form']['female'];
male = document.forms['form']['male'];
photo = document.forms['form']['photo'];
button = document.forms['form']['button'];

firstname.addEventListener('blur', function () {
    checkRequired();
});

lastname.addEventListener('blur', function () {
    checkRequired();
});

password.addEventListener('blur', function () {
    if (password.value.length < 7) {
        displayError(password, 'Hasło jest za słabe!');
    } else {
        removeErrors(password);
    }

    checkErrors();
});

password2.addEventListener('blur', function () {
    if (password.value !== password2.value) {
        displayError(password2, 'Hasła nie są identyczne!')
    } else {
        removeErrors(password2);
    }

    checkErrors();
});

login.addEventListener('blur', function () {
    fetch('http://edi.iem.pw.edu.pl/chaberb/register/check/' + login.value)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data[login.value] === true) {
                displayError(login, 'Ten login jest zajęty!');
            } else {
                removeErrors(login);
            }

            checkErrors();
        });
});

pesel.addEventListener('blur', function () {
    if (validatePesel(pesel.value) === false) {
        displayError(pesel, 'Pesel jest niepoprawny!')
    } else {
        determineSex(pesel.value);
        removeErrors(pesel);
    }

    checkErrors();
});

photo.addEventListener('blur', function () {
    checkRequired();
});

function validatePesel(pesel) {
    reg = /^[0-9]{11}$/;
    if (reg.test(pesel) === false) {
        return false;
    } else {
        weight = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
        checksum = 0;

        for (i = 0; i < 10; i++) {
            checksum += parseInt(pesel.substring(i, i + 1), 10) * weight[i];
        }

        checksum = checksum % 10;

        return checksum === parseInt(pesel.substring(10, 11), 10);
    }
}

function determineSex(pesel) {
    if (parseInt(pesel.substring(9, 10), 10) % 2 === 0) {
        female.checked = true;
    } else {
        male.checked = true;
    }
}

function displayError(element, errorMsg) {
    removeErrors(element);

    para = document.createElement('p');
    para.innerHTML = errorMsg;
    para.classList.add('error');

    element.parentElement.appendChild(para);
}

function removeErrors(element) {
    errs = element.parentElement.getElementsByClassName('error');

    for (i = 0; i < errs.length; i++) {
        errs[i].remove();
    }
}

function checkErrors() {
    error_count = document.getElementsByClassName('error').length;

    if (error_count === 0) {
        checkRequired()
    } else {
        button.disabled = true;
    }
}

function checkRequired() {
    if (firstname.value && lastname.value && photo.value) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}