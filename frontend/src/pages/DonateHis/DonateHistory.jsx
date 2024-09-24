import "./DonateHistory.css"
import Header from "../../common/Header";
import image_his_list from "../../assets/food_donation_home.jpeg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCalendar, faCheck, faMapLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { useSelector } from "react-redux";
import { formatDateAsDDMMYYYYHHMMSS } from "../../utils/utilityFunction";
import instance from "../../../env";
import Footer from "../../common/footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tokenService from "../../services/token.service";
import { useNavigate } from "react-router-dom";

const DonateHistory = () => {
    const [recordsCount, setRecordsCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [timeLimit, setTimeLimit] = useState("");
    const [distanceRange, setDistanceRange] = useState("");
    const [foodTypeChoice, setFoodTypeChoice] = useState('');
    const [givenReq, setGivenReq] = useState('');
    const [foodDonationList, setFoodDonationList] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const user = tokenService.getUser();
    const [showRecentOptions, setShowRecentOptions] = useState(false);
    const [showItemTypeOptions, setShowItemTypeOptions] = useState(false);
    const [userPosition, setUserPosition] = useState({
        latitude: '', longitude: ''
    })
    const recentRef = useRef();
    const itemTypeRef = useRef();
    const navigate = useNavigate();

    // API to fetch list of available food donations
    async function fetchAvailableFood(timeLimit = null, foodTypeChoice = null, user) {
        try {
            let res = await axiosInstance.post(api.DONATION_HISTORY.url, {
                page_size: recordsCount,
                page_number: pageNumber,
                timeLimit,
                userLatitude: user?.latitude || 20.3010259,
                userLongitude: user?.longitude || 85.7380521,
                distanceRange,
                foodType: foodTypeChoice,
                givenReq
            });
            console.log("Response of fetchAvailableFood API", res.data.foodDonationData);
            // console.log("user details", user.username?.userId);
            let filterData = res.data.foodDonationData.filter((data) => {
                return data.userId = user?.username?.userId
            })
            setFoodDonationList(filterData);
        }
        catch (error) {
            console.error('Error while fetching available food', error);
        }
    }
    // API to fetch filter dropdown data
    async function fetchFilterDropdown() {
        try {
            let res = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url);
            console.log("Response of fetchFilterDropdown API", res.data);
            setFilterOptions({
                timeRange: res.data.timeRange,
                distanceRange: res.data.distanceRange,
                foodType: res.data.foodType
            });
        }
        catch (error) {
            console.error('Error while fetching available food', error);
        }
    }

    // function getUserGeoLocation() {
    //     console.log("getUserGeoLocation");
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 setUserPosition({ latitude, longitude });
    //                 return;
    //             },
    //             (error) => {
    //                 console.log("error", error);
    //                 let response;
    //                 switch (error.code) {
    //                     case error.PERMISSION_DENIED:
    //                         console.error("User denied the request for Geolocation.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Location access denied. Please enable location services to use this feature.",
    //                         };
    //                         // alert('Location access denied. Please enable location services to use this feature.');
    //                         break;
    //                     case error.POSITION_UNAVAILABLE:
    //                         console.error("Location information is unavailable.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Location information is currently unavailable. Please try again later.",
    //                         };
    //                         // alert('Location information is currently unavailable. Please try again later.');
    //                         break;
    //                     case error.TIMEOUT:
    //                         console.error("The request to get user location timed out.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Request to access location timed out. Please try again.",
    //                         };
    //                         // alert('Request to access location timed out. Please try again.');
    //                         break;
    //                     default:
    //                         console.error("An unknown error occurred.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "An unknown error occurred while accessing your location.",
    //                         };
    //                     // alert('An unknown error occurred while accessing your location.');
    //                 }
    //                 alert(response.error);
    //                 return;
    //             }
    //         );
    //     } else {
    //         console.error("Geolocation is not supported by this browser");
    //         let response = {
    //             success: 0,
    //             error: "Geolocation is not supported by this browser",
    //         };
    //         toast.error(response.error);
    //     }
    //     return;
    // }

    function confirmDialogue(e, foodListingId) {
        e.preventDefault();
        toast.dismiss();
        toast.warn(
            <div>
                Do you want to proceed?
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Re-enable interactions with the background
                            document.querySelectorAll('body')[0].style.pointerEvents = 'auto';
                            document.querySelectorAll('body')[0].style.opacity = 1;
                            toast.dismiss();
                        }}
                        className="details-button red"
                    >
                        No
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeDonation(e, foodListingId);
                            // Re-enable interactions with the background
                            document.querySelectorAll('body')[0].style.pointerEvents = 'auto';
                            document.querySelectorAll('body')[0].style.opacity = 1;
                            toast.dismiss();
                        }}
                        className="details-button green"
                    >
                        Yes
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                onClose: () => {
                    // Re-enable interactions with the background if the toast is closed
                    document.body.style.pointerEvents = 'auto';
                }
            }
        )
    }

    async function closeDonation(e, foodListingId) {
        try {
            let res = await axiosInstance.put(api.CLOSE_FOOD_DONATION.url, {
                foodListingId
            });
            console.log("res at close Donation API", res.data);
            toast.dismiss();
            toast.success(res.data.message, {
                onClose: () => {
                    navigate(0);
                }
            })
        }
        catch (error) {
            console.error("Error at close Donation", error);
        }
    }


    function debounce(fn) {
        let timeoutId;
        return function (...args) {
            timeoutId = setTimeout(() => fn(...args), 1000);
        }
    }

    let debouncedFetchAvailableFood = useCallback(debounce(fetchAvailableFood), []);

    useEffect(() => {
        fetchAvailableFood(null, null, user);
        fetchFilterDropdown();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                recentRef.current && !recentRef.current.contains(event.target)
            ) {
                setShowRecentOptions(false);
                setShowItemTypeOptions(false);
            }
            if (
                itemTypeRef.current && !itemTypeRef.current.contains(event.target)
            ) {
                setShowRecentOptions(false);
                setShowItemTypeOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log({ timeLimit, foodTypeChoice });
        debouncedFetchAvailableFood(timeLimit, foodTypeChoice, user);
    }, [timeLimit, foodTypeChoice, debouncedFetchAvailableFood]);

    return (
        <div className='Mian_conatiner_doner_his'>
            <Header />
            <ToastContainer />
            <div className="child_conatiner_donor_details">
                <span className='text_his'>
                    <h1 className="Avil_text">Your Donations</h1>
                </span>
                {/* <div className="parent-container">
                    <div className="Child_conatiner_doner_his1">
                        <button className={`button-4 ${timeLimit ? 'filter-selected' : ''}`} role="button"
                            onClick={() => {
                                setShowRecentOptions(prevState => !prevState);
                                setShowItemTypeOptions(false);
                            }}
                        // ref={recentRef}
                        >
                            <FontAwesomeIcon icon={faCalendar} /> Recent
                        </button>
                        {
                            showRecentOptions && (
                                <div ref={recentRef} className="dropdown-options-1">
                                    <ul>
                                        {
                                            filterOptions.timeRange?.map((time, index) => {
                                                if (timeLimit == time.time) {
                                                    return (
                                                        <li key={index} onClick={(e) => setTimeLimit(time.time)} className="selected">
                                                            <FontAwesomeIcon icon={faCheck} /> &nbsp;
                                                            {time.time}
                                                        </li>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <li key={index} onClick={(e) => setTimeLimit(time.time)}>
                                                            {time.time}
                                                        </li>
                                                    )
                                                }
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        <button className="button-4" role="button" onClick={getUserGeoLocation}><FontAwesomeIcon icon={faMapMarkerAlt} /> Find nearby</button>
                        <button className={`button-4 ${foodTypeChoice ? 'filter-selected' : ''}`} role="button"
                            onClick={() => {
                                setShowItemTypeOptions(prevState => !prevState);
                                setShowRecentOptions(false);
                            }}
                        // ref={itemTypeRef}
                        >
                            <FontAwesomeIcon icon={faBagShopping} /> Item type
                        </button>
                        {
                            showItemTypeOptions && (
                                <div ref={itemTypeRef} className="dropdown-options-2">
                                    <ul>
                                        {
                                            filterOptions.foodType?.map((foodType, index) => {
                                                if (foodTypeChoice == foodType.foodCategoryId) {
                                                    return (
                                                        <li key={index} onClick={(e) => setFoodTypeChoice(foodType.foodCategoryId)} className="selected">
                                                            <FontAwesomeIcon icon={faCheck} /> &nbsp;
                                                            {foodType.foodCategoryName}
                                                        </li>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <li key={index} onClick={(e) => setFoodTypeChoice(foodType.foodCategoryId)}>
                                                            {foodType.foodCategoryName}
                                                        </li>
                                                    )
                                                }
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        <button className="button-4" role="button" onClick={(e) => {
                            setTimeLimit(""); setFoodTypeChoice("");
                        }}><FontAwesomeIcon icon={faTimes} /> Reset filters</button>
                    </div>
                </div> */}
                <div className="no_data_message">
                    {
                        foodDonationList.length == 0 &&
                        <p className="no_data_message">No donations made.</p>
                    }
                </div>
                <div className="cards-grid">
                    {foodDonationList?.map((food, index) => (
                        <div key={index} className="card">
                            <img src={image_his_list} alt="Food Item" className="card-image" />
                            <div className="card-content">
                                <p className="item_name">{food.foodName}</p>
                                <p className="exp_date">Address - {food.address || "NA"}</p>
                                <p className="exp_date">Expiration date - <span>{formatDateAsDDMMYYYYHHMMSS(food.expirationdate)}</span></p>
                                <p className="exp_date">
                                    Contact - <FontAwesomeIcon icon={faPhone} /> &nbsp;
                                    <a href={`tel: ${food.phoneNumber}`}>{food.phoneNumber}</a>
                                </p>
                                <p className="buttons">
                                    {
                                        new Date(food.expirationdate) > new Date() && <button className="details-button red" onClick={(e) => confirmDialogue(e, food.foodListingId)}>Close</button>
                                    }
                                    {/* {
                                        !(new Date(food.expirationdate) > new Date()) && <button className="details-button red" onClick={(e) => confirmDialogue(e, food.foodListingId)} disabled>Close</button>
                                    } */}
                                    {/* <button className="details-button green" onClick={reopenDonation}>Reopen</button> */}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default DonateHistory;