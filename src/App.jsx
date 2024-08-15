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
        <Route path="/" element={<Navigate to="/heyreplai" replace />} />
        <Route path="/:variable" element={<PhoneInputForm />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

function PhoneInputForm() {
  const { variable } = useParams();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (!variable) {
      navigate("/heyreplai", { replace: true });
    }
  }, [variable, navigate]);

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
        `https://api.heyreplai.com/?to=${phoneNumber}&prompt=${variable}`
      );

      if (response.status === 200) {
        toast.success("Call dialed successfully!");
      }
    } catch (error) {
      toast.error("Failed to dial the call.");
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
