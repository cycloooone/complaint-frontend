<script>
  import axios from "axios";

  export default{
    mounted() {
      this.getCategories()
    },
    data(){
      return{
        categoryDialog: false,
        categoryName: '',
        isSending: false,
        categories: [],
      }
    },
    methods:{
      async sendCategory(){
        if(this.categoryName.length){
          try{
            this.isSending = true;
            let bind = {name: this.categoryName};
            await axios.post('https://complaint-backend-drab.vercel.app/addCategory', bind)
          }
          catch(e){
            console.log(e)
          }
          finally{
            this.getCategories()
            this.isSending = false;
            this.categoryName = '';
            this.categoryDialog = false;
          }

        }
      },
      getCategoryId(category_name){
        const data = this.categories.find(item=>item.name == category_name)
        return data.id;
      },
      async getCategories(){
        const data = await axios.get('https://complaint-backend-drab.vercel.app/getCategory');
        this.categories = data.data;
        this.category_items = this.categories.map(item=> item.name)
      },
    },

  }

</script>

<template>
  <div>
    <v-btn class="mt-4 mb-3" :loading="isSending" @click="categoryDialog = true">
      Добавить категорию
    </v-btn>
    <v-list>
      <v-list-item v-for="(item, index) in categories" :key="index">
        <v-list-item-content>
          <v-list-item-title>- {{ item }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-dialog max-width="700" v-model="categoryDialog">
      <v-card class="pl-10 pr-10">
        <v-card-title>
          Добавить новую категорию
        </v-card-title>
        <v-text-field v-model="categoryName" density="compact" variant="solo-filled" flat label="Название категорий"></v-text-field>
        <v-card-actions>
          <v-btn @click="categoryDialog = false">
            Отмена
          </v-btn>
          <v-btn @click="sendCategory">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>