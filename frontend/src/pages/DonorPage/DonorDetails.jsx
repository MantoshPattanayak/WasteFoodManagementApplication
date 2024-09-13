import "./DonorDetails.css"
import Header from "../../common/Header";
import Donor_image from "../../assets/Donor_details_image.png"
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import axios from "axios";
const DonorDetails = () => {
    // get the data ---  (useSate)
    const [DonorType, setDonorType] = useState()
    const [getUnit, setgetUnit] = useState()
    const [DonorData, setDonorData] = useState([
        {
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
        }])
    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonorData({ ...DonorData, [name]: value });
    };
    // get the food type --(initial data)-----
    async function GetDonorType() {
        try {
            let res = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url)
            setDonorType(res.data.foodType)
            setgetUnit(res.data.units)
            console.log("here Response of initail data", res);

        } catch (err) {
            console.log("here Response of error (get initail data)", err);
        }
    }
    //   auto sugesstion of Address
    async function AutoSugestion(pincode) {
        try {
            let res = await axios.get(api.SEARCH_PLACE_BY_PINCODE.url + `${pincode}`)
            console.log("here Response", res.data[0].PostOffice[0]);
            setDonorData(res.data[0].PostOffice[0]);
        }
        catch (err) {
            console.log("here Error of Augo sugestion ", err);
        }
    }
    // handlePincode
    const handlePincode = (e) => {
        setDonorData({ ...DonorData, pincode: e.target.value })

    }
    // useEffect for call data (Update Api)
    useEffect(() => {
        GetDonorType();
        if (DonorData.pincode) {
            AutoSugestion(DonorData.pincode)
        }
    }, [DonorData])

    //   post the data of Donor ------
    async function PostDonorData() {
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
                        unit: DonorData.unit,

                    }]
            })
            console.log("here Response of Donor Data", res);
        }
        catch (err) {
            console.log("Donor Response Error", err);
        }
    }
    // here validation 



    return (
        <div className="main_conatiner_donor_details">
            <Header />
            <div className="Child_container_donor_details">
                <div className="form_conainer">

                    <h1>Donor Details</h1>
                    <form className="form_conatiner_form">
                        {/* <span className="input_text_conatiner">
                            <label>Mobile Number</label>
                            <input type="text" placeholder="Enter Mobile Number"
                            name=""
                            ></input>
                        </span> */}
                        <span className="input_text_conatiner">
                            <label>Food Name</label>
                            <input type="text" name="foodName" placeholder="Enter Food Name"
                                value={DonorData.foodName}
                                onChange={handleChange}
                            ></input>
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Food Type*</label>
                            <select id="foodType" name="foodCategory" placeholder="Select food type"
                                value={DonorData.foodCategory}
                                onChange={handleChange}
                            >
                                {DonorType?.length > 0 && DonorType?.map((item, index) => (
                                    <option key={index} value={item.foodCategoryId}>
                                        {item.foodCategoryName}
                                    </option>
                                ))}
                            </select>
                        </span>

                        <span className="input_text_conatiner">
                            <label>Food quantity</label>
                            <input type="text" placeholder="Enter Mobile Number"
                                name="quantity"
                                value={DonorData.quantity}
                                onChange={handleChange}
                            ></input>

                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Slect the Unit</label>
                            <select id="foodType" name="foodCategory" placeholder="Select food type"
                                value={DonorData.foodCategory}
                                onChange={handleChange}
                            >
                                {getUnit?.length > 0 && getUnit?.map((item, index) => (
                                    <option key={index} value={item.unitId}>
                                        {item.unitName}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food expiry date</label>
                            <input type="date" placeholder="Enter Mobile Number"
                                name="expirationDate"
                                value={DonorData.expirationDate}
                                onChange={handleChange}
                            ></input>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food photo</label>
                            <input type="file" accept="image/*"></input>
                        </span>

                        <div className="Address_form">
                            <label className="ads_name">Flat, House No, Sector</label>
                            <input type="text" placeholder="......"></input>
                            <label className="ads_name">Landmark</label>
                            <input type="text" placeholder="......"></input>
                            <label className="ads_name">Area</label>
                            <input type="text" placeholder="......"></input>
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>PinCode</label>
                                    <input type="text"
                                        name="pincode"
                                        onChange={handlePincode}
                                        placeholder="Pin Code"></input>
                                </div>

                                <div className="input_group">
                                    <label>Town/City</label>
                                    <input type="text"
                                        placeholder="Town/City"
                                        name="Division"
                                        value={DonorData.Division || DonorData.District}
                                    ></input>
                                </div>
                            </div>
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>State</label>
                                    <input type="text"
                                        name="pincode"
                                        value={DonorData.State}
                                        placeholder="Pin Code"></input>
                                </div>
                                <div className="input_group">
                                    <label>Country</label>
                                    <input type="text" placeholder="Town/City"
                                        value={DonorData.Country}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </form>
                    <span className="input_text_conatiner11">
                        <button className="send_Req_button" onClick={PostDonorData}>Send request</button>
                    </span>

                </div>
                <div className="image_conatiner">
                    <img src={Donor_image}></img>
                </div>

            </div>

        </div>
    )
}
export default DonorDetails;