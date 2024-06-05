<template>
  <div id="form-ui">
    <div id="company-logo"></div>
    <form @submit.prevent="validate" id="form">
      <div id="form-body">
        <div id="welcome-lines">
          <div id="welcome-line-1">Simple</div>
          <div id="welcome-line-2">Welcome back employee</div>
        </div>
        <div id="input-area">
          <div class="form-inp">
            <input v-model="username" placeholder="Username" type="text">
          </div>
          <div class="form-inp">
            <input v-model="pass" placeholder="Password" type="password">
          </div>
        </div>
        <div id="submit-button-cvr">
          <button id="submit-button" type="submit" :disabled="loading">Login</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      username: '',
      pass: '',
    };
  },
  methods: {
    async validate() {
      if (this.username && this.pass) {
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
        
        this.loading = false;
        if (login.data.data.role_name == 'Администратор') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/complaints');
        }
      } catch (error) {
        this.loading = false;
        console.error('Login failed:', error);
      }
    },
  },
};
</script>

<style>
/* Other styles specific to this component */
#form-ui {
  background-image: url('../img/simple1.jpg');
  background-size: 40%;
  background-position: right center;
  margin: 0;
  padding: 595px;
}

#form {
  display: grid;
  place-items: center;
  width: 400px;
  height: 472px;
  padding: 25px;
  background-color: #161616;
  box-shadow: 0px 15px 60px #e71425;
  outline: 1px solid #e71425;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#form-body {
  width: 230px;
}

#welcome-lines {
  text-align: center;
  line-height: 1;
}

#welcome-line-1 {
  color: #e5ff00;
  font-weight: 600;
  font-size: 40px;
}

#welcome-line-2 {
  color: #ffffff;
  font-size: 18px;
  margin-top: 17px;
}

#input-area {
  margin-top: 40px;
}

.form-inp {
  padding: 11px 25px;
  background: transparent;
  border: 1px solid #e3e3e3;
  line-height: 1;
  border-radius: 8px;
}

.form-inp:focus {
  border: 1px solid #e5ff00;
}

.form-inp:first-child {
  margin-bottom: 15px;
}

.form-inp input {
  width: 100%;
  background: none;
  font-size: 13.4px;
  color: #e5ff00;
  border: none;
  padding: 0;
  margin: 0;
}

.form-inp input:focus {
  outline: none;
}

#submit-button-cvr {
  margin-top: 20px;
}

#submit-button {
  display: block;
  width: 100%;
  color: #e5ff00;
  background-color: transparent;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  padding: 14px 13px 12px 13px;
  border: 0;
  outline: 1px solid #e5ff00;
  border-radius: 8px;
  line-height: 1;
  cursor: pointer;
  transition: all ease-in-out .3s;
}

#submit-button:hover {
  transition: all ease-in-out .3s;
  background-color: #e5ff00;
  color: #161616;
  cursor: pointer;
}

#forgot-pass {
  text-align: center;
  margin-top: 10px;
}

#forgot-pass a {
  color: #868686;
  font-size: 12px;
  text-decoration: none;
}

#bar {
  position: absolute;
  left: 50%;
  bottom: -50px;
  width: 28px;
  height: 8px;
  margin-left: -33px;
  background-color: #e5ff00;
  border-radius: 10px;
}

#bar:before,
#bar:after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #ececec;
  border-radius: 50%;
}

#bar:before {
  right: -20px;
}

#bar:after {
  right: -38px;
}

#company-logo {
  width: 30%;
  height: 50%;
  background-image: url('../img/logo_company.jpeg');
  background-size: cover;
  background-position: center;
  margin-left: -400px; 
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
