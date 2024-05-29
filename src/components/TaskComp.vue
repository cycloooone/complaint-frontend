<template>
    <v-card 
    @click="openTaskDialog" 
    class="task_card rounded-lg text-subtitle-1 pl-3 pr-3 pt-2 pb-2 mb-2 mr-3 ml-3" 
    variant="elevated">
                <span style="color:#172b4d;">{{this.task_name}}</span><br>
                <v-chip
                color="success"
                variant="tonal"
                v-if="task.status == 'done'"
                >
                    <v-icon start icon="mdi-check-circle-outline"></v-icon>
                        Сделано
                </v-chip>
                <v-chip
                v-if="task.status == 'not started'"
                color="red"
                variant="tonal"
                class="status-chip mt-1"
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
            <v-spacer></v-spacer>
            
        
    </v-card>
    <v-dialog max-width="600"
     v-model="TaskDialog">
        <v-card class="rounded-lg pt-3">
            <v-card-title class="text-h5"> 
                <span>{{ this.task_name }}</span>
            </v-card-title>
            <v-card-title class="text-subtitle-1">
                Статус
                <br>
                <v-chip
                color="success"
                variant="tonal"
                v-if="task.status == 'done'"
                >
                    <v-icon start icon="mdi-check-circle-outline"></v-icon>
                        Сделано
                </v-chip>
                <v-chip
                v-if="task.status == 'not started'"
                color="red"
                variant="tonal"
                class="status-chip mt-1"
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
                <br>
                <v-card-text v-if="this.role_name != 'leader'" style="font-size:15px; cursor: pointer; text-decoration: underline;" variant="text" @click="enableEditStatus">Изменить</v-card-text>
            </v-card-title>
        
            
            <v-card-title style="margin-bottom:-10px;" class="text-subtitle-1">
                Участники
            </v-card-title>
            
            <v-list>
                <v-list-item v-for="(collab, index) in task_collabs" :key="index">
                    <v-chip prepend-icon="mdi-account-tie">{{ collab.name }} {{ collab.surname }}</v-chip>
                </v-list-item>
            </v-list>

            <v-checkbox v-if="this.role_name == 'leader'" class="pl-2" label="Добавить участника" v-model="enableAddCollab"></v-checkbox>
            <v-autocomplete
            v-if="enableAddCollab"
            class="pr-2 pl-2 mr-10"
            single-line
            clearable
            variant="outlined"
            chips
            label="Username"
            v-model="selectedCollaborators" 
            :items="deskCollabsNotInTaskNames"
            multiple
            position-y="below"
            prepend-icon="mdi-account-multiple-plus"
            ></v-autocomplete>
            <v-btn color="blue-darken-2" prepend-icon="mdi-plus" @click="addTaskCollabs" v-if="selectedCollaborators.length > 0" max-width="150" class="text-subtitle-1 ml-7 mb-2">Добавить</v-btn>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeTaskDialog" class="mr-2" color="red">Выйти</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="enableStatus" max-width="400">
        <v-card>
            <v-card-title>
                Изменить статус задания
            </v-card-title>
            <v-radio-group v-model="selectedStatus" >
                <v-radio v-model="selectedStatus" value="not started"><template v-slot:label><v-chip style="color:red;">Не начато</v-chip ></template></v-radio>
                <v-radio v-model="selectedStatus" value="process"><template v-slot:label><v-chip style="color:blue;">В процессе</v-chip ></template></v-radio>
                <v-radio v-model="selectedStatus" value="done"><template v-slot:label><v-chip style="color:green;">Завершено</v-chip ></template></v-radio>
            </v-radio-group>
            <v-card-text v-if="errorEdit" color="red"><span style="color:red">Вы не изменили статус!</span></v-card-text>
            <v-card-actions>
                <v-btn @click="disableEditStatus" variant="elevated" color="red" class="text-subtitle-1 rounded-lg">
                    Отмена
                </v-btn>
                <v-btn @click="sendEditStatus" variant="elevated" color="blue" class="text-subtitle-1 rounded-lg">
                    Изменить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    

</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
    export default{
        props: ["task_id", "task_name"],
        data(){
            return{
                TaskDialog: false,
                task: {},
                task_collabs: [],
                desk_collabs: [],
                selectedCollaborators: [],
                enableAddCollab: false,
                enableDeadline: false,
                enableStatus: false,
                addMessage: false,
                role_name: sessionStorage.getItem('role_name'),
                deadline: null,
                selectedStatus: '',
                errorEdit: false,
            }
        },
        computed:{
            ...mapGetters(['allCollabs',]),
            deskCollabsNotInTaskNames() {
                const filteredDeskCollabs = this.desk_collabs.filter(
                    (deskCollab) =>
                    !this.task_collabs.some(
                        (taskCollab) => taskCollab.user_id === deskCollab.user_id
                    )
                );

                return filteredDeskCollabs.map((collab) => `${collab.name} ${collab.surname}`);
            },
        },
        methods:{
            openTaskDialog(){
                this.getTaskCollabs()
                this.TaskDialog = true;
            },
            closeTaskDialog(){
                this.TaskDialog = false;
            },
            async getTask(){
                try{
                    const data = await axios.get(`https://complaint-backend-drab.vercel.app/task/${this.task_id}`)
                    this.task = data.data[0];
                }
                catch(e){
                    console.log(e)
                }
            },
            async getTaskCollabs(){
                try{
                    console.log(this.task_id)
                    const data = await axios.get(`https://complaint-backend-drab.vercel.app/taskCollaborators/${this.task_id}`)
                    this.task_collabs = data.data
                    this.desk_collabs = this.allCollabs
                }
                catch(e){
                    console.log(e)
                }
            },
            async addTaskCollabs(){
                const selectedUserIds = this.selectedCollaborators.map(selected => {
                    const [name, surname] = selected.split(' ');
                    const collaborator = this.desk_collabs.find(collab => collab.name === name && collab.surname === surname);
                    return collaborator ? collaborator.user_id : null;
            });

            const filteredUserIds = selectedUserIds.filter(userId => userId !== null);
            try {
            const data = {
                task_id: this.task_id,
                userIDs: filteredUserIds
            };
            await axios.post(`https://complaint-backend-drab.vercel.app/taskCollab/`, data)
            } catch (error) {
                console.log(error)
            } finally{
                this.selectedCollaborators = []
                this.getTaskCollabs()
                this.enableAddCollab = false;
            }
        },
        checkDeadline(){
            console.log(this.deadline)
        },
        enableEditStatus(){
            console.log('works')
            this.errorEdit = false
            this.selectedStatus = this.task.status
            this.enableStatus = true
        },
        disableEditStatus(){
            this.enableStatus = false;
        },
        async sendEditStatus(){
            if(this.selectedStatus == this.task.status){
                this.errorEdit = true
            }
            else{
                try{
                    let bind = {
                        task_id: this.task_id,
                        status: this.selectedStatus
                    };
                    await axios.post(`https://complaint-backend-drab.vercel.app/taskStatus`, bind)
                }
                catch(e){
                    console.log(e)
                }
                finally{
                    this.errorEdit = false
                    this.enableStatus = false
                    this.getTask()
                }
            }
        },
        },
        mounted(){
            this.getTask()
        }
    }
</script>
<style scoped>
.text-subtitle-1 {
    background-color: white;
    /* Add other styles as needed */
} 
.task_card:hover {
    border-color: blue; /* Change the border color on hover */
}

</style>