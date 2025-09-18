import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AnimatedBackground from "./AnimatedBackground";
import Header from "./Header";
import { countryCodes } from "../utils/countryCodes";
import { API_URL } from '../utils/api';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    invitationCode: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    withdrawalPassword: "",
    verificationCode: "", // ✅ new field for OTP
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
    withdrawalPassword: false,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setFormData((prev) => ({ ...prev, invitationCode: codeFromUrl }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (
      !formData.invitationCode ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.withdrawalPassword ||
      !formData.verificationCode // ✅ must enter OTP
    ) {
      toast.error("All fields are required, including verification code");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.withdrawalPassword.length < 6) {
      toast.error("Withdrawal password must be at least 6 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    return true;
  };

  // ✅ API 1: Send Code
  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      return toast.error("Please enter email first");
    }
    setIsSendingCode(true);
    try {
      const response = await axios.post(
        `${API_URL}/send-code`,
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  // ✅ API 2: Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        invitationCode: formData.invitationCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.countryCode + formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // 👈 add this
        withdrawalPassword: formData.withdrawalPassword,
        verificationCode: formData.verificationCode,
      };

      console.log("Submitting data:", submitData);

      const response = await axios.post(
        `${API_URL}/register`,
        submitData
      );

      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (
        errorMessage &&
        errorMessage.includes("E11000") &&
        errorMessage.includes("email")
      ) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error(errorMessage || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AnimatedBackground />
      <Header />

      <div
        style={{
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2
              style={{ color: "#333", margin: "0 0 10px 0", fontSize: "28px" }}
            >
              Join HRP Farm
            </h2>
            <p style={{ color: "#666", margin: 0, fontSize: "16px" }}>
              Start your investment journey
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Invitation Code */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                name="invitationCode"
                placeholder="Investor Invitation Code"
                value={formData.invitationCode}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* First + Last Name */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ ...inputStyle, width: "48%" }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ ...inputStyle, width: "48%" }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Send Code Button */}
            <div
              style={{
                marginBottom: "20px",
                alignItems: "end",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                type="button"
                onClick={handleSend}
                disabled={isSendingCode}
                style={{
                  width: "40%",
                  padding: "15px",
                  background: isSendingCode ? "#ccc" :
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: isSendingCode ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isSendingCode && (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                )}
                {isSendingCode ? "Sending..." : "Send Otp"}
              </button>
            </div>

            {/* OTP / Verification Code */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                name="verificationCode"
                placeholder="Enter your code"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                style={{ ...inputStyle, width: "120px" }}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} {country.country}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#667eea",
                  fontWeight: "bold",
                }}
              >
                {showPassword.password ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#667eea",
                  fontWeight: "bold",
                }}
              >
                {showPassword.confirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Withdrawal Password */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword.withdrawalPassword ? "text" : "password"}
                  name="withdrawalPassword"
                  placeholder="Withdrawal Password"
                  value={formData.withdrawalPassword}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("withdrawalPassword")}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#667eea",
                    fontWeight: "bold",
                  }}
                >
                  {showPassword.withdrawalPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: "5px 0 0 0",
                  fontStyle: "italic",
                }}
              >
                * Different from login password - more secure for withdrawals
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "15px",
                background: isLoading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "20px",
                transition: "all 0.3s ease",
                boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              {isLoading && (
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
              )}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </form>

          <p style={{ textAlign: "center", marginTop: "25px", color: "#666" }}>
            Already have an account?
            <Link
              to="/login"
              style={{
                color: "#667eea",
                fontWeight: "bold",
                textDecoration: "none",
                marginLeft: "5px",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
