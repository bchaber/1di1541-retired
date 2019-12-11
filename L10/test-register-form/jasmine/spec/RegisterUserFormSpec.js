describe("RegisterUserForm", function() {
  var model;
  var presenter;
  var view;

  var promise;

  beforeEach(function() {
    // stub for fetch
    var fetchPromise = new Promise(function(resolve, reject) {
      promise = {
       resolve: resolve,
       reject: reject
      };
    });
    spyOn(window, 'fetch').and.returnValue(fetchPromise);

    model = newModel();
    presenter = newPresenter(model);
    // stub for view
    view = {};
    view.loadFromModel = function() {};
    spyOn(view, 'loadFromModel');
    window.view = view;
  });

  it("should reject empty form", function() {
    expect(model.isSubmitEnabled).toEqual(false);
  });

  it("should accept correct password", function() {
    model.password = "a very long password"; presenter.onPasswordChange();
    model.password2= "a very long password"; presenter.onPassword2Change();

    expect(model.isPasswordErrorVisible).toEqual(false);
    expect(model.isPassword2ErrorVisible).toEqual(false);
  });

  it("should choose gender in accordance to PESEL", function() {
    model.pesel = "87082007755"; presenter.onPeselChange();
    expect(model.isPeselErrorVisible).toEqual(false);
    expect(model.gender).toEqual('M');
  });

  it("should prevent changing gender when PESEL is provided", function() {
    model.pesel = "87082007755"; presenter.onPeselChange();
    expect(model.isGenderErrorVisible).toEqual(false);
    model.gender = "F"; presenter.onGenderChange();
    expect(model.isGenderErrorVisible).toEqual(true);
  });

  describe("on successful fetch", function() {
    beforeEach(function() {
      login = 'bach';
      data = {}; data[login] = true;
      response = new Response(JSON.stringify(data));
    });
    it("should check login", function(done) {
      promise.resolve(response);
      model.login = login; presenter.onLoginChange();
      expect(fetch).toHaveBeenCalledWith('http://edi.iem.pw.edu.pl/chaberb/register/check/'+login);
      setTimeout(function() {
        expect(model.isLoginErrorVisible).toEqual(true);
        expect(view.loadFromModel).toHaveBeenCalled();
	done();
      }, 1);
    });
  });
});
