import React, { useState, useEffect } from "react";
// import "../RegistrationForm/EnhancedProfile.css";
import "./Profile.css"
import profile_image from "../../assets/profileImgLogo.png";
import Regd_image from "../../assets/Regd_image.png";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import instance from "../../../env";

function Profile() {
  const [profileImg, setProfileImg] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileImgChange = (e) => {
    let image = e.target.files[0];
    if (parseInt(image.size / 1024) <= 500) {
      setProfileImg(URL.createObjectURL(image));
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setFormData({
          ...formData,
          userImage: reader.result,
        });
      };
    } else {
      toast.error("Choose an image with size less than 500 KB.");
    }
  };

  const handleProfileImgRemove = () => {
    setProfileImg(null);
    setFormData({ ...formData, userImage: null });
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get(api.VIEW_PROFILE.url);
      const { name, phoneNumber, email, url } = res.data.public_user[0];
      const [firstName, lastName] = name.split(" ");

      setFormData({
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      if (url) {
        setProfileImg(`${instance().baseURL}${url}`);
      } else {
        setProfileImg(null);
      }
    } catch (error) {
      toast.error("Error fetching profile data.");
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First Name is required";
    if (!formData.lastName) formErrors.lastName = "Last Name is required";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Email is invalid";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axiosInstance.put(api.UPDATE_PROFILE.url, formData);
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Error updating profile.");
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-form-section">
        <div className="profile-info">
          <h2 className="profile-header">Edit Your Information</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profile-photo-section">
            <label htmlFor="profileImgUpload" className="profile-image-label">
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-placeholder">
                  <img
                    src={profile_image}
                    alt="Default Profile"
                    className="default-profile-icon"
                  />
                  <button
                    type="button"
                    className="upload-button"
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
                className="remove-button"
                onClick={handleProfileImgRemove}
              >
                Remove
              </button>
            )}
          </div>

          <div className="profile-flex-container">
            <div className="profile-input-row">
              <div className="profile-input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <span className="profile-error">{errors.firstName}</span>
                )}
              </div>
              <div className="profile-input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <span className="profile-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="profile-input-row">
              <div className="profile-input-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <span className="profile-error">{errors.phoneNumber}</span>
                )}
              </div>
              <div className="profile-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>
          </div>

          <button type="submit" className="profile-submit-button">
            Update Profile
          </button>
        </form>
      </div>
      <img src={Regd_image} alt="Registration" className="registration-image" />
    </div>
  );
}

export default Profile;
