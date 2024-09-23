import food_dontaion_image from "../../assets/food_donation_home.jpeg"
import "./landingPage.css"

import ads_image from "../../assets/ad.jpg"
import what_to_do_1st_image from "../../assets/boy_food_image.png"
import Bike_ride_drivery_body from "../../assets/bike_ride_boyd.png"
import dis from "../../assets/dis.png"
import community_image from "../../assets/community.png"
import Header from "../../common/Header"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../common/footer"
import { useState, useEffect } from "react"
import landing_image from "../../assets/food_donation_home.jpeg"
import Landing_image2 from "../../assets/save_food_image1.jpg"
import Landing_image3 from "../../assets/Save_food_image_3.jpg"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const LandingPage = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user);
    // track the current image
    // Array of images to be swapped
    const images = [landing_image, Landing_image2, Landing_image3];

    // State to track the current image index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Effect to change the background image every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [images.length]);

    function handleNavigation(e) {
        // console.log("handle navigation");
        if (user) {
            navigate('/DonorDetails')
        }
        else {
            toast.error('Kindly log in or register first!')
        }
    }

    return (
        <div className="Landing_page_main_conatiner">
            <Header />
            <div className="image_content_conatiner" style={{
                backgroundImage: `linear-gradient(
          10deg,
          rgba(0, 0, 0, 0.9),
          rgba(0, 0, 0, 0.2)
        ), url(${images[currentIndex]})`,
            }}>
                <span className="image_text">
                    <h1>Imagine a world <br>
                    </br>without HUNGER</h1>
                    <p>Eliminate hunger by donating food, funds, or resources to local food banks and charities.
                        <br></br>  Your contributions  help provide meals to those in need, creating a stronger, <br></br>
                        healthier
                        community.</p>
                    <span className="Button_on_image">
                        <button className="button-19" role="button" onClick={(e) => handleNavigation(e)}>Donate Now</button>
                        <button className="button-9" role="button" onClick={() => navigate('/AvailableFood')}>Explore donations</button>
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
                                <h2 className="b_donor">Be a Donor    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                            <div className="each_image_ads">
                                <img className="image_logo" src={Bike_ride_drivery_body} alt="Bike Ride"></img>
                                <p className="text_color">Volunteers can join our team to help by collecting food donations directly from donors, ensuring it reaches those in need.</p>
                                <h2 className="b_donor">Be a Volunteer    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                        </div>
                        <div className="image_text_ads">
                            <div className="each_image_ads">
                                <img className="image_logo" src={dis} alt="Distribution"></img>
                                <p className="text_color">We donate rescued food directly to people or through charities, and facilitate communication between donors and volunteers.</p>
                                <h2 className="b_donor">Register Charity   <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                            <div className="each_image_ads">
                                <img className="image_logo" src={community_image} alt="Community"></img>
                                <p className="text_color">We are building a compassionate community united to fight hunger by connecting donors, volunteers, and those in need.</p>
                                <h2 className="b_donor">Join    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    )
}
export default LandingPage;