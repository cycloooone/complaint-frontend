<template>
  
    <v-layout>
      <navbar-comp></navbar-comp>
      <v-main>
        <v-container>
    <h1 class="my-8 ml-10">Новости</h1>   
    <v-row dense>
      <v-col v-for="(newsItem, index) in this.NEWS" :key="index" cols="6">
        <v-card 
        class="mx-auto mb-4 rounded-lg" 
        max-width="750"
        style="text-align: left;">
          
          <v-card-text class="text-h6 d-flex">
            <v-icon icon="mdi-account-edit" color="grey"></v-icon>
            <p style="padding-top:5px; padding-left: 3px; color: #000;">{{ newsItem.author }}</p>
            
          </v-card-text>
          
          <v-card-title  maxlength="255" class="text-h5">{{ newsItem.title }}</v-card-title>
            <v-img
              class="align-end text-black image"
              v-if="newsItem.image"
              :src="'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + newsItem.image"
              @click="openImageDialog(newsItem.image)"
            ></v-img>
            <v-card-text class="mb-4">{{ newsItem.description }}</v-card-text>
        
            <v-btn class="mb-5 ml-5 text-none text-subtitle-1"
          color="#5865f2"
          size="small"
          variant="flat" @click="openReadDialog(newsItem.text, newsItem.video)">Читать</v-btn>
          <v-btn
          v-if="isAuthorOrAdmin"
          @click="confirmDeleteNews(newsItem)"
          class="mb-5 ml-3 text-none text-subtitle-1"
          color="red"
          size="small"
          variant="flat">Удалить</v-btn>
            
          
        </v-card>
      </v-col>
    </v-row>
    <v-btn v-if="isAuthorOrAdmin" color="primary mt-4" @click="openCreateNewsDialog">Добавить новость</v-btn>
  </v-container>
      </v-main>
    </v-layout>


  

    <!-- Dialog for creating new news item -->
    

    <v-dialog v-model="createNewsDialog" max-width="800px">
  <v-card>
    <v-card-title>Опубликовать новость</v-card-title>
    <v-card-text>
      <v-form ref="createForm">
        <v-text-field v-model="newNewsItem.title" label="Title"></v-text-field>
        <v-textarea v-model="newNewsItem.description" label="Description"></v-textarea>
        <v-textarea v-model="newNewsItem.text" label="Text"></v-textarea>
        <v-file-input
          @change="handleFileChange"
          v-model="newNewsItem.image"
          label="Upload Image"
          show-size
          prepend-icon="mdi-camera"
          accept="image/*"
        ></v-file-input>
        <v-checkbox v-model="newNewsItem.hasVideo" label="Include Video"></v-checkbox>
        <v-file-input
          v-if="newNewsItem.hasVideo"
          @change="handleVideoFileChange"
          v-model="newNewsItem.video"
          label="Upload Video"
          show-size
          prepend-icon="mdi-video"
          accept=".mp4"
        ></v-file-input>
        
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveNewNews">Сохранить</v-btn>
      <v-btn color="error" @click="cancelCreateNews">Отмена</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


   <!-- Dialog for deleting new-->
  <v-dialog v-model="deleteConfirmationDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Вы уверены, что хотите удалить?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cancelDeleteNews">Отмена</v-btn>
          <v-btn color="red" @click="deleteNews">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for reading the new-->
    <v-dialog v-model="readDialog" max-width="800px">
      <v-card>
        <v-card-title>Читать</v-card-title>
        <v-card-text>{{ selectedText }}</v-card-text>
        <video v-if="selectedVideo" controls>
      <source :src="'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + this.selectedVideo" type="video/mp4">
    </video>

        <v-card-actions>
      <v-btn color="error" @click="closeTextDialog">Выйти</v-btn>
    </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- Dialog for viewing the image-->
    <v-dialog v-model="imageDialog" persistent max-width="1000px">
        <v-card>
            <v-img :src="selectedImage" contain></v-img>
      <v-card-actions>
      <v-btn color="error" @click="closeImageDialog">Выйти</v-btn>
    </v-card-actions>
        </v-card>
      
    </v-dialog>
    
  </template>

        
        
     
      

  <script>
  

  import { mapActions, mapGetters } from 'vuex';
  import NavbarComp from '@/components/NavbarComp.vue';
  import axios from 'axios';
  export default {
    data() {
      return {
        dialog: false,
        filePath: 'https://complaint-backend-drab.vercel.app/file/apc18-bucket/',
      createNewsDialog: false, 
      newNewsItem: {
        id: null,
        title: '',
        description: '',
        text: '',
        image: null,
        video: null,
        image_file: null,
        video_file: null,
        time: null,
      },
      readDialog: false,
      selectedText: '',
      selectedVideo: '',
      newsToDelete: null,
      deleteConfirmationDialog: false,
      imageDialog: false,
      selectedImage: '',
      };
    },
    components: {
      NavbarComp,
    },
    computed: {
        ...mapGetters(["NEWS"]),
        isAuthorOrAdmin() {
            let user_role = sessionStorage.getItem("role_name")
            return user_role === 'author' || user_role === 'admin';
        }
    },
    created() {
            this.GET_NEWS()
        },
        
    methods: {
        ...mapActions(["GET_NEWS"]),
        closeImageDialog(){
            this.imageDialog = false;
        },
        openImageDialog(image){
            this.selectedImage = `https://complaint-backend-drab.vercel.app/file/apc18-bucket/${image}`;
            this.imageDialog = true;

        },
        openReadDialog(text, video) {
            this.selectedText = text;
            this.selectedVideo = video;
            this.readDialog = true;
        },
        closeTextDialog(){
            this.readDialog = false;
        },
        openVideo(){

        },
        handleFileChange(event){
            const file = event.target.files[0];
            this.newNewsItem.image_file = file;

        },
        handleVideoFileChange(event){
            const file = event.target.files[0];
            this.newNewsItem.video_file = file;
        },
        openCreateNewsDialog() {
      // Open the create news dialog
      this.createNewsDialog = true;
    },
    confirmDeleteNews(news){
        this.newsToDelete = news;
        this.deleteConfirmationDialog = true;
    },
    async saveNewNews() {

        const formData = new FormData();
        formData.append('image', this.newNewsItem.image_file);
        if (this.newNewsItem.hasVideo && this.newNewsItem.video_file) {
        formData.append('video', this.newNewsItem.video_file);
      }

        await axios
            .post('https://complaint-backend-drab.vercel.app/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
    .then(() => {
      console.log('Uploaded image');
    });



        if (this.newNewsItem.title && this.newNewsItem.description) {
        
        try {
            let author = sessionStorage.getItem('username')
            let bind = {
                "title": this.newNewsItem.title,
                "description": this.newNewsItem.description,
                "text": this.newNewsItem.text ? this.newNewsItem.text: null,
                "image": this.newNewsItem.image ? this.newNewsItem.image[0].name : null,
                "video": this.newNewsItem.video ? this.newNewsItem.video[0].name : null,
                "author": author
            }
            await axios.post(`https://complaint-backend-drab.vercel.app/add-news`, bind)
            .then(() => {
                console.log('add news')
                
        }).catch(error => {
            console.error('Error:', error);
        }); 
    }catch(err){
        console.log(err)
    }finally{
        this.GET_NEWS()
    }
      this.createNewsDialog = false;
      this.newNewsItem = {
            title: '',
            description: '',
            text: '',
            contentType: 'text',
            image: null,
            video: null,
            hasVideo: false,
            image_file: null,
            video_file: null,
        };

    }
},
    
    cancelCreateNews() {
      // Clear the form and close the dialog
      this.newNewsItem = {
        title: '',
        description: '',
        text: '',
        image: null,
        video: null,
        author: null,
      };
      this.createNewsDialog = false;
    },
    cancelDeleteNews(){
        this.deleteConfirmationDialog = false
    },

    async deleteNews(){
        console.log(this.newsToDelete)
        if (this.newsToDelete) {
            console.log(this.newsToDelete.image)
        

        
        try{
            let bind = {
                id: this.newsToDelete.id,
                image: this.newsToDelete.image,
                video: this.newsToDelete.video
            }
            await axios.delete(`https://complaint-backend-drab.vercel.app/news`, {data: bind}) 
        } catch(e){
            console.log(e)
        } finally{
            this.GET_NEWS();
        }
        this.newsToDelete = null;
        this.deleteConfirmationDialog = false;
        
      }
    },
      readMore() {
        // Implement a function to display the full news article, including video if available.
        // You can use Vue Router to navigate to the full article page or open a dialog/modal with the full article content.
      },

    },
  };
  </script>
  
  <style scoped>
  .image-container {
    width: 100%;
    height: 550px; /* Adjust the height as needed */
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .video-container {
    width: 100%;
    height: 150px; /* Adjust the height as needed */
  }
  .video {
    width: 100%;
    height: 100%;
  }
</style>