import HomePage from '../views/HomePage.vue'
import HousekeeperList from '../components/HousekeeperList.vue'
import HousekeeperForm from '../components/HousekeeperForm.vue'
import HousekeeperDetail from '../components/HousekeeperDetail.vue'
import HousekeeperEdit from '../components/HousekeeperEdit.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Use createRouter and createWebHistory



const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/housekeepers',
    name: 'HousekeeperList',
    component: HousekeeperList
  },
  {
    path: '/add',
    name: 'AddHousekeeper',
    component: HousekeeperForm
  },
  {
    path: '/edit/:id',
    name: 'EditHousekeeper',
    component: HousekeeperEdit
  },
  {
    path: '/housekeeper/:id',
    name: 'HousekeeperDetail',
    component: HousekeeperDetail
  }
]

const router = createRouter({
  history: createWebHistory(""), // Use createWebHistory for browser history mode
  routes
});

export default router; 