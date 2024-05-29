<template>
  <v-layout>
    <NavbarComp></NavbarComp>
    <v-main>
      <v-btn @click="DeskAdd">
        Add desk
    </v-btn>
      <div>
    <v-container>
      <v-row>
        <v-col v-for="desk in allDesks" :key="desk.desk_id" cols="4">
          <v-card class="mb-3 desk-card">
            <v-card-title>
                <v-subtitle-1 class="headline" >
            {{ desk.desk_name }}
          </v-subtitle-1>
            </v-card-title>
            <v-card-text>
              <!-- Include the Tasks component to display tasks for this desk -->
              <TaskList :desk_id="desk.desk_id" />
            </v-card-text>
            
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
    </v-main>
  </v-layout>
    
    
    <v-dialog v-model="addDeskDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Add Desk</v-card-title>
        <v-card-text>
          <v-text-field v-model="newDeskName" label="Desk name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="cancelAddDesk">Cancel</v-btn>
          <v-btn color="green" @click="addDeskFunction">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>

  import { mapGetters, mapActions } from "vuex";
  import TaskList from "../components/TaskList.vue"; // Import your TaskList component
  import NavbarComp from "@/components/NavbarComp.vue";
  import axios from "axios";
  export default {
    data() {
        return {
            addDeskDialog: false,
            newDeskName: "",
        }
    },
    components: {
      TaskList, NavbarComp
    },
    computed: {
      ...mapGetters(["allDesks"]),
    },
    methods: {
        ...mapActions(["getDesks"]),
        addDeskaddDesk() {
        if (this.newDeskName) {
          this.$store.dispatch('createDesk', { desk_name: this.newDeskName });
          this.newDeskName = ''; // Clear the input field after adding a desk
        }
      },
      DeskAdd(){
        this.addDeskDialog = true;
      },
      
      cancelAddDesk(){
        this.newDeskName = ""
        this.addDeskDialog = false;
      },
      async addDeskFunction(){    
        if(this.newDeskName){
            const user_id = sessionStorage.getItem('user_id')
            try {
                let bind = {
                    desk_name: this.newDeskName,
                    user_id: user_id
                }
                await axios.post(`https://complaint-backend-drab.vercel.app/desks`, bind)
                .then(() => {
                    console.log('Registration successful');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } catch (error) {
                console.log(error)
            }finally{
                this.addDeskDialog = false;
                this.getDesks(user_id);
                this.newDeskName = ""
            }
            }
        else{
            console.log('continue')
        }
        
      },
      

    

    },
    mounted(){
        let user_id = sessionStorage.getItem("user_id")
      this.getDesks(user_id);   
      
    },  
    created() {
      // Dispatch actions to fetch data from the store
      
    },
  };
  </script>

<style scoped>
.desk-card {
  max-height: 700px; /* Set the maximum height for each desk card */
  overflow: hidden; /* Hide overflow content */
  padding: 16px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin: 8px;
  display: flex;
  flex-direction: column;
}

.v-card__title {
  margin-bottom: auto; /* Push the title to the top */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-list {
  max-height: 100%; /* Set the maximum height for the task list within the desk card */
  overflow-y: auto; /* Enable vertical scrolling if the tasks exceed the maximum height */
}

/* Style to hide the scrollbar when it's not active */
.task-list::-webkit-scrollbar {
  width: 8px;
}

.task-list::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>



  