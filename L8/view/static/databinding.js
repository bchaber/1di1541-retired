function bindPresenterWithView(presenter, view) {
    console.log("[Binding]");
    function wrapper(e, m, f) {
        presenter.model[m] = e.target.value;
        f.bind(presenter.model)();
	    presenter.model.isSubmitEnabled = presenter.canSubmitForm.bind(presenter.model)();
        view.loadFromModel();
    }
    view.firstname.addEventListener("change", e => { wrapper(e, 'firstname', presenter.onFirstnameChange); } );
    view.lastname.addEventListener("change",  e => { wrapper(e, 'lastname', presenter.onLastnameChange); } );
    view.password.addEventListener("change",  e => { wrapper(e, 'password', presenter.onPasswordChange); } );
    view.password2.addEventListener("change", e => { wrapper(e, 'password2', presenter.onPassword2Change); } );
    view.birthdate.addEventListener("change", e => { wrapper(e, 'birthdate', presenter.onBirthdateChange); } );
    view.login.addEventListener("change",     e => { wrapper(e, 'login', presenter.onLoginChange); } );
    view.pesel.addEventListener("change",     e => { wrapper(e, 'pesel', presenter.onPeselChange); } );
    view.gender[0].addEventListener("change", e => { wrapper(e, 'gender', presenter.onGenderChange); } );
    view.gender[1].addEventListener("change", e => { wrapper(e, 'gender', presenter.onGenderChange); } );
    view.photo.addEventListener("change",     e => { wrapper(e, 'photo', presenter.onPhotoChange); } );
    view.form.addEventListener("submit",      e => { presenter.onFormSubmit(); e.preventDefault(); });
    view.loadFromModel();
}

bindPresenterWithView(presenter, view);
