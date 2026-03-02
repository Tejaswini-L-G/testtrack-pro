import axios from "axios";

const API = "http://localhost:5000/api/executions";

export const startExecution = (data) =>
  axios.post(`${API}/start`, data);

export const saveStep = (data) =>
  axios.post(`${API}/step`, data);

export const completeExecution = (data) =>
  axios.post(`${API}/complete`, data);

export const getExecution = (id) =>
  axios.get(`${API}/${id}`);