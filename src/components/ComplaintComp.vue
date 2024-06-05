<template>
    <v-layout>
      <div>
        <v-main>
        <v-card title="Таблица жалоб">
          <template v-slot:text>
            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
              single-line></v-text-field>
          </template>
  
          <v-data-table :loading="COMPLAINT_LOADING" :headers="headers" :items="complaint_data_products" :search="search" @click:stop="openDialog"
            style="width: 100%; font-size:18px;">
            <template v-slot:[`item.client_fullname`]="{ item }">
                <v-chip prepend-icon="mdi-account">{{ item.client_fullname }}</v-chip>
            </template>
            <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <v-chip :color="getCategoryColor(item.category_name)">{{ item.category_name }}</v-chip>
            </template>
            <template v-slot:[`item.object_name`]="{ item }">
              <div style="font-size: 18px;">{{ item.object_name }}</div>
            </template>
            
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon size="small" @click.stop="deleteDialog(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Complaint Details</v-card-title>
        <v-card-text>
          <v-row class="mb-2" v-for="field in complaintFields" :key="field.key">
            <v-col class="text-start" cols="4">
              <v-chip color="blue lighten-4" text-color="blue darken-4">
                <v-icon left>{{ field.icon }}</v-icon>
                {{ field.title }}
              </v-chip>
            </v-col>
            <v-col class="text-end" cols="8">
              <v-chip v-if="field.key !== 'status'" color="grey lighten-4" text-color="grey darken-4">
                {{ complaint[field.key] }}
              </v-chip>
              <v-select
                v-else
                v-model="complaint_status"
                :items="statuses"
                label="Change Status"
                class="grey lighten-4"
                item-text="status"
                item-value="status"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="status_loader" color="blue darken-1" text @click="saveStatus">Сохранить</v-btn>
          <v-btn :loading="status_loader" color="green darken-1" text @click="dialog = false">Отмена</v-btn>
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
  export default {
    name:'ComplaintComp',
    data() {
      return {
        delete_loader:false,
        statuses: ["Создано", "В процессе", "Исполнено"],
      complaintFields: [
        { key: "client_fullname", title: "Имя клиента", icon: "mdi-account" },
        { key: "category_name", title: "Категория Жалобы", icon: "mdi-tag" },
        { key: "object_name", title: "Объект Жалобы", icon: "mdi-domain" },
        { key: "description", title: "Детальная инфорамация", icon: "mdi-information" },
        { key: "client_email", title: "Почта", icon: "mdi-email" },
        { key: "client_contact", title: "Контакты", icon: "mdi-phone" },
        { key: "create_date", title: "Дата создания", icon: "mdi-calendar" },
        { key: "status", title: "Статус Жалобы", icon: "mdi-alert" },
      ],
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
        status_loader:false,
        selectedComplaint: null,
        selectedComplaint_id:null,
        complaints: [],
        complaint_id:null,
        complaint:null,
        complaint_status:null
      };
    },

    props:["tableType", "statusType", "productType"],
    computed:{
      ...mapGetters(["COMPLAINTS", "COMPLAINT_LOADING"]),
      complaints_data() {
        let dt;
        if(this.tableType=='service'){
            dt = this.COMPLAINTS.filter(
            item =>
                item.category_name !== 'Горячие напитки' && item.category_name !== 'Донеры'
            );
        }
        else if(this.tableType=='food'){
            dt = this.COMPLAINTS.filter(
            item =>
                 item.category_name === 'Донеры'
            );
        }
        else if(this.tableType==='drinks'){
            dt = this.COMPLAINTS.filter(
                item => item.category_name === 'Горячие напитки'
            )
        }
        else if(this.tableType=='all'){
            dt = this.COMPLAINTS
        }
        return dt;
      },
      complaints_data_statuses(){
        let dt=[];
        if(this.statusType==='created'){
            dt = this.complaints_data.filter(
            item =>item.status === 'Создано'
            );
        }
        if(this.statusType==='process'){
            dt = this.complaints_data.filter(
            item =>
                item.status === 'В процессе'
            );
        }
        if(this.statusType==='completed'){
            dt = this.complaints_data.filter(
            item =>
                item.status === 'Исполнено'
            );
        }
        if(this.statusType==='all'){
            dt = this.complaints_data
        }
        return dt;
      },
      complaint_data_products(){
        let dt=this.complaints_data_statuses;
        if(this.productType){
            if(this.productType!='все'){
                dt = dt.filter(
                item =>
                    item.object_name === this.productType
                );
            }
        }
        return dt;
      },
    },
    methods: {
      ...mapActions(["GET_COMPLAINTS"]),
      async saveStatus(){
        let payload = {
            status: this.complaint_status,
            id: this.complaint.id
        }
        try{
            this.status_loader=true;
            await axios.put("https://complaint-backend-drab.vercel.app/complaint", payload)
        }
        catch(e){
            console.log(e)
        }
        finally{
            this.dialog=false;
            this.status_loader=false;
            this.GET_COMPLAINTS();
        }
        
      },
      openDialog(a) {
        console.log('hey',a)
      },
      deleteDialog(a){
        this.complaint=a
        console.log('hello')
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
          return "blue-darken-1";
        }
        if (category === "В процессе") {
          return "grey-darken-1";
        }
        if (category === "Исполнено") {
          return "green";
        }
      },
    },
    watch:{
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