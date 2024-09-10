import React, { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function LogInSignUp() {
  const [userType, setUserType] = useState("Donor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  // Handles the radio button change for user type
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // Handles the phone number input change
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Handles OTP input change
  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  // Simulates sending OTP
  const handleGetOtp = () => {
    if (phoneNumber) {
      setOtpSent(true);
      setTimer(60);
    }
  };

  // Handles OTP verification (you can add real verification logic here)
  const handleVerifyOtp = () => {
    alert(`Verifying OTP: ${otp}`);
  };

  // Timer effect for OTP expiration countdown
  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setOtpSent(false);
      setOtp("");
    }
  }, [otpSent, timer]);

  return (
    <div className="logInSignUpContainer">
    <div className="log_p">
      <div className="headers_P">
        <h1>Login / SignUp to Your Account</h1>
        <p>
          A simple act of sharing food can have a profound impact on someone's
          life.
        </p>
        <div className="logInType">
          <h3>Login/SignUp as a </h3>
          <div className="radiobutton">
            <div className="insideRadioButton">
              <input
                type="radio"
                id="donor"
                value="Donor"
                checked={userType === "Donor"}
                onChange={handleUserTypeChange}
                className={userType === "Donor" ? "greenText" : ""}
              />
              <label
                htmlFor="donor"
                className={userType === "Donor" ? "greenText" : ""}
              >
                Donor
              </label>
            </div>
            <div className="insideRadioButton">
              <input
                type="radio"
                id="charity"
                value="Charity"
                checked={userType === "Charity"}
                onChange={handleUserTypeChange}
                className={userType === "charity" ? "greenText" : ""}
              />
              <label
                htmlFor="charity"
                className={userType === "Charity" ? "greenText" : ""}
              >
                Charity
              </label>
            </div>
          </div>
        </div>

        <div className="inputFieldButton">
          {/* Phone Number Input or OTP Input */}
          {!otpSent ? (
            <div className="phoneNumberSection">
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              <button className="button_verify_OTP" onClick={handleGetOtp}>
                <p>Get OTP</p>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ) : (
            <div className="otpSection">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
              />
              <button className="button_verify_OTP" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
              <p>OTP expires in: {timer} seconds</p>
            </div>
          )}

          {/* Social Media Sign Up */}
          <div className="socialSignUp">
            <button className="googleSignUp">Sign up with Google</button>
            <button className="facebookSignUp">Sign up with Facebook</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LogInSignUp;
