<template>
  <v-layout>
    <NavbarComp></NavbarComp>
    <v-main>
      <div class="mt-5 ml-5 mb-5">
        <v-btn @click="this.statusType='created'" :color="statusType=='created'?'blue':'white'" class="text-subtitle-1">Создано</v-btn>
        <v-btn @click="this.statusType='process'" :color="statusType=='process'?'blue':'white'" class="ml-5 text-subtitle-1">В процессе</v-btn>
        <v-btn @click="this.statusType='completed'" :color="statusType=='completed'?'blue':'white'" class="ml-5 text-subtitle-1">Исполнено</v-btn>
        <v-btn @click="this.statusType='all'" :color="statusType=='all'?'blue':'white'" class="ml-5 text-subtitle-1">Все</v-btn>
      </div>
      <v-divider thickness="2"></v-divider>
      <div class="mt-5 ml-5 mb-5">
        <v-btn @click="this.tableType='food'" :color="tableType=='food'?'blue':'white'" class="text-subtitle-1">Донеры и комбо</v-btn>
        <v-btn @click="this.tableType='drinks'" :color="tableType=='drinks'?'blue':'white'" class="ml-5 text-subtitle-1">Горячие напитки</v-btn>
        <v-btn @click="this.tableType='service'" :color="tableType=='service'?'blue':'white'" class="ml-5 text-subtitle-1">Обслуживание</v-btn>
        <v-btn @click="this.tableType='all'" :color="tableType=='all'?'blue':'white'" class="ml-5 text-subtitle-1">Все</v-btn>
      </div>
      <v-divider thickness="2"></v-divider>
      <div class="mt-5 ml-5 mb-5">
        <ProductsComp @item-selected="handleItemSelected" :categoryType="this.tableType"></ProductsComp>
      </div>
      <div>
        <ComplaintComp :tableType="tableType" :statusType="statusType" :productType="objectType"></ComplaintComp>
      </div>
    </v-main>
  </v-layout>

</template>

<script>
import ComplaintComp from '@/components/ComplaintComp.vue';
import NavbarComp from '@/components/NavbarComp.vue';
import ProductsComp from '@/components/ProductsComp.vue';
  export default{
    data(){
      return{
        tableType:'all',
        statusType:'all',
        objectType:null,
      }
    },
    methods:{
      handleItemSelected(item){
        console.log('emit works', item)
        this.objectType=item
      }
    },
    components:{
      ComplaintComp,NavbarComp,ProductsComp
    }
  }
</script>