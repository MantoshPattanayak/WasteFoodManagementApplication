import food_dontaion_image from "../../assets/food_donation_home.jpeg"
import "./landingPage.css"

import ads_image from "../../assets/ad.jpg"
import what_to_do_1st_image from "../../assets/boy_food_image.png"
import Bike_ride_drivery_body from "../../assets/bike_ride_boyd.png"
import dis from "../../assets/dis.png"
import community_image from "../../assets/community.png"
import Header from "../../common/Header"


const LandingPage = () => {
    
    return (
        <div className="Landing_page_main_conatiner">
       <Header/>
            <div className="image_content_conatiner">
                <span className="image_text">
                    <h1>Imagine a world <br>
                    </br>without HUNGER</h1>
                    <p>Eliminate hunger by donating food, funds, or resources to local food banks and charities.
                        <br></br>  Your contributions  help provide meals to those in need, creating a stronger, <br></br>
                        healthier
                        community.</p>
                    <span className="Button_on_image">
                        <button class="button-19" role="button">Donate Now</button>
                        <button class="button-9" role="button">Join as a volunteer</button>
                    </span>
                </span>
            </div>
            <div className="Ads_conatiner">
                <img className="Ads_image" src={ads_image}></img>
                <img className="Ads_image" src={ads_image}></img>
                <img className="Ads_image" src={ads_image}></img>
                <img className="Ads_image" src={ads_image}></img>
            </div>
            <div className="what_to_do">
    <div className="what_to_do_text">
        <h1>What We Do ?</h1>
        <p>We have built a compassionate community where individuals come together to donate food, and volunteers actively participate in rescuing and distributing it to those in need. Our mission is to ensure that no one goes without a proper meal by delivering food directly to charities and people who cannot afford even one daily meal. Together, we're committed to fighting hunger and nourishing those who need it most.</p>
    </div>
    <div className="what_to_do_explain">
        <div className="what_to_do_1st_container">
            <div className="image_text_ads">
                <div className="each_image_ads">
                    <img className="image_logo" src={what_to_do_1st_image} alt="Rescue Food"></img>
                    <p className="text_color">We rescue fresh leftover food from individuals, restaurants, grocery stores, caterers, and events.</p>
                    <h2 className="b_donor">Be a Donor </h2>
                </div>
                <div className="each_image_ads">
                    <img className="image_logo" src={Bike_ride_drivery_body} alt="Bike Ride"></img>
                    <p className="text_color">We ensure efficient transportation of rescued food to those in need.</p>
                </div>
            </div>
            <div className="image_text_ads">
                <div className="each_image_ads">
                    <img className="image_logo" src={dis} alt="Distribution"></img>
                    <p className="text_color">We distribute rescued food to charities and individuals in need.</p>
                </div>
                <div className="each_image_ads">
                    <img className="image_logo" src={community_image} alt="Community"></img>
                    <p className="text_color">We foster community involvement to combat hunger effectively.</p>
                </div>
            </div>
        </div>
    </div>
</div>

        </div>
    )
}
export default LandingPage;