data = {
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
}

presenter = {
    model: data,
    onFirstnameChange() { },
    onLastnameChange() { },
    onPasswordChange() {
        if (this.password.length < 10)
            this.isPasswordErrorVisible = true;
        else
            this.isPasswordErrorVisible = false;
    },
    onPassword2Change() {
        if (this.password != this.password2)
            this.isPassword2ErrorVisible = true;
        else
            this.isPassword2ErrorVisible = false;
    },
    onBirthdateChange() { },
    onLoginChange() {
        fetch('https://pi.iem.pw.edu.pl/user/' + this.login)
            .then(function (response) {
                let status = response.status;
                if (status == 404) {
                    this.isLoginErrorVisible = false;
                } else if (status == 200) {
                    this.isLoginErrorVisible = true;
                } else if (status >= 500) {
                    console.error("Server error while checking login " + status); 
                    this.isLoginErrorVisible = true;
                }
                this.isWaitingForLogin = false;
	        this.isSubmitEnabled = presenter.canSubmitForm.bind(this)();
                view.loadFromModel();
            }.bind(this));
        this.isWaitingForLogin = true;
    },
    onPeselChange() {
        this.gender = presenter.genderFromPesel(this.pesel);
        this.isGenderErrorVisible = false; // assume we did a good job
    },
    onGenderChange() {
        if (this.pesel) {
            if (presenter.genderFromPesel(this.pesel) == this.gender) {
                this.isGenderErrorVisible = false;
            } else {
                this.isGenderErrorVisible = true;
            }
        } else if (this.gender == 'F' || this.gender == 'M') {
            this.isGenderErrorVisible = false;
        } else {
            this.isGenderErrorVisible = true;
        }
    },
    onPhotoChange() {
    },
    onFormSubmit() {
        if (this.canSubmitForm())
            console.info("Submit:" + JSON.stringify(this));
        else
            console.error("Can't submit");
    },
    canSubmitForm() {
        if (this.firstname == '') return false;
        if (this.lastname  == '') return false;
        if (this.gender  == '') return false;
        if (this.isPasswordErrorVisible)   return false;
        if (this.isPassword2ErrorVisible)  return false;
        if (this.isBirthdateErrorVisible)  return false;
        if (this.isLoginErrorVisible)  return false;
        if (this.isPeselErrorVisible)  return false;
        if (this.isGenderErrorVisible) return false;
        if (this.isWaitingForLogin) return false;
        return true;
    },
    genderFromPesel(pesel) {
        return 'M';
    }
}

view.model = presenter.model;
