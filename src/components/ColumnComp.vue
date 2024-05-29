<template>
    <v-card color="grey-lighten-4" width="300" style="border-radius: 15px;" class="pt-3 d-flex flex-column" variant="elevated" >
      <div class="d-flex text-h6 pl-4" style="max-height: 500px; color:#172b4d;">
        <span style="font-size: 17px;">{{ this.column_name }}</span>
        <v-spacer></v-spacer>
        <v-chip v-if="role_name == 'leader'" variant="text" @click="toggleActions"><v-icon>mdi-dots-horizontal</v-icon></v-chip><br>
      </div>
      <v-card-text v-if="this.user_filter != null" style="margin:0;padding: 0; font-size: 16px; color:#6d798e;" class="pl-4">
        <span>Карточек соответствует фильтрам:</span>
        {{ this.allTasks.length }}
      </v-card-text>
      <div class="overflow-y-auto mt-3" style="max-height: 700px;"> 
        <div class="d-flex flex-column">
          <TaskComp v-for="task in allTasks" :key="task.task_id" :task_id="task.task_id" :task_name="task.task_name"></TaskComp>
        </div>
        <v-card v-if="createTaskCard" class="rounded-lg text-subtitle-1 mr-3 ml-3 pl-1 pr-1 pt-2 pb-2" >
          <textarea ref="taskTextarea" v-model="task_name" maxlength="255" style="height: 70px; width: 100%; padding: 5px;" placeholder="Ввести заголовок для этой карточки"></textarea>
        </v-card>
        <v-card v-if="createTaskCard" variant="text" class="rounded-lg pl-2 pt-2 pb-2 mr-2 ml-1 mb-1">
          <v-btn
            variant="flat"
            color="blue-darken-2"
            @click="taskCreate"
            class="text-subtitle-2">
            Добавить карточку
          </v-btn>
          <v-icon class="ml-2" size="small" @click="closeTaskCard">mdi-close</v-icon>
        </v-card>
      </div>
  
      <v-btn v-if="createTaskBtn && this.role_name == 'leader'"
        prepend-icon="mdi-plus"
        width="300"
        class="text-subtitle-1 mt-2 text-center rounded-lg mb-2 hover_class"
        @click="taskDisplay"
        color="grey-darken-1"
        variant="outline">
        Добавить карточку
      </v-btn>
  
    </v-card>
  </template>
  
  <script>
  import axios from 'axios';
  import TaskComp from './TaskComp.vue';
  
  export default {
    props: ['column_id', 'column_name', 'user_filter', 'status_filter'],
    data() {
      return {
        task_name: '',
        createTaskBtn: true,
        createTaskCard: false,
        tasks: [],
        showActions: false,
        role_name: sessionStorage.getItem('role_name'),
        user_id: sessionStorage.getItem('user_id'),
      };
    },
    methods: {
      checkJust() {
        console.log('works');
      },
      taskDisplay() {
        this.createTaskBtn = false;
        this.createTaskCard = true;
        this.$nextTick(() => {
          this.$refs.taskTextarea.focus();
        });
      },
      closeTaskCard() {
        this.createTaskBtn = true;
        this.createTaskCard = false;
      },
      async taskCreate() {
        let bind = {
          task_name: this.task_name,
          column_id: this.column_id
        };
        
        await axios.post('https://complaint-backend-drab.vercel.app/tasks', bind);
        this.task_name = '';
        this.createTaskBtn = true;
        this.createTaskCard = false;
        this.getTasks();
        this.taskDisplay()
      },
      async getTasks() {
        const data = await axios.get(`https://complaint-backend-drab.vercel.app/tasks/${this.column_id}`);
        this.tasks = data.data;
      },
      async getUserTasks(user_id){
        const data = await axios.get(`https://complaint-backend-drab.vercel.app/userTasks/${this.column_id}/${user_id}`);
        console.log(data.data)
        this.tasks = data.data;
      },
      toggleActions() {
      },

    },
    computed: {
      parentCardMaxHeight() {
        return this.createTaskCard ? '1000px' : '500px';
      },
      allTasks(){
        // return this.tasks;
        return this.tasks.filter((task) => {
        // Check if the task should be displayed based on the selected filters
        if (this.status_filter.showDone && task.status === 'done') {
          return true;
        }
        if (this.status_filter.showNotStarted && task.status === 'not started') {
          return true;
        }
        if (this.status_filter.showInProcess && task.status === 'process') {
          return true;
        }
        return !this.status_filter.showDone && !this.status_filter.showNotStarted && !this.status_filter.showInProcess;
      });
        
      }
    },
    watch: {
    user_filter(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.role_name === 'leader') {
          if (newVal === null) {
            this.getTasks();
          } else {
            this.getUserTasks(newVal);
          }
        } else {
          this.getUserTasks(this.user_id);
        }
      }
    },
  },

    mounted() {
      if (this.role_name === 'leader') {
        this.getTasks();
    } else {
        this.getUserTasks(this.user_id);
    }
      
    },
    components: { TaskComp },
  };
  </script>
  
  <style scoped>
  </style>
  