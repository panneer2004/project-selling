import axios from "axios";

const API_URL = "http://project-selling-backend.onrender.com/api/projects";

const createProject = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getProjects = () => {
  return axios.get(API_URL);
};

const updateStatus = (id, status) => {
  return axios.put(`${API_URL}/${id}`, { status });
};

const deleteProject = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  createProject,
  getProjects,
  updateStatus,
  deleteProject,
};
