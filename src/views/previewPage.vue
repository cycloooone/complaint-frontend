<script>

import ImageUpload from '@/components/ImageUpload.vue';

  export default{
    components:{
      ImageUpload,
    },
    methods:{
      zoomToElement() {
      const targetElement = this.$refs.aboutCompany;  
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    },

    },
    data:()=>({
      tab:null,
      product_category:1,
      product_categories:['Донеры','Комбо','Экстра','Горячие напитки','Холодные напитки','Кофе'],
      products:[
        [{name:"Донер Классик",price:1500, img:"doner1.jpg"},{name:"Донер Классик 1.5", price:1800, img:"doner1.jpg"}, 
        {name:"Донер Тейсти",price:1550, img:"doner1.jpg"},{name:"Донер Тейсти 1.5",price:1850, img:"doner1.jpg"},
        {name:"Доппер Классик",price:1600, img:"doner2.jpg"},{name:"Доппер Классик 1.5", price:1900, img:"doner2.jpg"}, 
        {name:"Доппер Тейсти",price:1650, img:"doner2.jpg"},{name:"Доппер Тейсти 1.5",price:1950, img:"doner2.jpg"},
        ],
        [{name:"Комбо Донер", price:2500, img:"kombo1.jpg"}, {name:"Комбо Донер 1.5", price:2800, img:"kombo1.jpg"},
        {name:"Комбо Донер Тейсти", price:2550, img:"kombo1.jpg"}, {name:"Комбо Донер Тейсти 1.5", price:2850, img:"kombo1.jpg"},
        {name:"Комбо Доппер Классик", price:2600, img:"kombo2.jpg"}, {name:"Комбо Доппер Классик Биг", price:2650, img:"kombo2.jpg"},
        {name:"Комбо Доппер Тейсти", price:2600, img:"kombo2.jpg"}, {name:"Комбо Доппер Тейсти Биг", price:2650, img:"kombo2.jpg"},
        ],
        [{name:"Хот дог", price:1150, img:"hotdog.jpg"}, {name:"Фри", price:750, img:"free.png"},
        {name:"Халапеньо", price:200, img:"halo.png"}, {name:"Сыр", price:250, img:"cheese.png"},
        {name:"Жаренный лук", price:250, img:"onions.jpg"}],
        [{name:"Капучино", price:900, img:"kofe.png"}, {name:"Латте", price:950, img:"kofe.png"},
        {name:"Американо", price:950, img:"kofe.png"}, {name:"Раф", price:1000, img:"kofe.png"},
        {name:"Мокко", price:900, img:"kofe.png"},{name:"Эспрессо", price:750, img:"kofe.png"},
        {name:"Фраппучино", price:850, img:"kofe.png"},{name:"Айс латте", price:850, img:"kofe.png"},
        {name:"Какао", price:750, img:"kofe.png"}]]
    }),
  }
</script>


<template>
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <v-app>
    <v-app-bar class="header" elevation="0" style="padding-bottom: 20px; padding-top: 20px; height: 120px; border: 1px solid #ddd; border-radius: 20px;">
    <v-img src="../img/logo_company.jpeg" contain max-height="130" style="margin-left: 20px; margin-top: 10px;"></v-img>
    <h3 style="color: red; font-size: 20px; "><v-btn @click="zoomToElement" style="color: red;">О нас</v-btn><v-icon size="25" >mdi-account-group</v-icon></h3>
    <h3 style="color: red; font-size: 20px; "><v-btn @click="this.$router.push('/form')" style="color: red;">Жалобы/Предложения</v-btn><v-icon size="25">mdi-alert-circle</v-icon></h3>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <div style="display: flex; flex-direction: column; align-items: center; margin-right: 100px"> 
        <h3 style="color: red; font-size: 20px;">Контакты</h3>
        <h3 style="color: red; font-size: 20px;"><a href="tel:+77002592206" style="color: red; text-decoration: none;">+7 (700) 259-22-06</a></h3>
    </div>
  </v-app-bar>

