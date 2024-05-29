<template>
    <v-card class="ma-3" max-width="344">
      <v-img
        :src="'../img/' + imageSrc"
        height="200px"
      ></v-img>
      <v-card-title>{{ imageName }}</v-card-title>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'ImageCard',
    props: {
      imageSrc: {
        type: String,
        required: true
      },
      imageName: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  