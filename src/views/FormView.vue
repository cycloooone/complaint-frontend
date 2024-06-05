<template>
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <v-app>
    <v-app-bar elevation="0" style="padding-bottom: 20px; padding-top: 20px; height: 120px; border: 1px solid #ddd; border-radius: 20px;">
    <v-img src="../img/logo_company.jpeg" contain max-height="130" style="margin-left: 10px; margin-top: 10px;"></v-img>
    <h3 style="color: red; font-size: 40px;"><v-btn @click="this.$router.push('/preview')" style="color: red;">Главная страница</v-btn><v-icon size="25" style="padding-top: 15px;">mdi-home</v-icon></h3>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <div style="display: flex; flex-direction: column; align-items: center; margin-right: 100px"> 
        <h3 style="color: red; font-size: 20px;">Контакты</h3>
        <h3 style="color: red; font-size: 20px;"><a href="tel:+77002592206" style="color: red; text-decoration: none;">+7 (700) 259-22-06</a></h3>
    </div>
  </v-app-bar>

  <h1 class="tl">Форма жалобы</h1>
  <div class="form-app">
    <div v-if="step === 1">
      <v-stepper class="vstep">
        <v-stepper-header>
          <v-stepper-item title="Детали жалобы" value="1"></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Контактная информация" value="2"></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Подтверждение" value="3"></v-stepper-item>
        </v-stepper-header>
      </v-stepper>
      <h3 class="text-h6" style="padding-top: 30px;">Описание жалобы</h3>
      <br>
      <v-textarea v-model="complaint" label="Опишите вашу проблему" :rules="[rules.required]"></v-textarea>
      <div class="btn-container">
        <v-btn :disabled="!isStepOneValid" @click="nextStep" class="btnnext">Далее</v-btn>
      </div>
    </div>

    <div v-if="step === 2">
      <v-stepper model-value="2" class="vstep">
        <v-stepper-header>
          <v-stepper-item title="Детали жалобы" value="1" complete></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Контактная информация" value="2"></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Подтверждение" value="3"></v-stepper-item>
        </v-stepper-header>
      </v-stepper>
      <h3 class="text-h6" style="padding-top: 30px;">Контактная информация</h3>
      <br>
      <v-text-field v-model="name" label="Имя" :rules="[rules.required, rules.name]"></v-text-field>
      <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]"></v-text-field>
      <v-text-field v-model="phone" label="Телефон" :rules="[rules.required, rules.counter]"></v-text-field>
      <div class="btn-container">
        <v-btn @click="prevStep">Назад</v-btn>
        <v-btn :disabled="!isStepTwoValid" @click="nextStep" class="btnnext">Далее</v-btn>
      </div>
    </div>

    <div v-if="step === 3">
      <v-stepper model-value="3" class="vstep">
        <v-stepper-header>
          <v-stepper-item title="Детали жалобы" value="1" complete></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Контактная информация" value="2" complete></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Подтверждение" value="3"></v-stepper-item>
        </v-stepper-header>
      </v-stepper>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12">
          <h3 class="text-h6 mt-4 mb-4">Подтверждение</h3>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row>
        <v-col cols="12">
          <p class="font-weight-bold mt-4 mb-2">Пожалуйста, проверьте вашу жалобу перед отправкой:</p>
        </v-col>
      </v-row>

      <v-row class="confirmation-details mb-4">
        <v-col cols="12">
          <p><strong>Категория:</strong> {{ selectedCategory }}</p>
          <p><strong>Объект:</strong> {{ selectedObject }}</p>
          <p><strong>Жалоба:</strong> {{ complaint }}</p>
          <p><strong>Имя:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Телефон:</strong> {{ phone }}</p>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="6">
          <v-btn @click="prevStep" outlined>Назад</v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn :loading="loading" @click="sendComplaint" color="blue-darken-3" append-icon="mdi-send">Отправить</v-btn>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="finalDialog">
      <v-sheet class="pa-4 text-center mx-auto" elevation="12" max-width="600" rounded="lg" width="100%">
        <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
        <h2 class="text-h5 mb-6">Спасибо за заполнение формы!</h2>
        <p class="mb-4 text-medium-emphasis text-body-2">
          Спасибо за то, что нашли время подать жалобу. Мы получили вашу жалобу по поводу {{this.selectedCategory}}. Наша команда сейчас рассматривает ваше обращение и тщательно расследует данный вопрос.
        </p>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn class="text-none" color="success" variant="flat" width="90" rounded @click="this.$router.push('/preview')">Готово</v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </div>

  <v-footer class="d-flex flex-column bg-black" style="margin-top: 200px;">
  <div class="d-flex w-100 align-center px-4 footer-top" style="margin-top: 30px">
    <h3 style="color: white;">©2024 AITU</h3>
    <v-spacer></v-spacer>
    <div class="footer-center">
      <h1 style="color: white">Simple</h1>
      <h2 style="color: white">Keep it simple: делай проще</h2>
    </div>
    <v-spacer></v-spacer>
  </div>
  <div class="divider"></div>
  <div class="px-4 py-2 text-start w-100 footer-bottom">
    <v-row class="link-container">
      <v-col class="d-flex justify-start">
        <v-spacer></v-spacer>
        <v-btn icon class="clickable-link mr-5" color="green-lighten-3" elevation="0">
          <v-icon href="https://wa.me/87002592206">mdi-whatsapp</v-icon>
        </v-btn>
        <v-btn icon class="clickable-link" color="pink-lighten-3" elevation="0">
          <v-icon href="https://instagram.com">mdi-instagram</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</v-footer>
