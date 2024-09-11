import React, { useState } from "react";
import "./Registration.css";
import Regd_image from "../../assets/Regd_image.png";
import profile_image from "../../assets/profileImgLogo.png";
import tokenService from "../../services/token.service";
function Registration() {
  const [profileImg, setProfileImg] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    location: "",
    landmark: "",
    userType: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProfileImgChange = (e) => {
    setProfileImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleProfileImgRemove = () => {
    setProfileImg(null);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First Name is required";
    if (!formData.lastName) formErrors.lastName = "Last Name is required";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      formErrors.phoneNumber = "Phone Number must be 10 digits";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Email is invalid";
    if (!formData.termsAccepted)
      formErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  // Retrieve the user data
const userData = tokenService.getUser();

if (userData) {
  console.log("User Data:", userData);
} else {
  console.log("No user is logged in.");
}

  return (
    <div className="registrationContainer">
      <div className="formSection">
        <div className="info">
          <div className="leftInfo">Input your information</div>
          <div className="rightInfo">
            We need you to help us with some basic information for your account
            creation. Here are our <a className="tac"> terms and conditions</a>. Please read them
            carefully.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profilePhotoSection">
            <label htmlFor="profileImgUpload" className="profileLabel">
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="profileImage" />
              ) : (
                <div className="profilePlaceholder">
                  <img
                    src={profile_image}
                    alt="Default Profile"
                    className="defaultProfileIcon"
                  />
                  <button
                    type="button"
                    className="uploadProfileImg"
                    onClick={() =>
                      document.getElementById("profileImgUpload").click()
                    }
                  >
                    Upload Profile Picture
                  </button>
                </div>
              )}
            </label>
            <input
              type="file"
              id="profileImgUpload"
              style={{ display: "none" }}
              onChange={handleProfileImgChange}
              accept="image/*"
            />
            {profileImg && (
              <button
                type="button"
                className="removeProfileImg"
                onClick={handleProfileImgRemove}
              >
                Remove
              </button>
            )}
          </div>

          <div className="flexContainer">
            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
              <div className="inputGroup">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
              <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="inputGroup">
                <label htmlFor="landmark">Landmark</label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* for Donors */}
          <div className="userTypeSection">
            <label>Individual / Food Business</label>
            <div className="userTypeButtons">
              <button
                type="button"
                className={formData.userType === "Individual" ? "selected" : ""}
                onClick={() =>
                  setFormData({ ...formData, userType: "Individual" })
                }
              >
                Individual
              </button>
              <button
                type="button"
                className={
                  formData.userType === "Food Business" ? "selected" : ""
                }
                onClick={() =>
                  setFormData({ ...formData, userType: "Food Business" })
                }
              >
                Food Business
              </button>
            </div>
          </div>

          <div className="termsAndProceed">
            <div className="termsCheckbox">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
              />
              <label htmlFor="termsAccepted">Accept terms and conditions</label>
              {errors.termsAccepted && (
                <span className="error">{errors.termsAccepted}</span>
              )}
            </div>
            <button type="submit" className="proceedButton">
              Proceed
            </button>
          </div>
        </form>
      </div>

      <div className="imageSection">
        <img src={Regd_image} alt="Registration" />
      </div>
    </div>
  );
}

export default Registration;