<v-main>

  <div class="product-items" style="margin:0 150px; padding:50px 0;">
    <div style="text-align: center; margin-top:60px;">
      <v-btn class="ml-1 text-none text-h6" rounded="lg" :variant="this.product_category===1?'outlined':'flat'" @click="this.product_category=1" append-icon="mdi-hamburger">Донеры</v-btn>
      <v-btn class="ml-1 text-none text-h6" rounded="lg" :variant="this.product_category===2?'outlined':'flat'" @click="this.product_category=2" append-icon="mdi-food">Комбо</v-btn>
      <v-btn class="ml-1 text-none text-h6" rounded="lg" :variant="this.product_category===3?'outlined':'flat'" @click="this.product_category=3" append-icon="mdi-food">Экстра</v-btn>
      <v-btn class="ml-1 text-none text-h6" rounded="lg" :variant="this.product_category===4?'outlined':'flat'" @click="this.product_category=4" append-icon="mdi-coffee">Горячие напитки</v-btn>
    </div>
    <p class="text-h4" style="text-align:center; margin-top:50px;">{{product_categories[this.product_category-1]}}</p>
    <v-row v-if="this.product_category" class="mt-5">
      <v-col class="imgD" cols="12" md="3" v-for="k in products[this.product_category-1]" :key="k">
      <ImageUpload :imageSrc="k.img" :imageName="k.name" :price="k.price"></ImageUpload>
    </v-col>
    </v-row>
  </div>
    












    <div ref="aboutCompany" style="margin-top: 350px; padding-bottom:100px;">
      <v-row>
        <v-col cols="12" md="6">
          <v-timeline>
    <v-timeline-item size="x-large" dot-color="blue">
      <template v-slot:icon>
        <v-icon color="white">mdi-map-marker</v-icon>
      </template>
      <template v-slot:opposite>
        <div style="font-size:30px;">
        <strong>Филиал</strong>
        </div>
      </template>
      <div style="font-size:19px; width:200px;">
        Павильон находится по адресу <strong>Желтоксан 1А.</strong>
      </div>
      
    </v-timeline-item>

    <v-timeline-item size="x-large" dot-color="pink">
      
      <template v-slot:icon>
        <v-icon color="white">mdi-eye-check-outline</v-icon>
      </template>
      <template v-slot:opposite>
        <div style="font-size:30px;">
          <strong>Прозрачность</strong>
        </div>
        
      </template>
      <div style="font-size:19px; float: right; width:200px; margin-right: -40px;">
        У нас вы всегда можете видеть, как <strong>работает весь персонал</strong>
      </div>
      
    </v-timeline-item>

    <v-timeline-item size="x-large" >
      <template v-slot:icon>
        <v-icon color="white">mdi-clock-time-four</v-icon>
      </template>
      <template v-slot:opposite>
        <div style="font-size:30px; float: right; width:200px; margin-right: -90px;">
        <strong>График работы</strong>
      </div>
      </template>
      <div style="font-size:19px; width:250px;">
        Мы рады приветствовать вас ежедневно с <strong>10:30 до 24:00</strong>
      </div>
      
    </v-timeline-item>
  </v-timeline>
        </v-col>
        <v-img src="../img/simple1.jpg" contain style="margin-top: -120px;"></v-img>
      </v-row>
    </div>
    
    
    
  </v-main>

    <v-footer class="d-flex flex-column bg-black" style="margin-top: 50px;" >
      <div class="d-flex w-100 align-center px-4" style="margin-top: 30px">
        <h3 style="color: white; ">©2024 AITU</h3>
        <v-spacer></v-spacer>
        <div style="display: flex; flex-direction: column; align-items: center; ">
  <h1 style="color: white">Simple</h1>
  <h2 style="color: white">Keep it simple: делай проще</h2>
</div>

        <v-spacer></v-spacer>
      </div>
      <div class="divider"></div>
      <div class="px-4 py-2 text-start w-100">
        <v-row class="link-container">
          <v-col class="d-flex justify-start">

            <v-spacer></v-spacer> 
            <v-btn icon class="clickable-link mr-5" color="green-lighten-3" elevation="0">
              <v-icon href="https://wa.me/87002592206">mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn icon class="clickable-link" color="pink-lighten-4"  elevation="0">
              <v-icon href="https://www.instagram.com/simpleastana/?hl=en">mdi-instagram</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

    </v-footer>
  </v-app>
</template>




<style scoped>
.doner-item {
  display: flex;
  justify-content: space-between;
  font-size: 23px;
  margin-top: 10px;
  width: 100%; 
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 10px;
}

.clickable-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

.bg-pastel-blue {
  background-color: #8f3f1a;
}

.divider {
  width: 100%; 
  border-bottom: 1px solid white;
  margin: 20px auto;
}






</style>
