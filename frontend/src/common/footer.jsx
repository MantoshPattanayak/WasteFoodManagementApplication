
import "./footer.css"
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
    const user = useSelector((state) => state.auth.user);
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
        <footer>
            {/* <ToastContainer /> */}
            <span className="text_overcom">
                <h1>Overcome Ignorance and <br></br>Fight for Equality</h1>
            </span>
            <div className="footer_button_vol_do">
                <button className="volunteer_button">VOLUNTEER</button>
                <button className="donate_button" onClick={handleNavigation}>DONATE</button>
            </div>
            <div className="content_footer">
                <div class="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div>
                {/* 2nd */}
                <div class="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div>

            </div>
            <span className="copy_right">
                <h1>© 2024 SOUL Limited. All Rights Reserved.</h1>
            </span>
        </footer>
    )
}

export default Footer;