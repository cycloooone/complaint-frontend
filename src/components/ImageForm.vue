<template>
    <v-card :variant="computedVariant" class="ma-3 rounded-lg pb-5" width="344" @click="mt">
      <v-img v-if="imageSrc" height="200px" :src="require(`@/img/${imageSrc}`)"></v-img>
      <v-card-title style="font-size: 23px; text-align: center; font-weight: bold; margin-top:30px;">{{ imageName }}</v-card-title>
      <v-icon v-if="isSelected" style="position: absolute; top:20px; right:20px;" size="x-large">mdi-check-decagram</v-icon>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      imageSrc: {
        type: String,
        required: true,
      },
      imageName: {
        type: String,
        required: true,
      },
      isSelected: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      computedVariant() {
        return this.isSelected ? 'outlined' : 'flat'; 
      },
    },
    methods: {
      mt() {
        this.$emit('select');
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  