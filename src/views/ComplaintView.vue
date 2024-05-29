<template>
  <v-layout>
    <v-navigation-drawer :width="300">
      <template v-slot:prepend>
        <v-list-item lines="two">
          <span>{{ role_name }}</span> <span>{{ name }}</span> <span>{{ username }}</span>
        </v-list-item>
      </template>

      <v-divider :thickness="2"></v-divider>

      <v-list class="text-left" density="compact" nav>
        <v-list-item class="text-h6" prepend-icon="mdi-home" :to="{ path: '/complaints' }" title="Жалобы"></v-list-item>
        <v-list-item v-if="this.role_name==='Администратор'" class="text-h6" prepend-icon="mdi-account-cog" :to="{ path: '/admin' }"
          @click="$router.push('/admin')" title="Админ Панель"></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-btn block @click="logout" class="text-none text-subtitle-1" color="white" variant="flat">
          Logout
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-card title="Таблица жалоб">
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="complaints" :search="search" @click:row="openDialog"
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
  </v-layout>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: sessionStorage.getItem('name'),
      username: sessionStorage.getItem('username'),
      role_name: sessionStorage.getItem('role_name'),
      delete_loader:false,
      search: "",
      headers: [
        { align: "start", key: "client_fullname", sortable: true, title: "Имя клиента" },
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

  methods: {
    logout() {
      sessionStorage.clear();
      this.$store.dispatch('resetStore');
      this.$router.push('/login');
    },
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
        this.getComplaints();
        this.delete_loader=false;
        this.dialog=false;
      }
    },

    updateStatus() {
      this.dialog = false;
      this.selectedComplaint_id=null;
    },
    async getComplaints() {
      try {
        const { data } = await axios.get("https://complaint-backend-drab.vercel.app/complaint");
        this.complaints = data;
      } catch (error) {
        console.error("Error fetching complaints:", error);
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
  },
  watch:{
    comlaint_id(){
      this.selectedComplaint = this.complaints.find(item => item.id = this.complaint_id)
    }
  },

  mounted() {
    this.getComplaints();
  },
};
</script>
<style scoped>
p {
  font-size: 20px;
}
</style>