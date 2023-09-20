import axios from 'axios';

const API_BASE_URL = 'http://localhost:18000/api/v1'; // Replace with your API base URL

export const ApiService = {
  getAllHousekeepers() {
    return axios.get(`${API_BASE_URL}/housekeeper`);
  },
  getHousekeeper(id) {
    return axios.get(`${API_BASE_URL}/housekeeper/${id}`);
  },
  createHousekeeper(data) {
    return axios.post(`${API_BASE_URL}/housekeeper`, data);
  },
  updateHousekeeper(id, firstname, lastname, phone) {
    return axios.put(`${API_BASE_URL}/housekeeper/${id}`, {
      firstname: firstname,
      lastname: lastname,
      phone: phone
    });
  },
  deleteHousekeeper(id) {
    return axios.delete(`${API_BASE_URL}/housekeeper/${id}`);
  },
};
