require("dotenv").config();
const axios = require("axios");

const apiClient = axios.create({
  baseURL: "https://lereacteur-marvel-api.herokuapp.com",
  params: { apiKey: process.env.LEREACTEUR_MARVEL_API_KEY },
});

module.exports = apiClient;
