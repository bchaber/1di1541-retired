<template>
  <form name="form" form method="POST" action="https://pi.iem.pw.edu.pl/register/" @submit="onFormSubmit" enctype="multipart/form-data">
    <h1>Formularz</h1>

    <fieldset>
      <div>
        <label>Imię *</label>
        <input type="text" name="firstname" v-model="firstname" @change="onFirstnameChange" required />
      </div>

      <div>
        <label>Nazwisko *</label>
        <input type="text" name="lastname" v-model="lastname" @change="onLastnameChange" required />
      </div>

      <div>
        <label>Hasło</label>
        <input type="password" name="password" v-model="password" @change="onPasswordChange" />
        <div :hidden="!isPasswordErrorVisible">The password is to  simple</div>
      </div>

      <div>
        <label>Powtórz hasło</label>
        <input type="password" name="password2" v-model="password2" @change="onPassword2Change" />
        <div :hidden="!isPassword2ErrorVisible">The passwords don't match</div>
      </div>

      <div>
        <label>Data urodzenia</label>
        <input type="date" name="birthdate" min="01-01-1900" v-model="birthdate" @change="onBirthdateChange" />
      </div>

      <div>
        <label>Login</label>
        <input type="text" name="login" v-model="login" @change="onLoginChange" />
        <div :hidden="!isLoginErrorVisible">The login is already taken</div>
      </div>

      <div>
        <label>PESEL</label>
        <input type="text" name="pesel" v-model="pesel" @change="onPeselChange" />
      </div>

      <div>
        <label>Płeć</label>
        <input type="radio" name="gender" value="F" v-model="gender" @change="onGenderChange">Kobieta</input>
        <input type="radio" name="gender" value="M" v-model="gender" @change="onGenderChange">Mężczyzna</input>
      </div>

      <div>
        <label>Zdjęcie *</label>
        <input type="file" name="photo" required @change="onPhotoChange" />
      </div>
    </fieldset>

    <button type="submit" name="button" :disabled="!isSubmitEnabled">Wyślij</button>
  </form>
</template>

<script>
export default {
  name: 'register-user-form',
  data() {
    return {
        firstname: '',
        lastname:  '',
        password:  '', isPasswordErrorVisible: false,
        password2: '', isPassword2ErrorVisible: false,
        birthdate: '', isBirthdateErrorVisible: false,
        login:  '',    isLoginErrorVisible: false, isWaitingForLogin: false,
        pesel:  '',    isPeselErrorVisible: false,
        gender: '',    isGenderErrorVisible: false,
        photo:  ''
    }
  },
  computed: {
        isSubmitEnabled() {
            return this.canSubmitForm();
        }
  },
  methods: {
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
        fetch("https://pi.iem.pw.edu.pl/user/" + this.login)
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
            }.bind(this));
        this.isWaitingForLogin = true;
    },
    onPeselChange() {
        this.gender = this.genderFromPesel(this.pesel);
        this.isGenderErrorVisible = false; // assume we did a good job
    },
    onGenderChange() {
        if (this.pesel) {
            if (this.genderFromPesel(this.pesel) == this.gender) {
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
        this.photo = e.target.value;
    },
    onFormSubmit(e) {
        e.preventDefault();
        if (this.canSubmitForm())
            console.info("Submit:" + JSON.stringify(this.$data));
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
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
