import './DonateHistory.css'
import Header from '../../common/Header';
import image_his_list from "../../assets/food_donation_home.jpeg"
const DonateHistory = () => {
    return (
        <div className='Mian_conatiner_doner_his'>
            <Header />
            <span className='text_his'>
                <h1>Donation History</h1>
            </span>
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
export default DonateHistory;