</v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      step: 1,
      complaint: '',
      selectedCategory: '',
      selectedObject: '',
      name: '',
      email: '',
      phone: '',
      loading: false,
      finalDialog: false,
      rules: {
      required: value => !!value || 'Поле обязательно для заполнения',
      counter: value => /^[\d+\-()]{0,11}$/.test(value) || 'Некорректный номер телефона',
      email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Неверный e-mail.'
      },
      name: value => /^[a-zA-Zа-яА-Я\s\-']+$/.test(value) || 'Неверное имя.'
    },
    };
  },
  computed: {
    isStepOneValid() {
      return this.complaint.length > 0;
    },
    isStepTwoValid() {
      return (
        this.name.length > 0 &&
        this.email.length > 0 &&
        this.phone.length > 0
      );
    },
  },
  methods: {
  nextStep() {
    if (this.step === 1) {
      const result = this.detectCategoryAndObject(this.complaint);
      this.selectedCategory = result.detectedCategory;
      this.selectedObject = result.detectedObject;
    }
    this.step++;
  },
  prevStep() {
    this.step--;
  },
  detectCategoryAndObject(complaint) {
    const categories = {
      "Донеры": ["донер", "шаурма", "кебаб", "курица", "соус", "лаваш", "помидор", "овощи", "доппер"],
      "Горячие напитки": ["кофе", "чай", "латте", "айс латте", "какао", "фраппучино", "фрапучино", "эспрессо", "мокко", "раф", "американо", "капучино"],
      "Обслуживание": ["сервис", "обслуживание", "персонал"],
    };

    const objects = {
      "Доппер": ["доппер"],
      "Донер": ["донер"],
      "Комбо Доппер": ["Комбо доппер"],
      "Комбо Донер": ["Комбо донер"],

      "Кофе": ["кофе"],
      "Чай": ["чай"],
      "Латте": ["латте"],
      "Эспрессо": ["эспрессо"],
      "Мокко": ["мокко"],
      "Раф": ["раф"],
      "Айс латте": ["айс латте"],
      "Какао": ["какао"],
      "Фраппучино": ["фраппучино"],
      "Американо": ["американо"],
      "Капучино": ["капучино"],

      "Сервис": ["сервис"],
      "Обслуживание": ["обслуживание"],
      "Персонал": ["персонал"],
    };

    let detectedCategory = "Другое";
    let detectedObject = "";

    for (let category in categories) {
      for (let keyword of categories[category]) {
        if (complaint.toLowerCase().includes(keyword.toLowerCase())) {
          detectedCategory = category;
          break;
        }
      }
    }

    for (let object in objects) {
      for (let keyword of objects[object]) {
        if (complaint.toLowerCase().includes(keyword.toLowerCase())) {
          detectedObject = object;
          break;
        }
      }
    }

    return { detectedCategory, detectedObject };
  },
  async sendComplaint(){
      try{
        this.loading=true;
        let bind = {
          "category_name": this.selectedCategory,
          "object_name": this.selectedObject,
          "description": this.complaint,
          "client_fullname": this.name,
          "client_email": this.email,
          "client_contact": this.phone
        }
        await axios.post(`https://complaint-backend-drab.vercel.app/complaint`, bind)
      }
      catch(e){
        console.log(e)
      }
      finally {
        this.loading=false;
        this.finalDialog = true;
      }

    },

  
},
};

</script>

<style scoped>
p{
  font-size:20px;
}
.tl {
  margin: 0 auto;
  margin-top: 200px;
}

.form-app {
  padding: 50px 20px;
  background-size: cover;
  height: auto;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  border: 1px solid #ddd; 
  border-radius: 20px;
}

.vstep {
  background-color: #f5f5f5;
}

.v-btn {
  margin-top: 20px;
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.btnnext {
  margin-left: auto; 
}

.confirmation-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}

.confirmation-details p {
  margin: 0;
  padding: 5px 0;
}

.text-right {
  text-align: right;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.font-weight-bold {
  font-weight: 700;
}

.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}

.divider {
  width: 100%; 
  border-bottom: 1px solid white;
  margin: 20px auto; 
}

.clickable-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}
.footer-top {
  margin-top: 30px;
}

.footer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.divider {
  width: 100%; 
  border-bottom: 1px solid white;
  margin: 20px auto; 
}

.clickable-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}
</style>


































