import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export default axios;
