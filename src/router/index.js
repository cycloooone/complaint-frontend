import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginPage.vue'
import ProfileView from '../views/ProfileView.vue'

import NewsView from '../views/NewsView.vue'

import ChatView from '../views/ChatView'
import ComplaintView from '@/views/ComplaintView.vue'
import LeadView from '../views/LeadView'
import DeskView from '../views/DeskView'
import { isAuthenticated, getUserRole } from '../services/authService.js';
import previewPage from "@/views/previewPage.vue";
import formView from "@/views/FormView.vue";
import NotFound from "@/views/NotFound.vue";
import AdminView from "@/views/AdminView.vue";


const routes = [
  { path: '/:pathMatch(.*)*', component: NotFound },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requireAuth: true, requireRole: 'Администратор' }
  },
  {
    path: '/news',
    name: 'news',
    component: NewsView,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
  },
  {
    path: '/',
    name: 'desks',
    component: LeadView,
  },
  {
    path: '/desks/:desk_id',
    name: 'desk-details',
    component: DeskView,
    props: route => ({
      desk_id: route.params.desk_id,
      desk_image: route.params.desk_image,
    }),
  },
  {
    path: '/preview',
    name: 'preview',
    component: previewPage,
  },
  {
    path: '/form',
    name: 'form',
    component: formView,
  },


  {
    path: '/complaints',
    name: 'complaints',
    component: ComplaintView,
    meta: {requireAuth:true}
  }
  
  
  
];




const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !isAuthenticated()) {
    next('/login');
  } else if (to.meta.requireRole && getUserRole() !== to.meta.requireRole) {
    next('/');
  } else {
    next();
  }
});
  

export default router
