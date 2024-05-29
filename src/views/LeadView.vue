<template>
    <v-layout>
      
      <NavbarComp></NavbarComp>
      
      
    <v-app-bar 
    title="Мои жалобы"
    class="pl-8 pr-10">
    <v-spacer></v-spacer>
        <v-btn
        v-if="this.role_name == 'leader'"
        prepend-icon="mdi-plus-box"
        @click="deskCreateOpen"
        color="primary"
        variant="elevated"
        class="text-subtitle-1"

        >Создать доску</v-btn>
      </v-app-bar>
      <v-main>
          <v-row class="ml-3 mr-3 mt-10">
            <v-col v-for="desk in allDesks" :key="desk.desk_id" cols="4">
      <DeskComp 
      :desk_id="desk.desk_id" 
      :desk_name="desk.desk_name"
      :image="desk.image"
      :role_name="this.role_name"
      @desks_update="updateDesks"></DeskComp>
    </v-col>
          </v-row>
    <v-row>

      
    </v-row>
        
      </v-main>
    </v-layout>
      <v-dialog v-model="deskCreateDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Создать доску
            
          </v-card-title>

          <v-card-text>
            <v-text-field density="compact" variant="solo-filled" flat v-model="desk.desk_name" label="Название доски"></v-text-field>
            <v-file-input
          @change="handleFileChange"
          v-model="image_name"
          label="Фон"
          show-size
          prepend-icon="mdi-image"
          accept="image/*"
        ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deskCreateClose"
            class="text-subtitle-1"
            color="red">Cancel</v-btn>
            <v-btn @click="saveDesk"
            class="text-subtitle-1"
            color="#5865f2">Save</v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    
</template>

<script>
import axios from 'axios';
import NavbarComp from '@/components/NavbarComp.vue';
import DeskComp from '@/components/DeskComp.vue'
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      user_id: sessionStorage.getItem('user_id'),
      name: sessionStorage.getItem('name'),
      deskCreateDialog: false,
      role_name: sessionStorage.getItem('role_name'),
      task: {
        task_name: '',
      start_date: null,
      end_date: null,
      },
      desk: {
        desk_name: '',
      },
      image_name: null,
      image_file: null,

      
    };
  },
  components:{
    NavbarComp,DeskComp,
  },
  computed:{
    ...mapGetters(['allDesks']),
    DeskNames(){
      return this.allDesks.map(desk => desk.desk_name);
    }
  },
  methods: {
    ...mapActions(['getDesks']),
    handleFileChange(event){
          const file = event.target.files[0];
          this.image_file = file;
      },


    deskCreateOpen(){
      this.deskCreateDialog = true;
    },
    deskCreateClose(){
      this.clearDeskDialog()
      this.deskCreateDialog = false;
    },
    async saveDesk(){
      
      const formData = new FormData();
        formData.append('image', this.image_file);
        await axios
            .post('https://complaint-backend-drab.vercel.app/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
        .then(() => {
            console.log('Uploaded image');
        });
      let user_id = this.user_id
      console.log('image', this.image_name[0].name)
      let data = {
        user_id: user_id,
        desk_name: this.desk.desk_name,
        image: this.image_name[0].name
      }
      console.log('data with image', data)
      try{
        await axios.post('https://complaint-backend-drab.vercel.app/desks', data)
      }
      catch(error){
        console.log(error)
      }
      finally{
        this.deskCreateDialog = false;
        this.desk.desk_name = ''
        this.clearDeskDialog()
        this.getDesks(user_id)
      }
      
      
    },
    clearDeskDialog(){
      this.image_name = null;
      this.image_file = null;
      this.desk.desk_name = '';
    },
    updateDesks(){
      this.getDesks(this.user_id)
    }
  },
  mounted(){
    this.updateDesks()
  }
};
</script>

<style>
.container {
  padding-left: 20px; 
  padding-right: 20px; 
}
.main-container {
  padding: 20px; 
}
</style>
