<template>
    <div>
      <h2>Housekeeper List</h2>
      <button @click="addHousekeeper()">Add</button>
      <table style="width: 100%;">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="housekeeper in housekeepers" :key="housekeeper.id">
            <td>{{ housekeeper.id }}</td>
            <td>{{ housekeeper.firstname }}</td>
            <td>{{ housekeeper.lastname }}</td>
            <td>{{ housekeeper.phone }}</td>
            <td>
              <button @click="editHousekeeper(housekeeper)">Edit</button>
              <button @click="deleteHousekeeper(housekeeper.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import {ApiService} from '../services/api'
  
  export default {
    data() {
      return {
        housekeepers: [] // Initialize this array with your housekeepers data from the API
      };
    },
    methods: {
      editHousekeeper(housekeeper) {
        this.$router.push(`/edit/${housekeeper.id}`);
      },
      addHousekeeper() {
        this.$router.push("/add")
      },
      deleteHousekeeper(id) {
        // Handle the delete action (e.g., show a confirmation dialog and send a delete request to the API)
        // After deleting, you may want to refresh the housekeepers list
        if (confirm('Are you sure you want to delete this housekeeper?')) {
          ApiService.deleteHousekeeper(id)
            .then(() => {
              // Refresh the housekeepers list by fetching it again
              this.fetchHousekeepers();
            })
            .catch((error) => {
              console.error('Error deleting housekeeper:', error);
            });
        }
      },
      fetchHousekeepers() {
        ApiService.getAllHousekeepers()
          .then((response) => {
            this.housekeepers = response.data.data;
          })
          .catch((error) => {
            console.error('Error fetching housekeepers:', error);
          });
      }
    },
    created() {
      // Fetch the list of housekeepers from your API and populate the housekeepers array
      this.fetchHousekeepers();
    }
  };
  </script>
  