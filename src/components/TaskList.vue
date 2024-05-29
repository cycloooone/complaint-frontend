<template>
    <v-card class="task-card">
  <v-card-title>
    <v-btn @click="ColAdd(desk_id)" color="primary" class="ml-auto">
      Add Collaborator
    </v-btn>
  </v-card-title>
  <v-divider class="mt-2"></v-divider>

  <v-list dense>
    <v-list-item-group>
      <v-list-item
        v-for="task in deskTasks"
        :key="task.task_id"
        :class="{
          'completed-task': task.status === '3',
          'in-progress-task': task.status === '2',
          'not-started-task': task.status === '1',
        }"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ task.task_name }}
            
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon v-if="task.status === 3">
            mdi-check-circle
          </v-icon>
          <v-icon v-if="task.status === 2">
            mdi-progress-clock
          </v-icon>
          <v-icon v-if="task.status === 1">
            mdi-clock-outline
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>

  <v-card-actions>
    <v-btn @click="addTaskToDesk">Add Task</v-btn>
  </v-card-actions>
</v-card>

    
    <v-dialog v-model="addColDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Add Collaborator</v-card-title>
        <v-autocomplete
          label="Username"
          v-model="selectedCollaborators" 
          :items="filteredUsernamesArray"
          multiple
        ></v-autocomplete>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="cancelAddCol">Cancel</v-btn>
          <v-btn color="green" @click="addCollaborator">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addTaskDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Add Task</v-card-title>
        <v-text-field v-model="newTaskname" label="Task name"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="cancelAddTask">Cancel</v-btn>
          <v-btn color="green" @click="addTask">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </template>
  
  <script>
  import axios from 'axios';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    data(){
        return{
            addColDialog: false,
            addTaskDialog: false,
            selectedCollaborators: [],
            collabList: [],
            collab_desk: null,
            filteredUsernamesArray: null,
            newTaskname: null,
        }
    },
    props: ['desk_id', 'deskName'],
    computed: {
      ...mapGetters(['tasksForDesk']),
      deskTasks() {
        
        return this.tasksForDesk;
      },
    },
    methods: {
      ...mapActions(['getTasks']),

      addTaskToDesk(){
        console.log(this.desk_id)
        this.addTaskDialog = true;

      },
      async addTask(){
        if(this.newTaskname){
            try {
                const data = {
                desk_id: this.desk_id,
                task_name: this.newTaskname
            }
                await axios.post('https://complaint-backend-drab.vercel.app/tasks', data)
                console.log('works')
            } catch (error) {
                console.log(error)
            } finally{
                this.getTasks(this.desk_id)
                this.addTaskDialog = false;
                this.newTaskname = ""
            }
        }
        
        
      },
      cancelAddTask(){
        this.addTaskDialog = false;
        this.newTaskname = '';
      },

      ColAdd(desk_id){
        this.addColDialog = true;
        this.collab_desk = desk_id;
        let usernamesArray = this.collabList.map(user => user.username);
        this.filteredUsernamesArray = usernamesArray.filter(username => username !== sessionStorage.getItem('username'));
      },
      cancelAddCol() {
        this.selectedCollaborator = null; // Clear the selected collaborator when the dialog is canceled
        this.addColDialog = false;
        },

      async addCollaborator() {
      if (this.selectedCollaborators) {
        let userIDs; // преобразуем список username в user_id
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
            this.addColDialog = false;
            this.selectedCollaborators = [];
            this.getCollaborators()
         }
      }
    },
    async getCollaborators(){
        let data = await axios.get(`https://complaint-backend-drab.vercel.app/notcollaborators/${this.desk_id}`)
        this.collabList = data.data;
    },

    },
    mounted(){
        this.getCollaborators();
    },
    created() {
      this.getTasks(this.desk_id);

    },
  };
  </script>
  