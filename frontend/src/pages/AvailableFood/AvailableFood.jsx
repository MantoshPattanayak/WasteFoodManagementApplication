import "./AvailableFood.css"
import Header from "../../common/Header";
import image_his_list from "../../assets/food_donation_home.jpeg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const AvailableFood=()=>{
    return(
        <div className='Mian_conatiner_doner_his'>
        <Header />
        <span className='text_his'>
            <h1>Available Food</h1>
        </span>
        <div class="parent-container">
            
            <div class="Child_conatiner_doner_his1">
                 <button class="button-4" role="button"> <FontAwesomeIcon icon={faCalendar} size="x" /> Recent</button>
                 <button class="button-4" role="button"> <FontAwesomeIcon icon={faMapMarkerAlt} size="x" /> Find nearby</button>
                 <button class="button-4" role="button"> <FontAwesomeIcon icon={faUtensils} size="x" />  Food type</button>
                 <button class="button-4" role="button"> <FontAwesomeIcon icon={faTimes} size="x" /> Reset filters</button>
              
            </div>
        </div>
        <div class="parent-container">
            
            <div class="Child_conatiner_doner_his">
                
                <div className='list_his'>
                    <span className='image_list_his'>
                        <img src={image_his_list}></img>
                    </span>
                    <span className='list_content'>
                        <p>Receiver Name - Mamta Charity</p>
                        <p>Donation date  -27 / 08 / 2024</p>
                        <p>Received date  -27 / 08 / 2024</p>
                        <p>Total                   - 4 items</p>
                        <button className='Details_button'>Details</button>
                    </span>

                </div>
            </div>
        </div>
         {/* dummmy for show */}
         <div class="parent-container">
            <div class="Child_conatiner_doner_his">
                <div className='list_his'>
                    <span className='image_list_his'>
                        <img src={image_his_list}></img>
                    </span>
                    <span className='list_content'>
                        <p>Receiver Name - Mamta Charity</p>
                        <p>Donation date  -27 / 08 / 2024</p>
                        <p>Received date  -27 / 08 / 2024</p>
                        <p>Total                   - 4 items</p>
                        <button className='Details_button'>Details</button>
                    </span>

                </div>
            </div>
            
           
        </div>
        <div class="parent-container">
            <div class="Child_conatiner_doner_his">
                <div className='list_his'>
                    <span className='image_list_his'>
                        <img src={image_his_list}></img>
                    </span>
                    <span className='list_content'>
                        <p>Receiver Name - Mamta Charity</p>
                        <p>Donation date  -27 / 08 / 2024</p>
                        <p>Received date  -27 / 08 / 2024</p>
                        <p>Total                   - 4 items</p>
                        <button className='Details_button'>Details</button>
                    </span>

                </div>
            </div>
            
           
        </div>
    </div>
    )
}
export default AvailableFood;