/* eslint-disable*/

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    console.log(res);
  } catch (err) {
    if (err.response) {
      console.log("Response error:", err.response.data);
    } else if (err.request) {
      console.log("No response received:", err.request);
    } else {
      console.log("Request setup error:", err.message);
    }
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
