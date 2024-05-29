<template>
    <v-navigation-drawer :width="300">
      <v-divider :thickness="2"></v-divider>
      <template v-slot:prepend>
        <v-list-item
          lines="two"
        ><span>{{ role_name }}</span> <span>{{ this.name }}</span> <span>{{ this.username }}</span>
        
    </v-list-item>
      </template>
      <v-list class="text-left" density="compact" nav>
        <v-list-item class="text-h6" prepend-icon="mdi-home" :to="{path: '/complaints'}" title="Жалобы"></v-list-item>
        <v-list-item class="text-h6" prepend-icon="mdi-account-cog" :to="{path: '/admin'}" @click="$router.push('/admin')" title="Админ Панель"></v-list-item>
      </v-list>

      <template v-slot:append>
            <v-btn
            block
          @click="logout"
          class="text-none text-subtitle-1"
          color="white"
          variant="flat">Logout</v-btn>
        </template>


    </v-navigation-drawer>
  </template>
  
  <script>

export default {
  data() {
    return {
      name: sessionStorage.getItem('name'),
      username: sessionStorage.getItem('username'),
      role_name: sessionStorage.getItem('role_name'),
    };
  },
  methods:{
    logout() {
        sessionStorage.clear();
        this.$store.dispatch('resetStore');
        this.$router.push('/login');
      },

  },
  computed:{
    
  }
};

  
  
  </script>
  
  <style scoped>
  /* your component-specific styles go here */
  
  </style>
  