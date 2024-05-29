<template>
    <v-btn v-if="createColumnBtn"
            prepend-icon="mdi-plus"
            width="300"
            class="text-subtitle-1 rounded-lg"
            @click="columnDisplay"
            color="grey-darken-1"
            variant="tonal">
                Добавить еще однку колонку
          </v-btn>
          <v-card v-if="createColumnCard"
            width="300"
            class="rounded-lg pb-2 pl-2 pr-2">
      
            <v-text-field
            class="mt-3"
            v-model="task_name"
            label="Ввести заголовок списка"
            density="compact"
            variant="outlined"
            single-line
            ></v-text-field>
            <v-btn
            variant="flat"
            color="blue"
            @click="columnCreate"
            class="text-subtitle-2">
            Добавить список
            </v-btn>
            <v-icon class="ml-2" @click="closeColumnCard">mdi-close</v-icon>
          </v-card>
</template>
<script>
import axios from 'axios';
    export default{
        data(){
            return{
                createColumnBtn: true,
                createColumnCard: false,
                task_name: '',
            }
        },
        methods:{
            columnDisplay(){
                this.createColumnBtn = false;
                this.createColumnCard = true;
            },
            closeColumnCard(){
                this.createColumnBtn = true;
                this.createColumnCard = false;
            },
            columnCreate(){
                let bind = {
                    task_name: this.task_name,
                    start_date: null,
                    end_date: null,
      }
      axios.post('https://complaint-backend-drab.vercel.app/tasks', bind)
      this.$emit('tasks_update')
      this.task_name = ''
      this.createColumnBtn = true;
      this.createColumnCard = false;
            },
        },

    }
</script>