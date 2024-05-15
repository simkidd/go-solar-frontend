import { TOKEN_NAME } from "@/utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL;

const TOKEN = Cookies.get(TOKEN_NAME);

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}` || "",
  },
});
