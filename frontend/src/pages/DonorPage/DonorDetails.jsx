import "./DonorDetails.css"
import Header from "../../common/Header";
import Donor_image from "../../assets/Donor_details_image.png"
const DonorDetails = () => {
    return (
        <div className="main_conatiner_donor_details">
            <Header />
            <div className="Child_container_donor_details">
                <div className="form_conainer">

                    <h1>Donor Details</h1>
                    <form className="form_conatiner_form">
                        <span className="input_text_conatiner">
                            <label>Mobile Number</label>
                            <input type="text" placeholder="Enter Mobile Number"></input>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food Name</label>
                            <input type="text" placeholder="Enter Food Name"></input>
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Food Type*</label>
                            <select id="foodType" name="foodType" placeholder="Select food type">
                                <option value="" disabled selected>Select food type</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                          

                            </select>
                        </span>

                        <span className="input_text_conatiner">
                            <label>Food quantity</label>
                            <input type="text" placeholder="Enter Mobile Number"></input>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food expiry date</label>
                            <input type="date" placeholder="Enter Mobile Number"></input>
                        </span>
                        <span className="input_text_conatiner">
                            <label>Food photo</label>
                            <input type="file" accept="image/*"></input>
                        </span>
                    </form>
                    <span className="input_text_conatiner11">
                        <button className="send_Req_button">Send request</button>
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