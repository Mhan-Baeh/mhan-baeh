<template>
    <div>
      <h2>Housekeeper Details</h2>
      <div>
        <strong>ID:</strong> {{ housekeeper.id }}
      </div>
      <div>
        <strong>First Name:</strong> {{ housekeeper.firstname }}
      </div>
      <div>
        <strong>Last Name:</strong> {{ housekeeper.lastname }}
      </div>
      <div>
        <strong>Phone:</strong> {{ housekeeper.phone }}
      </div>
      <router-link to="/">Back to Housekeeper List</router-link>
    </div>
  </template>
  
  <script>
  import { ApiService } from '@/services/api'; // Import your ApiService
  
  export default {
    data() {
      return {
        housekeeper: {
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
            this.housekeeper = response.data.data;
          })
          .catch((error) => {
            console.error('Error fetching housekeeper details:', error);
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
  