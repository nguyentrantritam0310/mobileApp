import axios from 'axios';

const api = axios.create({
//  baseURL: `${Config.API_URL}/api`,

baseURL: `http://160.250.132.226/api`,
});


export default api;