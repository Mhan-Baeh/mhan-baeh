<template>
    <div>
      <h2>{{ mode === 'add' ? 'Add Housekeeper' : 'Edit Housekeeper' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="firstname">First Name:</label>
          <input type="text" id="firstname" v-model="housekeeper.firstname" required />
        </div>
        <div>
          <label for="lastname">Last Name:</label>
          <input type="text" id="lastname" v-model="housekeeper.lastname" required />
        </div>
        <div>
          <label for="phone">Phone:</label>
          <input type="text" id="phone" v-model="housekeeper.phone" required />
        </div>
        <div>
          <button type="submit">{{ mode === 'add' ? 'Add' : 'Save' }}</button>
          <router-link :to="mode === 'add' ? '/' : `/housekeeper/${housekeeper.id}`">Cancel</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ApiService } from '@/services/api'; // Import your ApiService
  
  export default {
    data() {
      return {
        housekeeper: {
          firstname: '',
          lastname: '',
          phone: ''
        },
        mode: 'add' // 'add' or 'edit' mode
      };
    },
    methods: {
      async handleSubmit() {
        try {
          if (this.mode === 'add') {
            // Handle the "Add" action (e.g., send a POST request to the API)
            await ApiService.createHousekeeper(this.housekeeper);
            // After successfully adding, you may want to navigate to the housekeeper list
            this.$router.push('/housekeepers');
          } else {
            // Handle the "Save" action (e.g., send a PUT request to the API)
            await ApiService.updateHousekeeper(this.housekeeper.id, this.housekeeper);
            // After successfully saving, you may want to navigate to the housekeeper details page
            this.$router.push(`/housekeeper/${this.housekeeper.id}`);
          }
        } catch (error) {
          // Handle errors (e.g., display an error message)
          console.error('Error:', error);
        }
      }
    },
    created() {
      // If in "edit" mode, fetch the housekeeper details from your API and populate the housekeeper object
      if (this.mode === 'edit') {
        const housekeeperId = this.$route.params.id;
        ApiService.getHousekeeper(housekeeperId)
          .then((response) => {
            this.housekeeper = response.data.data;
          })
          .catch((error) => {
            // Handle errors (e.g., display an error message)
            console.error('Error:', error);
          });
      }
    }
  };
  </script>
  