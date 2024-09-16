import "./DonorDetails.css";
import Header from "../../common/Header";
import Donor_image from "../../assets/Donor_details_image.png";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const DonorDetails = () => {
    // Initialize state
    const [DonorType, setDonorType] = useState([]);
    const [getUnit, setgetUnit] = useState([]);
    const [DonorData, setDonorData] = useState({
        foodName: "",
        foodCategory: "",
        quantity: "",
        unit: "",
        expirationDate: "",
        imageData: "",
        address: {
            building: "",
            area: "",
            landmark: "",
            pincode: "",
            townCity: "",
            state: "",
            country: ""
        }
    });

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonorData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    // Function to handle address input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setDonorData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name]: value
            }
        }));
    };
    // handle Upload Image (in base 64) ------
    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0]
            // check the size of file
            if ((file.size / 1024) <= 450) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Image = reader.result;
                    console.log("image ", base64Image);
                    setDonorData({
                        ...DonorData, imageData: base64Image //Update imageData
                    });
                };
                reader.readAsDataURL(file)
            } else {
                alert("file size acceeds 450 KB.!")
            }
        }
    }

    // Get initial donor type and unit data
    async function GetDonorType() {
        try {
            let res = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url);
            setDonorType(res.data.foodType);
            setgetUnit(res.data.unitsData);
            console.log("Response of initial data", res);
        } catch (err) {
            console.log("Error getting initial data", err);
        }
    }
    // Auto suggestion of address based on pincode
    async function AutoSugestion(pincode) {
        try {
            let res = await axios.get(api.SEARCH_PLACE_BY_PINCODE.url + `${pincode}`);
            console.log("Response from pincode suggestion", res.data[0].PostOffice[0]);
            const postOfficeData = res.data[0].PostOffice[0];
            console.log("Pincode auto-suggestion response", postOfficeData);

            // Update address in DonorData
            setDonorData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    pincode: pincode,
                    townCity: postOfficeData.Division || postOfficeData.District,
                    state: postOfficeData.State,
                    country: postOfficeData.Country,
                    building: prevState.address.building, // Preserve manually entered values
                    area: prevState.address.area,
                    landmark: prevState.address.landmark
                }
            }));
        } catch (err) {
            console.log("Error in auto-suggestion", err);
        }
    }
    // Handle pincode input change
    const handlePincode = (e) => {
        const value = e.target.value;
        setDonorData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                pincode: value
            }
        }));
        if (value.length === 6) { // Assuming pincode length is 6
            AutoSugestion(value);
        }
    };

    // Fetch donor type on component mount
    useEffect(() => {
        GetDonorType();
        if (DonorData.address.pincode) {
            AutoSugestion(DonorData.address.pincode)
        }
    }, [DonorData.address.pincode]);

    // Post donor data to backend
    async function PostDonorData(e) {
        e.preventDefault()
        try {
            let res = await axiosInstance.post(api.ADD_FOOD_DONATION.url, {
                foodItemsArray: [
                    {
                        foodName: DonorData.foodName,
                        foodCategory: DonorData.foodCategory,
                        quantity: DonorData.quantity,
                        unit: DonorData.unit,
                        expirationDate: DonorData.expirationDate,
                        imageData: DonorData.imageData,
                        address: DonorData.address
                    }
                ]
            });
            console.log("Response of Donor Data", res);
        } catch (err) {
            console.log("Donor Response Error", err);
        }
    }

    // Validation --------------------
    const DonorValidation = (value) => {
        const err = {};
        if (!value.foodName) {
            err.foodName = "Please enter food name";
        }
        return err;
    }


    return (
        <div className="main_conatiner_donor_details">
            <Header />
            <div className="Child_container_donor_details">
                <div className="form_conainer">
                    <h1>Donation Details</h1>
                    <form className="form_conatiner_form" onSubmit={PostDonorData}>
                        <span className="input_text_conatiner">
                            <label>Food Name</label>
                            <input
                                type="text"
                                name="foodName"
                                placeholder="Enter Food Name"
                                value={DonorData.foodName}
                                onChange={handleChange}
                            />
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Food Type*</label>
                            <select
                                id="foodType"
                                name="foodCategory"
                                value={DonorData.foodCategory}
                                onChange={handleChange}
                            >
                                {DonorType?.length > 0 && DonorType.map((item, index) => (
                                    <option key={index} value={item.foodCategoryId}>
                                        {item.foodCategoryName}
                                    </option>
                                ))}
                            </select>
                        </span>

                        <span className="input_text_conatiner">
                            <label>Food Quantity</label>
                            <input
                                type="text"
                                name="quantity"
                                placeholder="Enter Quantity"
                                value={DonorData.quantity}
                                onChange={handleChange}
                            />
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Select the Unit</label>
                            <select
                                id="foodType"
                                name="unit"
                                value={DonorData.unit}
                                onChange={handleChange}
                            >
                                {getUnit?.length > 0 && getUnit.map((item, index) => (
                                    <option key={index} value={item.unitId}>
                                        {item.unitName}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food Expiry Date</label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={DonorData.expirationDate}
                                onChange={handleChange}
                            />
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food Photo</label>
                            <input type="file"
                                onChange={handleImageChange}
                                accept="image/*" />
                        </span>

                        <div className="Address_form">
                            <label className="ads_name">Flat, House No, Sector</label>
                            <input
                                type="text"
                                name="building"
                                placeholder="Flat, House No, Sector"
                                value={DonorData.address.building}
                                onChange={handleAddressChange}
                            />
                            <label className="ads_name">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark"
                                value={DonorData.address.landmark}
                                onChange={handleAddressChange}
                            />
                            <label className="ads_name">Area</label>
                            <input
                                type="text"
                                name="area"
                                placeholder="Area"
                                value={DonorData.address.area}
                                onChange={handleAddressChange}
                            />
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>PinCode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={DonorData.address.pincode}
                                        onChange={handlePincode}
                                        placeholder="Pin Code"
                                    />
                                </div>

                                <div className="input_group">
                                    <label>Town/City</label>
                                    <input
                                        type="text"
                                        name="townCity"
                                        value={DonorData.address.townCity}
                                        onChange={handleAddressChange}
                                        placeholder="Town/City"
                                    />
                                </div>
                            </div>
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={DonorData.address.state}
                                        onChange={handleAddressChange}
                                        placeholder="State"
                                    />
                                </div>
                                <div className="input_group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={DonorData.address.country}
                                        onChange={handleAddressChange}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        </div>

                        <span className="input_text_conatiner11">
                            <button className="send_Req_button">Send request</button>
                        </span>
                    </form>
                </div>
                <img className="donor_image" src={Donor_image} alt="Donor Image" />
            </div>
        </div>
    );
};

export default DonorDetails;
