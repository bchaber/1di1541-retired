view = {
    firstname:  document.forms['form']['firstname'],
    lastname:   document.forms['form']['lastname'],
    password:   document.forms['form']['password'],
    password2:  document.forms['form']['password2'],
    birthdate:  document.forms['form']['birthdate'],
    login:  document.forms['form']['login'],
    pesel:  document.forms['form']['pesel'],
    gender: document.forms['form']['gender'],
    photo:  document.forms['form']['photo'],
    submit: document.forms['form']['button'],
    form:   document.forms['form'],
    errors: {},
    loadFromModel: () => {
        m = view.model;
        v = view;
        v.firstname.value        = m.firstname;
        v.lastname.value         = m.lastname;
        v.password.value         = m.password;
        v.password2.value        = m.password2;
        v.birthdate.value        = m.birthdate;
        v.login.value            = m.login;
        v.pesel.value            = m.pesel;
        v.gender.value           = m.gender;
        v.submit.disabled        = !m.isSubmitEnabled;
        v.errors.password.hidden = !m.isPasswordErrorVisible;
        v.errors.password2.hidden = !m.isPassword2ErrorVisible;
        v.errors.birthdate.hidden = !m.isBirthdateErrorVisible;
        v.errors.login.hidden    = !m.isLoginErrorVisible;
        v.errors.pesel.hidden    = !m.isPeselErrorVisible;
        v.errors.gender.hidden   = !m.isGenderErrorVisible;
    }
}

function createViewErrors(view) {
    function createErrorFor(component, message) {
        error = document.createElement('div');
        error.innerHTML = message || "Invalid value";
        component.parentElement.appendChild(error);
        return error;
    }
    view.errors.password  = createErrorFor(view.password, "The password is too simple");
    view.errors.password2 = createErrorFor(view.password2, "The passwords don't match");
    view.errors.birthdate = createErrorFor(view.birthdate);
    view.errors.login     = createErrorFor(view.login, "This login is already taken");
    view.errors.pesel     = createErrorFor(view.pesel);
    view.errors.gender    = createErrorFor(view.gender[0]);
}

function checkView(view) {
    console.log("[Checking view components]")
    for (var component in view) {
        if (view.hasOwnProperty(component)) {
            if (!view[component]) {
                console.error("[!] Could not find " + component);
                return false;
            } else {
                console.log("[👍] " + component + " is in place");
            }
        }
    }
    return true;
}

if (checkView(view)) {
    createViewErrors(view);
}
