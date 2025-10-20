// lib/axios.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // se usa para HttpOnly cookies
  headers: { "Content-Type": "application/json" },
})
