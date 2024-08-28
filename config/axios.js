import axios from "axios";

axios.defaults.baseURL = "http://10.99.100.105/demo/ServiceDemo.asmx/";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export default axios;
