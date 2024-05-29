<template>
  
    <v-card class="mx-auto pt-2 pl-2 pr-2 rounded-lg" max-width="460" @click="goToDeskView(this.desk_id)">
    <v-img class="rounded-lg" :src="'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + this.image" height="200px" cover></v-img>
    <v-card-title class="flex-column align-start">
      <div class="text-h6 mb-2">
        {{ this.desk_name}}
      </div>
      
        
      
      
      
    </v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-text class="d-flex" v-if="this.role_name == 'leader'">
      <v-chip
        :color="this.users.length > 1 ? 'blue' : 'grey'"
        prepend-icon="mdi-account"
        @click.stop="usersDisplay(this.users.length)"
        class="mr-3"
      >
        <p v-if="this.users.length == 1">No users</p>
      <p v-else-if="this.users.length > 2">{{ this.users.length}} Users</p>
      </v-chip>
      <v-chip
        prepend-icon="mdi-tablet-dashboard"
        @click.stop="tasksDispaly(this.tasks.length)"
        :color="this.tasks.length > 0 ? 'purple-darken-3' : 'grey'"
        class="mr-3"
      >
      <p v-if="this.tasks.length == 1">1 task</p>
      <p v-else-if="this.tasks.length > 1">{{ this.tasks.length }} Tasks</p>
      <p v-else-if="this.tasks.length == 0">No tasks</p>
    
      </v-chip>
      <v-spacer></v-spacer>
        <v-chip
      color="red"
      prepend-icon="mdi-trash-can-outline"
      @click.stop="deskDeleteDialog"
      variant="outlined">
      Delete
      </v-chip>
      

    </v-card-text>
    
    
  </v-card>
      
  
  <v-dialog
   v-model="tasksDialog" 
   max-width="600" 
   scrollable transition="dialog-top-transition">
      <v-card class="pt-5">
        <v-card-title class="text-h4">
          {{this.desk_name}} Задания
        </v-card-title>
        <v-card-title class="text-subtitle-1 d-flex flex-column">
          <span class="mb-4">Статус</span>
          <label>
            <input type="checkbox" v-model="filters.showDone" style="transform: scale(1.5);" />
            <v-icon class="ml-5" color="green" size="x-large">mdi-check-circle-outline</v-icon>
            <span class="ml-2">Завершено</span>
          </label>
          <label class="mt-4">
            <input type="checkbox" v-model="filters.showNotStarted" style="transform: scale(1.5);" />
            <v-icon class="ml-5" color="red" size="x-large">mdi-clock-outline</v-icon>
            <span class="ml-2">Не начато</span>
          </label>

          <label class="mt-4"> 
            <input type="checkbox" v-model="filters.showInProcess" style="transform: scale(1.5);"/>
            <v-icon class="ml-5" color="blue" size="x-large">mdi-cog-clockwise</v-icon>
            <span class="ml-2">В процессе</span>
          </label>
        </v-card-title>

        <v-card-title class="text-subtitle-1">Задания
          <v-list style="max-height: 500px; overflow-y: auto;">
            <v-list-item
            v-for="task in filteredTasks"
            :key="task.task_name"
      >
      <v-list-item-title>
        <span style="font-size: 21px;">{{task.task_name}}</span>
      </v-list-item-title>
      <v-list-item-subtitle v-if="task.start_date">
        Start Date: <span style="font-weight: bold;">{{this.formattedDate(task.start_date)}}</span>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="task.end_date">
        End Date: <span style="font-weight: bold;">{{this.formattedDate(task.end_date)}}</span>
      </v-list-item-subtitle>
        <template v-slot:prepend>
            <v-icon :color="task.status == 'done' ? 'green' : 'blue'">mdi-clipboard-text</v-icon>
        </template>

        <template v-slot:append>
          <v-chip
      color="success"
      variant="tonal"
      v-if="task.status == 'done'"
    >
      <v-icon start icon="mdi-check-circle-outline"></v-icon>
      Завершено
    </v-chip>
    <v-chip
      v-if="task.status == 'not started'"
      color="red"
      variant="tonal"
    >
      <v-icon start icon="mdi-clock-outline"></v-icon>
      Не начато 
    </v-chip>
    <v-chip
      v-if="task.status == 'process'"
      color="primary"
      variant="tonal"
    >
      <v-icon start icon="mdi-cog-clockwise"></v-icon>
      В процессе 
    </v-chip>
        </template>
      </v-list-item>
          </v-list>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeTasksDialog"
          class="text-subtitle-1"
            color="red">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="600">
      <v-card>
        <v-card-title>
          Are you sure to delete a {{ this.desk_name }} desk?
        </v-card-title>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn class="ml-2" @click="deleteDesk" variant="elevated" color="red">
          Delete
        </v-btn>
        <v-btn @click="closeDeskDeleteDialog"
            class="text-subtitle-1"
            color="blue">Cancel
        </v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>

    <v-dialog
   v-model="usersDialog" 
   max-width="600" 
   scrollable transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-h5 mt-3">
          <span>{{this.desk_name}}</span> Участники
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
            v-for="user in users"
            :key="user.user_id"
      >
        
      

      <v-list-item-title>
          <v-avatar size="50" :image="'https://complaint-backend-drab.vercel.app/file/apc18-bucket/' + user.image" class="mr-3"></v-avatar>
          <span style="font-size: 18px;">{{user.name}} {{user.surname}}</span>
      </v-list-item-title>

      </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeUsersDialog"
          class="text-subtitle-1"
            color="red">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import {  mapActions } from 'vuex';
