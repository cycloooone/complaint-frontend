<template>
    <v-container>
      <v-row>
        <v-col
          v-for="(image, index) in images"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <ImageCard
            :imageSrc="image.src"
            :imageName="image.name"
            :selected="image.src === selectedImage"
            @select="selectImage"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import ImageCard from './ImageCard.vue';
  
  export default {
    name: 'ImageSelector',
    components: {
      ImageCard
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        images: [
        { src: 'doner1.jpg', name: 'Донер' },
        { src: 'doner2.jpg', name: 'Доппер' },
        { src: 'kombo1.jpg', name: 'Комбо Донер' },
        { src: 'kombo2.jpg', name: 'Комбо Доппер' },
      ],
      };
    },
    computed: {
      selectedImage() {
        return this.value;
      }
    },
    methods: {
      selectImage(imageSrc) {
        this.$emit('input', imageSrc);
      }
    }
  }
  </script>
  
  <style>
  </style>
  