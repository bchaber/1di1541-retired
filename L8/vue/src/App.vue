<template>
  <div id="app">
    <register-user-form />
  </div>
</template>

<script>
import RegisterUserForm from './components/RegisterUserForm.vue'

export default {
  name: 'app',
  components: {
    RegisterUserForm
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
