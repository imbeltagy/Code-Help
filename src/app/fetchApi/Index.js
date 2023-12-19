import axios from "axios";

export default async function fetchApi(route, method, body) {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const rootUrl = "http://127.0.0.1:5000";
    const response =
      method == "GET"
        ? await axios.get(`${rootUrl}/${route}`)
        : method == "POST"
        ? await axios.post(`${rootUrl}/${route}`, body, { headers })
        : method == "PUT"
        ? await axios.put(`${rootUrl}/${route}`, body, { headers })
        : method == "PATCH" && (await axios.patch(`${rootUrl}/${route}`, body, { headers }));

    // Return the response data if the request was successful
    return { success: true, data: response.data };
  } catch (err) {
    // Handle errors if the request fails
    if (err.response) {
      // The request was made and the server responded with a status code
      const message = err.response.data.error || err.response.data.message;
      return { success: false, message };
    } else if (err.request) {
      // The request was made but no response was received
      return { success: false, message: "Please try after a few minutes. If it continues pleae contact us" };
    } else {
      // Something happened in setting up the request that triggered an error
      return {
        success: false,
        message: "Error occurred while sending the request, please check your connection and try again",
      };
    }
  }
}
