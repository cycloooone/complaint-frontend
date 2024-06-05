<template>
  <v-navigation-drawer :width="300" permanent>
    <v-divider :thickness="2"></v-divider>
    <template v-slot:prepend >
          <v-list-item
          class="pb-4"
            lines="two"
            :prepend-avatar="image_ava"
            :subtitle="role_name"
            :title="name+' '+username"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

    <v-list class="text-left" density="compact" nav>
      <v-list-item v-if="role_name=='Администратор'" class="text-h6" prepend-icon="mdi-home" :to="{ path: '/complaints' }" title="Жалобы"></v-list-item>
      <v-list-item v-if="role_name=='Администратор'" class="text-h6" prepend-icon="mdi-account-cog" :to="{ path: '/admin' }" title="Админ Панель"></v-list-item>
      <v-list-item v-if="role_name=='Администратор'" class="text-h6" prepend-icon="mdi-file-chart" :to="{ path: '/news' }" title="Статистика жалоб"></v-list-item>
      <v-list-item v-if="role_name=='Мэнеджер по продуктам'" class="text-h6" prepend-icon="mdi-file-chart" :to="{ path: '/' }" title="Жалобы по еде"></v-list-item>
      <v-list-item v-if="role_name=='Мэнеджер по обслуживанию'" class="text-h6" prepend-icon="mdi-file-chart" :to="{ path: '/profile' }" title="Жалобы по персоналу"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-btn block @click="logout" class="text-none text-subtitle-1" color="white" variant="flat">Logout</v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      name: sessionStorage.getItem('name'),
      username: sessionStorage.getItem('username'),
      role_name: sessionStorage.getItem('role_name')
    };
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$store.dispatch('resetStore');
      this.$router.push('/login');
    }
  },
  computed:{
    image_ava(){
      let s;
      this.role_name=='Администратор'?s='https://randomuser.me/api/portraits/lego/5.jpg':this.role_name=='Мэнеджер по продуктам'?s='https://randomuser.me/api/portraits/lego/8.jpg':s='https://randomuser.me/api/portraits/lego/1.jpg';
      return s;
    }
  }
};
</script>

<style scoped>
/* your component-specific styles go here */
</style>
