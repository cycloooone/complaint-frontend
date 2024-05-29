
<template>
  

  <v-layout>
    <NavbarComp></NavbarComp>
    <v-main :style="{ background: 'url(' + imageUrl + ')', backgroundSize: 'cover' }">
      <div class="mt-5 ml-5 pr-5 d-flex task-list-container"  style="align-items: flex-start; height: 92vh;">
        <div class="d-flex" style="align-items: flex-start;">
            <ColumnComp
        class="mr-5 d-inline-block"
        v-for="column in propColumns"
        :key="column.column_id"
        :column_id="column.column_id"
        :column_name="column.column_name"
        :user_filter="convertedFilterUsersToIds"
        :status_filter="this.filters"
    ></ColumnComp>        
    
</div>

          <v-btn v-if="createColumnBtn && this.role_name == 'leader'"
            prepend-icon="mdi-plus"
            width="300"
            class="text-subtitle-1 rounded-lg"
            @click="columnDisplay"
            color="white"
            variant="elevated">
                Добавить еще однку колонку
          </v-btn>
          <v-card v-if="createColumnCard" 
            width="300"
            class="rounded-lg pb-2 pl-2 pr-2"
            style="min-width: 300px">
            <v-text-field
            ref="deskTextField"
            class="mt-3 text-subtitle-1"
            v-model="column_name"
            label="Ввести заголовок списка"
            density="compact"
            variant="outlined"
            maxlength="255"
            single-line
            ></v-text-field>
            <v-btn
            variant="flat"
            color="blue-darken-3"
            @click="columnCreate"
            class="text-subtitle-1">
            Добавить список
            </v-btn>
            <v-icon class="ml-2" @click="closeColumnCard">mdi-close</v-icon>
          </v-card>

      
      </div>
    
    </v-main>
    <v-app-bar 
    title="Desk Details" 
    class="pl-8 pr-10">
    <v-spacer></v-spacer>
    <div v-if="this.role_name == 'leader'">
      <v-btn 
        prepend-icon="mdi-filter-variant"
        @click="openRightNavbar"
        variant="text"
        class="text-subtitle-1 mr-5"

        >Фильтры</v-btn>
        <v-btn 
        prepend-icon="mdi-account-plus-outline"
        @click="addCollab"
        color="indigo-darken-1"
        variant="elevated"
        class="text-subtitle-1"

        >Поделиться</v-btn>
    </div>
    
      </v-app-bar>
      <v-navigation-drawer style="margin: 0; padding:0" v-if="rightNavbar" location="right" :width="400">
      <v-card class="pt-5" variant="flat" style="background-color: white;">
        <v-icon @click="closeRightNavbar" style="cursor: pointer; float: right;" class="pr-7 pt-6">mdi-close</v-icon>
          <v-card-title style="text-align: center;" class="text-h6">Фильтр</v-card-title>
        
        <v-card-title class="text-subtitle-1">Участники</v-card-title>
        <v-autocomplete style="margin:0;padding:0;" density="comfortable" variant="outlined" placeholder="Выбрать участника" prepend-icon="mdi-account-search" v-model="filterUsers" :items="namesAndSurnames" class="ml-3 mr-5"></v-autocomplete>
        <v-card-text v-if="this.filterUsers != null" class="mr-10" style="float: right;margin:0; padding: 0; font-size:15px; cursor: pointer; text-decoration: underline;" @click="dropUserFilter">Очистить</v-card-text>
        <v-card-title class="text-subtitle-1 d-flex flex-column">
          <span class="mb-4">Статус</span>
          <div class="pl-3 d-flex flex-column">
            <label>
            <input v-model="filters.showDone" type="checkbox" style="transform: scale(1.5);" />
            <v-icon class="ml-5" color="green" size="x-large">mdi-check-circle-outline</v-icon>
            <span class="ml-2">Завершено</span>
          </label>
          <label class="mt-4">
            <input v-model="filters.showNotStarted" type="checkbox" style="transform: scale(1.5);" />
            <v-icon class="ml-5" color="red" size="x-large">mdi-clock-outline</v-icon>
            <span class="ml-2">Не начато</span>
          </label>

          <label class="mt-4"> 
            <input v-model="filters.showInProcess" type="checkbox" style="transform: scale(1.5);"/>
            <v-icon class="ml-5" color="blue" size="x-large">mdi-cog-clockwise</v-icon>
            <span class="ml-2">В процессе</span>
          </label>
          </div>
          
        </v-card-title>
      </v-card>
    </v-navigation-drawer>
  </v-layout>
    
  <v-dialog
   v-model="addCollabDialog"
   width="600">
    <v-card>
      <v-card-title class="mt-3">Добавить участника</v-card-title>
      <v-autocomplete
          variant="outlined"
          class="pr-2 pl-2 mt-3"
          single-line
          label="Пользователи"
          v-model="selectedCollaborators" 
          :items="filteredUsernamesArray"
          multiple
        ></v-autocomplete>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" @click="cancelAddCol">Отмена</v-btn>
          <v-btn color="indigo-darken-2" @click="addCollaborator">Добавить</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
 
  </template>
  
  <script>
  import ColumnComp from '@/components/ColumnComp.vue';
  import NavbarComp from '@/components/NavbarComp.vue';
  import axios from 'axios';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    data(){
      return {
        role_name: sessionStorage.getItem('role_name'),
        createColumnBtn: true,
        createColumnCard: false,
        column_name: '',
        addCollabDialog: false,
        image: '',
        selectedCollaborators: [],
        collabList: [],
        collab_desk: '',
        filteredUsernamesArray: null,
        user_id: sessionStorage.getItem('user_id'),
        allUserColumns:[],
        rightNavbar: false,
        filterUsers: null,
        filters: {
          showDone: false,
          showNotStarted: false,
          showInProcess: false,
        },

      }
    },
    props: ['desk_id'],
    computed: {
      ...mapGetters(['allColumns', 'allCollabs']),
      deskId() {
        return this.desk_id;
      },
      propColumns(){
        if(this.role_name == 'leader'){
          return this.allColumns;
        }
        else{
          return this.allUserColumns;
        }
      },
      namesAndSurnames() {
        return this.allCollabs.map((user) => `${user.name} ${user.surname}`);
      },
      imageUrl(){
        return 'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + this.image
      },
      convertedFilterUsersToIds() {
        if (this.filterUsers) {
          const userNames = this.filterUsers.split(' ');
          const user = this.allCollabs.find(
            user => user.name === userNames[0] && user.surname === userNames[1]
          );

          return user ? user.user_id : null;
        }

        return null;
      },
    },
    methods:{
      ...mapActions(['getColumns', 'getCollabs']),
      filtersOpen(){
        console.log('filters open')
      },
      dropUserFilter(){
        this.filterUsers = null;
      },
      addCollab(){
        this.addCollabDialog = true
        this.collab_desk = this.desk_id;
        let usernamesArray = this.collabList.map(user => user.username);
        this.filteredUsernamesArray = usernamesArray.filter(username => username !== sessionStorage.getItem('username'));
      },
      cancelAddCol() {
        this.selectedCollaborators = null; 
        this.addCollabDialog = false;
        },
      columnDisplay(){
        this.createColumnBtn = false;
        this.createColumnCard = true;
        this.$nextTick(() => {
                this.$refs.deskTextField.focus();
            });
      },
      closeColumnCard(){
        this.createColumnBtn = true;
        this.createColumnCard = false;
      },
      async columnCreate(){
        let bind = {
          column_name: this.column_name,
          desk_id: this.desk_id
      }
      await axios.post('https://complaint-backend-drab.vercel.app/columns', bind)
        this.column_name = ''
        this.getColumns(this.desk_id)
        this.createColumnBtn = true;
        this.createColumnCard = false;
        
      },
      async addCollaborator() {
        if (this.selectedCollaborators) {
            let userIDs; 
            userIDs = this.selectedCollaborators.map(username => {
            const user = this.collabList.find(user => user.username === username);
            return user ? user.user_id : null;
        });
         try {
            const data = {
                desk_id: this.collab_desk,
                userIDs: userIDs
            };
            console.log('fronte', data)
            await axios.post(`https://complaint-backend-drab.vercel.app/collab/`, data)
         } catch (error) {
            console.log(error)
         } finally{
            this.addCollabDialog = false;
            this.selectedCollaborators = [];
            this.getNotCollaborators();
            this.getCollabs(this.desk_id);
         }
      }
    },
    async getNotCollaborators(){
          let data = await axios.get(`https://complaint-backend-drab.vercel.app/notcollaborators/${this.desk_id}`)
          console.log('works', data.data)
          this.collabList = data.data;
    },

    async getUserColumns(){
      console.log('user_id, desk_id', this.desk_id, this.user_id)
      const result = await axios.get(`https://complaint-backend-drab.vercel.app/userColumns/${this.desk_id}/${this.user_id}`);
      this.allUserColumns = result.data
    },
    openRightNavbar(){
      this.rightNavbar = true;
    },
    closeRightNavbar(){
      this.rightNavbar = false;
    }

    },
    
    components:{
      NavbarComp, ColumnComp, 
    },
    mounted(){
      this.image = sessionStorage.getItem('desk_image');  
      console.log(this.image)
      if(this.role_name == 'leader'){
        this.getColumns(this.desk_id)
        this.getNotCollaborators();
        this.getCollabs(this.desk_id)
        
      }
      else{
        this.getUserColumns()
      }

    },

  };
  </script>
  <style scoped>
.task-list-container {
  display: flex;
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Set a maximum width if needed */
}

</style>
  