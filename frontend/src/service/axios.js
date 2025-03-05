import axios from "axios";

const token = localStorage.getItem('token')

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
    }
})

export default instance