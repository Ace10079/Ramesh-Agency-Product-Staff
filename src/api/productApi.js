import axios from "axios";


const API = axios.create({
baseURL: "https://ramesh-agency-product-backend.onrender.com/api/products",
});


export const fetchProducts = () => API.get("/list");