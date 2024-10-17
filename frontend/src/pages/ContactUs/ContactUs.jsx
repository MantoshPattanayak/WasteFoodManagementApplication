import React, { useEffect, useState } from 'react'
import Header from "../../common/Header";
import Footer from "../../common/footer";
import "./ContactUs.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../services/axios';
import api from '../../utils/apiList';

export default function ContactUs() {
    const [contactForm, setContactForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: ""
    });

    async function submitForm(e) {
        e.preventDefault();
        try {

        }
        catch (error) {
            console.error("Error at submit form func", error);
        }
    }

    function validateUserInput(e, contactForm) {
        let errors = {};
        let nameRegex = "^[A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)*$";
        let emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        let phoneRegex = "^[7-9]\d{9}$";
        let messageRegex = "^(?!.*[\p{Emoji}]).+?(\n|$)+";

        if(contactForm.firstName && !nameRegex.test(contactForm.firstName)) {
            errors.firstName = "Please provide a valid name."
        }
        else {
            errors.firstName = "Please provide first name.";
        }

        if(!contactForm.email && !contactForm.phoneNumber) {
            errors.email = "Please provide either email or phone number.";
            errors.phoneNumber = "Please provide either email or phone number.";
        }

        if(contactForm.email && !emailRegex.test(contactForm.email)) {
            errors.email = "Please provide a valid email.";
        }

        if(contactForm.phoneNumber && !phoneRegex.test(contactForm.phoneNumber)) {
            errors.phoneNumber = "Please provide a valid phone number.";
        }

        if(contactForm.message && !messageRegex.test(contactForm.message)) {
            errors.message = "Please type a valid message and there should be no emoji."
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setContactForm({...contactForm, [name]: value});
        console.log("contactForm at handleChange", contactForm);
    }

    useEffect(() => { }, [contactForm]);

    return (
        <>
            <Header />
            <div className='contact-container'>
                <div className='contact-left'>
                    <div className='contact-header'>
                        <h5>Contact Information</h5>
                        <h6>Feel free to reach out to us.</h6>
                    </div>
                    <div className='contact-details'>
                        <div className='contact-number'><FontAwesomeIcon icon={faPhone} />&nbsp;&nbsp;+91-7077769335</div>
                        <div className='contact-email'><FontAwesomeIcon icon={faEnvelope} />&nbsp;&nbsp;soul@soulunileaders.com</div>
                        <div className='contact-address'><FontAwesomeIcon icon={faLocationDot} />&nbsp;&nbsp;E/42/D, Infocity Avenue, Chandaka Industrial Estate, Bhubaneswar, Odisha, India - 751024</div>
                    </div>
                    <div className='contact-socials'>
                    </div>
                </div>
                <div className='contact-right'>
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <input name='firstName' className='input-data' type='text' maxLength={50} value={contactForm.firstName} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <input name='lastName' className='input-data' type='text' maxLength={50} value={contactForm.lastName} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input name='email' className='input-data' type='text' maxLength={50} value={contactForm.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input name='phoneNumber' className='input-data' type='text' maxLength={10} value={contactForm.phoneNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea name='message' className='textarea' maxLength={200} value={contactForm.message} onChange={handleChange} />
                    </div>
                    <div>
                        <button className='contact-submit' onClick={submitForm}>Send Message</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
