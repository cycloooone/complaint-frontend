<template>
  <v-layout>
    
    <navbar-comp></navbar-comp>
    <div>
      <v-main>
      <v-card title="Таблица жалоб">
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="complaints_data" :search="search"
          style="width: 100%; font-size:18px;">
          <template v-slot:[`item.category_name`]="{ item }">
            <v-chip :color="getCategoryColor(item.category_name)">{{ item.category_name }}</v-chip>
          </template>
          <template v-slot:[`item.object_name`]="{ item }">
            <div style="font-size: 18px;">{{ item.object_name }}</div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon size="small" @click="deleteDialog(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Детали жалобы</v-card-title>
            <v-card-text>
              <div v-if="selectedComplaint">
                Вы уверены удалить данную жалобу?
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text @click="dialog = false" :loading="delete_loader">Готово</v-btn>
              <v-btn color="red" v-if="this.selectedComplaint_id" text @click="deleteComplaint" :loading="delete_loader">Удалить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-main>
    </div>
    
  </v-layout>
</template>

<script>
import axios from "axios";
import {mapGetters, mapActions} from 'vuex';
import NavbarComp from "@/components/NavbarComp.vue";
export default {
  name:'ComplaintComp',
  components:{
    NavbarComp
  },
  data() {
    return {
      delete_loader:false,
      search: "",
      headers: [
        { align: "start", key: "client_fullname", sortable: true, title: "Имя клиента" },
        { key: "status", title: "Статус Жалобы" },
        { key: "category_name", title: "Категория Жалобы" },
        { key: "object_name", title: "Объект Жалобы" },
        { key: "description", title: "Детальная инфорамация" },
        { key: "client_email", title: "Почта" },
        { key: "client_contact", title: "Контакты" },
        { key: "create_date", title: "Дата создания" },
        { text: "Actions", value: "actions", sortable: false, },
      ],
      dialog: false,
      selectedComplaint: null,
      selectedComplaint_id:null,
      complaints: [],
      complaint_id:null,
    };
  },
  computed:{
    ...mapGetters(["COMPLAINTS"]),
    complaints_data() {
      return this.COMPLAINTS.filter(
        item =>
          item.category_name === 'Обслуживание'
      );
    },
  },
  methods: {
    ...mapActions(["GET_COMPLAINTS"]),
    openDialog(a) {
      this.complaint_id = a;
      this.selectedComplaint = this.complaints.find(item => item.id = a)
      this.dialog = true;
    },
    deleteDialog(a){
      this.complaint_id = a;
      this.selectedComplaint = this.complaints.find(item => item.id = a)
      this.selectedComplaint_id = a;
      this.dialog=true;
    },
    async deleteComplaint(){
      try{
        this.delete_loader=true;
        await axios.delete(`https://complaint-backend-drab.vercel.app/complaint/${this.selectedComplaint_id}`)
      }
      catch(error){
        console.log("Error deleting complaint", error);
      }
      finally{
        this.selectedComplaint_id=null;
        this.GET_COMPLAINTS();
        this.delete_loader=false;
        this.dialog=false;
      }
    },

    updateStatus() {
      this.dialog = false;
      this.selectedComplaint_id=null;
    },
    getCategoryColor(category) {
      if (category === "Донеры") {
        return "orange-darken-1";
      }
      if (category === "Горячие напитки") {
        return "blue-darken-1";
      }
      if (category === "Персонал") {
        return "blue";
      }
    },
    getStatusColor(category) {
      if (category === "Создано") {
        return "orange-darken-1";
      }
      if (category === "На исполнение") {
        return "blue-darken-1";
      }
      if (category === "Исполнено") {
        return "blue";
      }
    },
  },
  watch:{
    comlaint_id(){
      this.selectedComplaint = this.complaints.find(item => item.id = this.complaint_id)
    }
  },

  created() {
    this.GET_COMPLAINTS();
  },
};
</script>
<style scoped>
p {
  font-size: 20px;
}
</style>