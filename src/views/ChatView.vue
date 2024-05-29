<template>
  <v-layout>
    <NavbarComp></NavbarComp>
      <v-main>
        <div>
    <iframe src="http://localhost:8000" width="100%" height="970px"></iframe>
  </div>
      </v-main>
  </v-layout>
 
</template>

<script>
import NavbarComp from '@/components/NavbarComp.vue';
export default{
  data(){
    return{

    }
  },
  components:{
    NavbarComp
  }
}
</script>