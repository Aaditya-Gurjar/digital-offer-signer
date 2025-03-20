// import React from "react";

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const App = () => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     userEmail: "",
//     position: "",
//     salary: "",
//   });

//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/offers/create",
//         formData
//       );
//       setMessage("Offer letter sent successfully! Check your email.");
//       navigate(`/sign-offer?email=${formData.userEmail}`);
//     } catch (error) {
//       console.error("Error sending offer:", error);
//       setMessage("Failed to send offer letter.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>Generate Offer Letter</h2>
//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "inline-block", textAlign: "left" }}>
//         <label>Name:</label>
//         <input
//           type="text"
//           name="userName"
//           value={formData.userName}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>Email:</label>
//         <input
//           type="email"
//           name="userEmail"
//           value={formData.userEmail}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>Position:</label>
//         <input
//           type="text"
//           name="position"
//           value={formData.position}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>Salary:</label>
//         <input
//           type="text"
//           name="salary"
//           value={formData.salary}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <button type="submit">Generate Offer</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { baseUrl } from "../utils/config";

const App = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    position: "",
    salary: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}api/offers/create`, formData);
      setMessage("Offer letter sent successfully! Check your email.");
      navigate(`/sign-offer?email=${formData.userEmail}`);
    } catch (error) {
      console.error("Error sending offer:", error);
      setMessage("Failed to send offer letter.");
    }
  };

  return (
    <div className="container">
      <h2>Generate Offer Letter</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Salary:</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Generate Offer</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default App;
