<template>
    <div>
      <h2>Edit Housekeeper</h2>
      <form @submit.prevent="updateHousekeeper">
        <div>
          <label for="firstname">First Name:</label>
          <input type="text" id="firstname" v-model="editedHousekeeper.firstname" />
        </div>
        <div>
          <label for="lastname">Last Name:</label>
          <input type="text" id="lastname" v-model="editedHousekeeper.lastname" />
        </div>
        <div>
          <label for="phone">Phone:</label>
          <input type="text" id="phone" v-model="editedHousekeeper.phone" />
        </div>
        <div>
          <button type="submit">Update</button>
          <router-link :to="'/housekeeper/' + editedHousekeeper.id">Cancel</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ApiService } from '@/services/api'; // Import your ApiService
  
  export default {
    data() {
      return {
        editedHousekeeper: {
          id: null,
          firstname: '',
          lastname: '',
          phone: ''
        }
      };
    },
    methods: {
      fetchHousekeeperDetails() {
        const housekeeperId = this.$route.params.id;
        ApiService.getHousekeeper(housekeeperId)
          .then((response) => {
            this.editedHousekeeper = response.data.data;
          })
          .catch((error) => {
            console.error('Error fetching housekeeper details:', error);
          });
      },
      updateHousekeeper() {
        ApiService.updateHousekeeper(this.editedHousekeeper.id, 
                                    this.editedHousekeeper.firstname,
                                    this.editedHousekeeper.lastname,
                                    this.editedHousekeeper.phone)
          .then(() => {
            this.$router.push('/housekeepers');
          })
          .catch((error) => {
            console.error('Error updating housekeeper:', error);
          });
      }
    },
    created() {
      // Fetch the housekeeper details when the component is created
      this.fetchHousekeeperDetails();
    }
  };
  </script>
  
  <style scoped>
  /* Add your view-specific styles here */
  </style>
  