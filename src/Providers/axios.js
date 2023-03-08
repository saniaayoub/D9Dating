import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://designprosusa.com/the_night/api/',
});

export default instance;
