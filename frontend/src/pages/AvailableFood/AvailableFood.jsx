import "./AvailableFood.css"
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

const AvailableFood = () => {
    const [recordsCount, setRecordsCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [timeLimit, setTimeLimit] = useState("");
    const [distanceRange, setDistanceRange] = useState("");
    const [foodTypeChoice, setFoodTypeChoice] = useState('');
    const [givenReq, setGivenReq] = useState('');
    const [foodDonationList, setFoodDonationList] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const user = useSelector((state) => state.auth.user);
    const [showRecentOptions, setShowRecentOptions] = useState(false);
    const [showItemTypeOptions, setShowItemTypeOptions] = useState(false);
    const [userPosition, setUserPosition] = useState({
        latitude: '', longitude: ''
    })
    const recentRef = useRef();
    const itemTypeRef = useRef();

    // API to fetch list of available food donations
    async function fetchAvailableFood(timeLimit = null, foodTypeChoice = null, user) {
        try {
            let res = await axiosInstance.post(api.VIEW_FOOD_DONATION_LIST.url, {
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
            setFoodDonationList(res.data.foodDonationData);
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

    function getUserGeoLocation() {
        console.log("getUserGeoLocation");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserPosition({ latitude, longitude });
                    return;
                },
                (error) => {
                    console.log("error", error);
                    let response;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("User denied the request for Geolocation.");
                            response = {
                                success: 0,
                                error:
                                    "Location access denied. Please enable location services to use this feature.",
                            };
                            // alert('Location access denied. Please enable location services to use this feature.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Location information is unavailable.");
                            response = {
                                success: 0,
                                error:
                                    "Location information is currently unavailable. Please try again later.",
                            };
                            // alert('Location information is currently unavailable. Please try again later.');
                            break;
                        case error.TIMEOUT:
                            console.error("The request to get user location timed out.");
                            response = {
                                success: 0,
                                error:
                                    "Request to access location timed out. Please try again.",
                            };
                            // alert('Request to access location timed out. Please try again.');
                            break;
                        default:
                            console.error("An unknown error occurred.");
                            response = {
                                success: 0,
                                error:
                                    "An unknown error occurred while accessing your location.",
                            };
                        // alert('An unknown error occurred while accessing your location.');
                    }
                    alert(response.error);
                    return;
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
            let response = {
                success: 0,
                error: "Geolocation is not supported by this browser",
            };
            toast.error(response.error);
        }
        return;
    }

    function debounce(fn) {
        let timeoutId;
        return function (...args) {
            timeoutId = setTimeout(() => fn(...args), 1000);
        }
    }

    let debouncedFetchAvailableFood = useCallback(debounce(fetchAvailableFood), []);

    useEffect(() => {
        fetchAvailableFood();
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
            if(
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
        debouncedFetchAvailableFood(timeLimit, foodTypeChoice, userPosition);
    }, [timeLimit, foodTypeChoice, userPosition, debouncedFetchAvailableFood]);

    return (
        <div className='Mian_conatiner_doner_his'>
            <Header />
            <span className='text_his'>
                <h1>Available Donations</h1>
            </span>
            <div className="parent-container">
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
            </div>

            {
                foodDonationList?.map((food, index) => {
                    return (
                        <div key={index} className="parent-container">
                            <div className="Child_conatiner_doner_his">
                                <div className='list_his'>
                                    <span className='image_list_his'>
                                        <img src={image_his_list}></img>
                                    </span>
                                    <span className='list_content'>
                                        <p>Items name - {food.foodName}</p>
                                        <p>Address - {food.address || 'NA'}</p>
                                        <p>Expiration date - {formatDateAsDDMMYYYYHHMMSS(food.expirationdate)}</p>
                                        <p>Contact - <FontAwesomeIcon icon={faPhone} /> &nbsp;{food.phoneNumber} </p>
                                        <p onClick={(e) => { window.open(instance().GOOGLE_MAPS_BASE_URL + `&destination=${food.latitude},${food.longitude}`) }}>
                                            <span className="map-location">
                                                <FontAwesomeIcon icon={faMapLocationDot} /> Direction in map
                                            </span>
                                        </p>
                                        <button className='Details_button'>Details</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default AvailableFood;