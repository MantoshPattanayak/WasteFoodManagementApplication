
import Header from "../../common/Header.jsx"
import SaveImage from "../../assets/Save_food.png"
import "./AboutPage.css"
import Footer from "../../common/footer.jsx"
import Mission_image from "../../assets/dis.png"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"

const About = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    function handleNavigation(e) {
        // console.log("handle navigation");
        if (user) {
            console.log(1)
            navigate('/DonorDetails')
        }
        else {
            console.log(2)
            toast.error('Kindly log in or register first!')
        }
    }

    return (
        <div className="About_main_container">
            <Header />
            <ToastContainer />
            <div className="child_about_main_container">
                <div className="content_text">
                    <h1 className="text_about">Imagine a world <br></br>
                        <h2 className="text_about1"> without  Hunger</h2> </h1>
                    <p><p>Food wastement contributes to hunger worldwide.Reducing food waste not only  <br></br>helps alleviate hunger but also conserves resources and reduces environmental impact.</p>
                    </p>
                    <span className="button_donate_volunteer">
                        <button className="donated_button" onClick={handleNavigation}>Donate Now</button>
                        {/* <button className="donated_button">Join as a volunteer</button> */}
                    </span>
                </div>
                <div className="set_image_food">
                    <img className="food-image" src={SaveImage}></img>
                </div>
            </div>
            <div className="mission_conatiner">
                <h1 className="text_mission">Our Mission</h1>
                <div className="mission_child_food">
                    <div className="image_mission_div">
                        <img className="mission_image" src={Mission_image}></img>
                    </div>
                    <div className="mission_content">
                        <h1>Mission</h1>
                        <p>At SOUL Share, we believe in creating a sustainable world where no food goes to waste, and everyone has access to nutritious meals. Our mission is simple: to bridge the gap between food surplus and food scarcity by connecting donors who have excess food with volunteers who are eager to help distribute it to those in need.</p>
                        <h1>Belief</h1>
                        <p>Our core belief is that food is far too valuable to waste, and that technology can transform the way we use food.</p>
                    </div>

                </div>
            </div>
            {/* <div className="mission_child_food">
                <div className="mission_content">
                    <h1>How It Works</h1>
                    <p>Through our platform, food donors - whether</p>
                </div>
            </div> */}
            <Footer />
        </div>
    )
}

export default About;