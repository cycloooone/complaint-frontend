<template>
  <v-layout>
    <v-main>
      <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" >
          <v-card elevation="10">
          <v-row justify="center" class="mt-5">
            <v-avatar size="125px" :image="'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + this.userData.image">
            </v-avatar>
          </v-row>
            <v-card-subtitle class="text-center mt-5" >{{this.userData.role_name}}</v-card-subtitle>
            <v-card-title class="text-center text-h4">{{this.userData.username}}</v-card-title>
            <v-divider></v-divider> 
            <v-card-text class="text-h7">
              {{ this.userData.name }} {{ this.userData.surname }}
            </v-card-text>
          <v-divider></v-divider>
            <v-card-title class="mt-5 headline text-h5">Contact Information</v-card-title>
                  <v-card-subtitle>Email:</v-card-subtitle>
                  <v-card-text>{{this.userData.mail}}</v-card-text>
                  <v-card-subtitle>Phone:</v-card-subtitle>
                  <v-card-text>{{ this.userData.number }}</v-card-text>
                  <v-card-subtitle>Department:</v-card-subtitle>
                  <v-card-text>{{ this.userData.department }}</v-card-text>
                  
                  <v-card-actions>
                    <v-btn
                  @click="logout"
                  class="mb-2 ml-5 text-none text-subtitle-1"
                  color="blue-grey-darken-4"
                  size="small"
                  variant="flat"><v-icon left>mdi-logout</v-icon>Logout</v-btn>
                  </v-card-actions>
                  
                </v-card>
        </v-col>
      </v-row>


          
          
    
    </v-container>
    </v-main>
    
    
  </v-layout>
  
</template>


   
<script>


export default {
  data() {
      return {
        username: sessionStorage.getItem('username'),
        role_name: sessionStorage.getItem('role_name'),
        user_id: sessionStorage.getItem('user_id'),
        userData: {
          name: "",
          surname: "",
          image: null, 
          mail: null,
          department: null,
          number: null,
          username: null, 
          role_name: null,
        },
        
      };
    },

    computed: {
        imageUrl() {
            let baseUrl = "https://complaint-backend-drab.vercel.app/file/apc18-bucket/"
            let imageUrl = baseUrl.concat(this.image)
            return imageUrl
        }
    },

    methods: {
      logout() {
        sessionStorage.clear();

        this.$store.dispatch('resetStore');
        this.$router.push('/login');
      },
      async getUser(){
            this.userData.username = sessionStorage.getItem('username')
            this.userData.name = sessionStorage.getItem('name')
            this.userData.surname = sessionStorage.getItem('surname')
            this.userData.mail = sessionStorage.getItem('mail')
            this.userData.number = sessionStorage.getItem('number')
            this.userData.department = sessionStorage.getItem('department')
            this.userData.role_name = sessionStorage.getItem('role_name')
            this.userData.image = sessionStorage.getItem('image')
      },
      editProfile() {
      // Add logic to navigate to the edit profile page or show an edit modal
      console.log("Edit button clicked");
    },
    editAvatar(){
        this.avatarDialog = true;
    },
    },
    created() {
        this.getUser()
    },
};
</script>


<style scoped>
*{
  text-align: center;
}
</style>

