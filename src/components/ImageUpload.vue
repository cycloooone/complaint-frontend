<template>
  <v-card flat class="ma-3" width="344">
    <v-img :src="this.imageSrc"></v-img>
    <v-img
    :src="require(`@/img/${imageSrc}`)"
      height="200px"
    ></v-img>
    <v-card-title style="font-size: 23px; font-weight: bold; margin-top:30px;">{{ imageName }}</v-card-title>
    <v-card-title style="font-size:20px; font-weight: bold; margin-top:10px;" v-if="price">{{ price }} <v-icon style="margin-top:-4px; margin-left:-2px;" size="x-small">mdi-currency-kzt</v-icon></v-card-title>
  </v-card>
</template>

<script>
export default {
  data(){
    return{
      img_src: `../img/${this.imageSrc}` 
    }
  },
  name: 'ImageCard',
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    imageName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: false
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
