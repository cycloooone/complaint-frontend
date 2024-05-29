<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          hello world
        </v-expansion-panel-title>
        <v-expansion-panel-content>
            <p v-for="item in categories" :key="item">
              {{ item.name }}
            </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import axios from "axios";

  export default{
    data(){
      return{
        categoryDialog: false,
        dishDialog: false,
        categoryName: '',
        dishName: '',
        dishPrice: '',
        dishDescription: '',
        isSending: false,
        dishes: [],
        selectedCategory: null,
      }
    },
    methods:{


      async sendDish(){
        if(this.dishName.length){
          console.log('hey man')
          try{
            this.isSending = true;
            const category_id = this.categories.find(item=> item.name == this.selectedCategory);
            let bind = {name: this.dishName, category_id: category_id.id, description: this.dishDescription};
            await axios.post('https://complaint-backend-drab.vercel.app/addObject', bind)
          }
          catch(e){
            console.log(e)
          }
          finally{
            this.isSending = false;
            this.dishName = '';
            this.dishDescription = '';
            this.dishDialog = false;
          }

        }
      },

      async getCategory(){
        const data = await axios.get('https://complaint-backend-drab.vercel.app/getCategory');
        this.categories = data.data
        console.log(this.categories)
      },

      async getDishes(){
        const data = await axios.get('https://complaint-backend-drab.vercel.app/getObject/15');
        this.dishes = data.data.map(item => item.name)
        console.log(this.dishes)
      },
    },
    created(){
      this.getCategory()
      this.getDishes()
    },
    computed:{
      getCategoryNames(){
        return this.categories.map(item=>item.name);
      },
    },


  }
</script>