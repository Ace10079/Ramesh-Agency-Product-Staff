import axios from "axios";


const API = axios.create({
baseURL: "https://ramesh-agency-product-backend.onrender.com/api/products",
  //  http://localhost:5000/
  //https://ramesh-agency-product-backend.onrender.com

});


export const fetchProducts = () => API.get("/list");