import axios from 'axios';
export default {
  props: ["desk_id", "desk_name", "image", "role_name"],
  data() {
    return {
      progress: 40,
      tasks: [],
      users: [],
      tasksDialog: false,
      usersDialog: false,
      deleteDialog: false,
      filters: {
        showDone: false,
        showNotStarted: false,
        showInProcess: false,
      },
    };
  },
  computed: {
    progressColor() {
      const progress = this.progress;
      return progress < 50 ? 'light-blue' : 'green';
    },
    filteredTasks() {
      return this.tasks.filter((task) => {
        // Check if the task should be displayed based on the selected filters
        if (this.filters.showDone && task.status === 'done') {
          return true;
        }
        if (this.filters.showNotStarted && task.status === 'not started') {
          return true;
        }
        if (this.filters.showInProcess && task.status === 'process') {
          return true;
        }

        // If no filters are selected, show all tasks
        return !this.filters.showDone && !this.filters.showNotStarted && !this.filters.showInProcess;
      });
    },
  },
  methods: {
    ...mapActions(['updateDeskBackground']),
    tasksDispaly(coutTasks){
      
      if(coutTasks > 0){
        this.tasksDialog = true;
      }
      
    },
    usersDisplay(countUsers){ 
      if(countUsers > 1){
        this.usersDialog = true; 
      }
      
    },
    async getTasks(){
      const tasks_api = await axios.get(`https://complaint-backend-drab.vercel.app/tasksAll/${this.desk_id}`)
      this.tasks = tasks_api.data;  
    },
    async getUsers(){
      const users_api = await axios.get(`https://complaint-backend-drab.vercel.app/collaborators/${this.desk_id}`)
      this.users = users_api.data;
    },
    closeTasksDialog(){
      this.tasksDialog = false;
    },
    deskDeleteDialog(){
      this.deleteDialog = true
    },
    closeDeskDeleteDialog(){
      this.deleteDialog = false
    },
    closeUsersDialog(){
      this.usersDialog = false;
    },
    formattedDate(propDate) {
      const dateObject = new Date(propDate);
      return dateObject.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    async deleteDesk(){
      if (this.desk_id) {
        try{
            await axios.delete(`https://complaint-backend-drab.vercel.app/desks/${this.desk_id}`) 
        } catch(e){
            console.log(e)
        } finally{
            this.$emit('desks_update')
            this.deleteDialog = false;
            
        }
        
        
      }
    },
    goToDeskView(deskId) {
      sessionStorage.setItem('desk_image', this.image)
      this.$router.push({ name: 'desk-details', params: { desk_id: deskId, desk_image: this.image } });
    },
  },
  mounted() {
    this.getTasks()
    this.getUsers()
  },
};
</script>
<style scoped>
.scrollable-content {
  max-height: 300px; /* Set your desired max height */
  overflow-y: auto;
}</style>
