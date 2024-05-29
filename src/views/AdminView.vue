
    


<template>
  
  <v-layout>
    <NavbarComp></NavbarComp>
    <v-main>
  <v-card>
  

    <v-card-text>
      <v-btn block color="blue" @click.stop="openAddUserDialog">
        Добавить пользователя
      </v-btn>
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="USERS"
      class="elevation-2"
    >
      <template v-slot:[`item.role_name`]="{ item }">
        <v-chip :color="getColor(item.role_name)" dark>{{ item.role_name }}</v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon :loading="edit_delete_loader" size="small" class="me-2" @click="editUser(item)">mdi-pencil</v-icon>
        <v-icon :loading="edit_delete_loader" size="small" @click="confirmDeleteUser(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-card-text>
 
  </v-card>
  </v-main>
  </v-layout>
  


    
  
  

    <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card :disabled="edit_delete_loader">
        <v-card-title class="text-h5 mt-5 ml-3">Редактировать</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedUser.username" label="Username" style="opacity: 70%;" readonly outlined
    ></v-text-field>
          <v-select
            v-model="editedUser.role_name"
            :items="['Администратор', 'Мэнеджер']"
            label="Role"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="cancelEditUser">Cancel</v-btn>
          <v-btn :loading="edit_delete_loader" color="blue-darken-1" variant="text" @click="saveUser">Save</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete User Dialog -->
    <v-dialog v-model="deleteConfirmationDialog" max-width="500px">
    <v-card :disabled="edit_delete_loader">
      <v-card-text class="text-h5">Вы уверены что хотите удалить пользователя?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="edit_delete_loader" color="blue-darken-1" variant="text" @click="cancelDeleteUser">Отмена</v-btn>
        <v-btn color="red" @click="deleteUser">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add User Dialog -->

  <v-dialog v-model="addUserDialog" max-width="500px">
    <v-card :disabled="loader">
      <v-card-title class="text-h5">Добавить пользователя</v-card-title>
      <v-card-text>
          <v-text-field v-model="newUser.name" label="Имя"></v-text-field>

          <v-text-field v-model="newUser.surname" label="Фамилия"></v-text-field>

          <v-text-field v-model="newUser.username" label="Никнейм"></v-text-field>
          <v-text-field v-model="newUser.password" label="Пароль"></v-text-field>
          <v-select
              v-model="newUser.role_name"
              :items="['Администратор', 'Мэнеджер']"
              label="Роль"
          ></v-select>
        
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="cancelAddUser">Cancel</v-btn>
        <v-btn :loading="loader" color="green" @click="addUser">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  

</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavbarComp from "@/components/NavbarComp.vue";
import axios from "axios";
export default {
  components:{
    NavbarComp
  },
  data() {
    return {
      edit_delete_loader: false,
      loader:false,
      itemsPerPage: 10,
      headers: [
        { title: "", align: "center", key: "image", sortable: false},
        { title: "Username", align: "center", sortable: false, key: "username", class: "blue",},
        { title: "Name", align: "center", sortable: false, key: "name", class: "blue",},
        { title: "Surname", align: "center", sortable: false, key: "surname", class: "blue",},  
        { title: "Role", align: "center", key: "role_name", sortable: false},
        { text: "Actions", value: "actions", sortable: false, },
      ],
      editDialog: false, 
      editedUser: {
        username: "",
        role_name: "",
      },
      flag1: true,
      deleteConfirmationDialog: false,
      addUserDialog: false,   

      newUser: {
        username: "",
        role_name: "",
        name: "",
        surname: "",
        password: "",
    },

    userToDelete: null
    };
  },

  computed: {
    ...mapGetters(["USERS"]),
  },
  created() {
      this.GET_USERS();
      
  },
  methods: {
    ...mapActions(["GET_USERS"]),
    getColor(role_name) {
      if (role_name == "admin") {
        return "light-green-darken-3";
      } else if (role_name == "user") {
        return "amber";
      } else if (role_name == "author") {
        return "pink";
      } else if (role_name == "leader"){
        return "purple-darken-4"
      }
    },
    handleFileChange(event){
          const file = event.target.files[0];
          this.newUser.image_file = file;

    },
    editUser(user) {
      this.editedUser = { ...user };
      this.editDialog = true;
    },
    cancelEditUser() {
      this.editDialog = false;
    },
    async saveUser() {
      // Implement user save/update logic here
      // You can call an action to save/update the user in the Vuex store
      if(this.editedUser.username && this.editedUser.role_name ){
          try{
              this.edit_delete_loader=true;
              await axios.put(`https://complaint-backend-drab.vercel.app/updateUserRole/`, { 
                role_name: this.editedUser.role_name,
                username: this.editedUser.username,
              }
              );
          } catch(e){
              console.log(e)
          } finally{
            this.edit_delete_loader=false;
              this.GET_USERS();
          }
      }
      
      this.editDialog = false;
    },
    confirmDeleteUser(user) {
    this.userToDelete = user;
    this.deleteConfirmationDialog = true;
  },
  cancelDeleteUser() {
    this.deleteConfirmationDialog = false;
  },
  async deleteUser() {

    if (this.userToDelete) {
      try{
          this.edit_delete_loader=true;
          await axios.delete(`https://complaint-backend-drab.vercel.app/users/${this.userToDelete.id}`) 
      } catch(e){
          console.log(e)
      } finally{
          this.userToDelete = null;
          this.deleteConfirmationDialog = false;
          this.GET_USERS();
          this.edit_delete_loader=false;
      }
      
    }
  },

  openAddUserDialog() {
    this.newUser = {
      username: "",
      role_name: "",
      password: "",
    };
    this.addUserDialog = true;
  },
  cancelAddUser() {
    this.newUser = {
      username: "",
      role_name: "",
    };
    this.addUserDialog = false;
  },
  async addUser() {


      if (this.newUser.username && this.newUser.role_name && this.newUser.password) {
      
      try {
          this.loader=true;
          let bind = {
              "username": this.newUser.username,
              "password": this.newUser.password,
              "name": this.newUser.name,
              "surname": this.newUser.surname,
              "role_name": this.newUser.role_name,
          }
          await axios.post(`https://complaint-backend-drab.vercel.app/register`, bind)
          .then(() => {
          console.log('Registration successful');
      })
      .catch(error => {
          console.error('Error:', error);
      });
      }catch(err){
          console.log(err)
      }
      finally{
        this.GET_USERS()
          this.newUser = {
        username: "",
        role_name: "",
        password: "",
      };
      this.addUserDialog = false;
      this.loader=false;
      }
      
      
    }



  

  },
  },
};
</script>

<style scoped>
</style>