<template>
      <v-layout>
        <NavbarComp></NavbarComp>
        <v-main>
          <div class="pt-10 pl-10 pb-10">
            <v-btn append-icon="mdi-chart-bar" rounded="lg" class="text-subtitle-1" :variant="this.regime==1?'outlined':'flat'" @click="this.regime=1">Обьекты жалоб</v-btn>
            <v-btn append-icon="mdi-chart-pie" rounded="lg" class="ml-3 text-subtitle-1" :variant="this.regime==2?'outlined':'flat'" @click="this.regime=2">Категорий жалоб</v-btn> 
          </div>
          <div>
            <div v-if="this.regime==1">
              <BarComp :complaints_data="COMPLAINTS"></BarComp>
            </div>
            <div v-if="this.regime==2">
              <BoardComp :complaints_data="COMPLAINTS"></BoardComp>
            </div>
          </div>
        </v-main>
      </v-layout>
</template>

<script>
import NavbarComp from '@/components/NavbarComp.vue';
import BarComp from '@/components/BarComp.vue'
import BoardComp from '@/components/BoardComp.vue'
import { mapActions, mapGetters } from 'vuex';
export default{
  components:{
    NavbarComp,BarComp,BoardComp
  },
  data(){
    return{
      regime:0,
    }
  },
  methods:{
    ...mapActions(["GET_COMPLAINTS"]),
  },
  created(){
    this.GET_COMPLAINTS();
  },
  computed:{
    ...mapGetters(["COMPLAINTS"]),
  }
}
</script>
