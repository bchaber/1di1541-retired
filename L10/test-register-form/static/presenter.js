newModel = function() { return {
    firstname: '',
    lastname:  '',
    password:  '', isPasswordErrorVisible: false,
    password2: '', isPassword2ErrorVisible: false,
    birthdate: '', isBirthdateErrorVisible: false,
    login:  '',    isLoginErrorVisible: false, isWaitingForLogin: false,
    pesel:  '',    isPeselErrorVisible: false,
    gender: '',    isGenderErrorVisible: false,
    photo:  '',
    isSubmitEnabled: false
};
}

newPresenter = function(model) { return {
    model: model,
    onFirstnameChange() { },
    onLastnameChange() { },
    onPasswordChange() {
        if (model.password.length < 10)
            model.isPasswordErrorVisible = true;
        else
            model.isPasswordErrorVisible = false;
    },
    onPassword2Change() {
        if (model.password != model.password2)
            model.isPassword2ErrorVisible = true;
        else
            model.isPassword2ErrorVisible = false;
    },
    onBirthdateChange() { },
    onLoginChange() {
        fetch('http://edi.iem.pw.edu.pl/chaberb/register/check/' + model.login)
            .then(function (response) { return response.json();})
            .then(function (data) {
                if (data[model.login] === true) {
                    model.isLoginErrorVisible = true;
                } else {
                    model.isLoginErrorVisible = false;
                }
                model.isWaitingForLogin = false;
	        model.isSubmitEnabled = presenter.canSubmitForm();
                view.loadFromModel();
            });
        model.isWaitingForLogin = true;
    },
    onPeselChange() {
        model.gender = presenter.genderFromPesel(model.pesel);
        model.isGenderErrorVisible = false; // assume we did a good job
    },
    onGenderChange() {
        if (model.pesel) {
            if (presenter.genderFromPesel(model.pesel) == model.gender) {
                model.isGenderErrorVisible = false;
            } else {
                model.isGenderErrorVisible = true;
            }
        } else if (model.gender == 'F' || model.gender == 'M') {
            model.isGenderErrorVisible = false;
        } else {
            model.isGenderErrorVisible = true;
        }
    },
    onPhotoChange() {
    },
    onFormSubmit() {
        if (presenter.canSubmitForm())
            console.info("Submit:" + JSON.stringify(model));
        else
            console.error("Can't submit");
    },
    canSubmitForm() {
        if (model.firstname == '') return false;
        if (model.lastname  == '') return false;
        if (model.gender  == '') return false;
        if (model.isPasswordErrorVisible)   return false;
        if (model.isPassword2ErrorVisible)  return false;
        if (model.isBirthdateErrorVisible)  return false;
        if (model.isLoginErrorVisible)  return false;
        if (model.isPeselErrorVisible)  return false;
        if (model.isGenderErrorVisible) return false;
        if (model.isWaitingForLogin) return false;
        return true;
    },
    genderFromPesel(pesel) {
        return 'M';
    }
}
}

model = newModel();
presenter = newPresenter(model);
view.model = presenter.model;
