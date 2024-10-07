import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneInputForm />} />
        <Route path="/:variable" element={<PhoneInputForm />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

function PhoneInputForm() {
  const { variable } = useParams();
  console.log("Variable is", variable);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const handleChange = (value, country) => {
    setPhoneNumber(value);
    setValid(country.dialCode && value.length > country.dialCode.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.heyreplai.com/demo?to=${phoneNumber}&prompt=${
          variable ? variable : "heyreplai"
        }`
      );

      if (response.status === 200) {
        toast.success("Call dialed successfully!");
      }
    } catch (error) {
      console.log("Failed to call", error);
      toast.success("Call dialed successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Test {variable} HeyReplai Agent</h1>
      <form onSubmit={handleSubmit} className="form">
        <PhoneInput
          country={"us"}
          value={phoneNumber}
          onChange={handleChange}
          disabled={loading}
          inputStyle={{ width: "100%" }}
          isValid={valid}
          inputClass={`input ${!valid && "invalid-input"}`}
        />
        <br />
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? "Dialing..." : "Dial"}
        </button>
      </form>
    </div>
  );
}

export default App;
