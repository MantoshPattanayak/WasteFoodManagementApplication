import "./AvailableFoodDetails.css"
import Header from "../../common/Header";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import { decryptData } from "../../utils/encryption";
import { Link, useLocation,useNavigate } from "react-router-dom";
import api from "../../utils/apiList";

const AvailableFoodDetails = () => {
    const [isPopupOpen, setisPopupOpen] = useState(false)
    // get data of itemByid
    const[getDataById, setgetDataById]=useState([])
    const foodListingId=decryptData(new URLSearchParams(location.search).get("foodListingId"))
 
    //get data --------------
    async function GetitemDataById(foodListingId){
        console.log("decypt food list id", foodListingId);
        try{
            let res= await axiosInstance.get(`${api.VIEW_FOOD_DONATION_BY_ID.url}/${foodListingId}` )
            setgetDataById(res.data.fetchFoodListingDetails[0])
            console.log("here Response of GetitemDataById", res.data.fetchFoodListingDetails[0]);
        }catch(err){
            console.log("Error : Response of GetItemDataById", err);
        }
    }
//   useEffect for Update the data
useEffect(()=>{
    GetitemDataById(foodListingId)
}, [])







    // handle Popup(Open)
    const handleOpenPopup = () => {
        setisPopupOpen(true)
    }
    // handle Popup (Close)
    const handleClosePopup = () => {
        setisPopupOpen(false)
    }

    // encrypt the id
  
    return (
        <div className="main_container_item_details">
            <Header />
            <div class="product-container">
                <div class="image-section">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRE0b7vFLR-jNx8hjihbU4MOfYxiE9qAGYCg&s"></img>
                </div>
                <div class="details-section">
                    <h2>{getDataById.foodName}</h2>
                    <ul class="product-details">
                        <li><strong>Max Cutting Width (mm):</strong> 250 mm</li>
                        <li><strong>Product Description:</strong> Cameo 4 + Skin Cutting Software</li>
                        <li><strong>Configuration:</strong> 12 inch</li>
                        <li><strong>RAM:</strong> 4 GB RAM</li>
                        <li><strong>Packaging Type:</strong> Packet</li>
                    </ul>
                    <p class="description">Skin Cutting software with CAMEO 4 Cutting Plotter model, you can cut up to 12-inch width, and in roll format skins...</p>
                    <button class="button-9" onClick={handleOpenPopup}>Contact</button>
                </div>

            </div>
            <div className="product-container1">
                <p className="p_tag_similar">Find Similar More Products:</p>
                <div className="product_card_item">
                    <div className="card">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRE0b7vFLR-jNx8hjihbU4MOfYxiE9qAGYCg&s"
                            alt="Product Image"
                            className="product-image"
                        />
                        <p className="product-name">Cameo 4 Cutting Plotter</p>
                        <p1>Bhubaneswar, Odisha</p1>
                        <p1>Expiration date - 26-10-2024</p1>

                    </div>

                </div>
            </div>






            {/* Popup component */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Contact Us</h3>
                        <p>Feel free to reach out for more information .</p>
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" />
                        <label>Email_Id</label>
                        <input type="email" placeholder="Your Email" />
                        <label>Mobile Number</label>
                        <input type="text" placeholder="Your Phone Number" />
                        <div className="button_close_submit">
                            <button className="button-9" role="button" >Submit</button>
                            <button class="button-42" role="button" onClick={handleClosePopup}>Close</button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
export default AvailableFoodDetails;