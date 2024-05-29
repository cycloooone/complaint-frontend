<template>
    <v-app>
        
        <v-container style="margin-top: 100px;" fluid class="text-center">
          <v-alert
          v-model="alertInfo"
          class="text-center"
      type="error"
      title="Login failed!"
        variant="outlined"
      text="Login or password was incorrect! Please try again."
    ></v-alert>

            <v-card 
            class="mx-auto"
            max-width="600" 
            >
              <v-card-title class="blue darken-2 white--text">
                <h2 class="ml-2">Вход</h2>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="username"
                    prepend-inner-icon="mdi-email"
                    :rules="loginRules"
                    label="Логин"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="pass"
                    :rules="passRules"
                    :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    label="Пароль"
                    required
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                  ></v-text-field>
                  <v-btn
                    style="float: left; margin-bottom: 15px;"
                    :disabled="!valid"
                    color="blue darken-2"
                    dark
                    :loading="loading"
                    @click="validate"
                  >
                    <v-icon 
                     left>mdi-login</v-icon>
                    Вход
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>

        
      </v-container>
    </v-app>
  </template>
  
  
  <script>
  import axios from 'axios';
import { mapActions } from 'vuex';
  export default {
    data: () => ({
      alertInfo: false,
      snackbar: false,
      valid: true,
      loading: false,
      username: '',
      loginRules: [v => !!v || 'Логин обязателен!'],
      pass: '',
      passRules: [v => !!v || 'Пароль обязателен!'],
      visible: false,
    }),
    methods: {
        ...mapActions['authorizeUser'],
      async validate() {
        if (this.$refs.form.validate()) {
          this.sendLogin();
        } else {
          console.log('Form validation failed');
        }
      },
      async sendLogin() {
        try {
          this.loading = true;
          const login = await axios.post(`https://complaint-backend-drab.vercel.app/login`, {
          username: this.username,
          password: this.pass,
        });
        

        sessionStorage.setItem('token', login.data.data.access_token);
        sessionStorage.setItem('username', login.data.data.username);
        sessionStorage.setItem('role_name', login.data.data.role_name);
        sessionStorage.setItem('name', login.data.data.name);
        sessionStorage.setItem('surname', login.data.data.surname);
        this.loading=false;
        if(login.data.data.role_name == 'Администратор'){
          this.$router.push('/admin');
        }
        else{
          this.$router.push('/complaints');
        }

      } catch (error) {
        this.loading=false;
        this.alertInfo = true;
        console.error('Login failed:', error);
      }

      },
    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles here */
  .v-card {
    border-radius: 8px;
  }
  
  .v-card-title h2 {
    font-size: 24px;
  }
  
  .v-card-text {
    padding: 16px;
  }
  
  .v-btn {
    margin-top: 16px;
  }
  </style>
  