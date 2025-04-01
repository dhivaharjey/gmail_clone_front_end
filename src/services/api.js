import axios from "axios";

const API_URL = import.meta.env.VITE_BACK_END_URL;
// console.log(process.env.REACT_APP_USERNAME);
const API_GMAIL = async (urlObject, payload, type) => {
  return await axios({
    method: urlObject.method,
    url: `${API_URL}/${urlObject.endpoint}${type ? `/${type}` : ""}`,
    data: payload,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export default API_GMAIL;
