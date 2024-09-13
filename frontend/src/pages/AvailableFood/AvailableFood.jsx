import "./AvailableFood.css"
import Header from "../../common/Header";
import image_his_list from "../../assets/food_donation_home.jpeg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
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
    const [foodType, setFoodType] = useState('');
    const [givenReq, setGivenReq] = useState('');
    const [foodDonationList, setFoodDonationList] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const user = useSelector((state) => state.auth.user);

    // API to fetch list of available food donations
    async function fetchAvailableFood() {
        try {
            let res = await axiosInstance.post(api.VIEW_FOOD_DONATION_LIST.url, {
                page_size: recordsCount,
                page_number: pageNumber,
                timeLimit,
                userLatitude: user?.latitude || 20.3010259,
                userLongitude: user?.longitude || 85.7380521,
                distanceRange, foodType, givenReq
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

    useEffect(() => {
        fetchAvailableFood();
        fetchFilterDropdown();
    }, [])
    return (
        <div className='Mian_conatiner_doner_his'>
            <Header />
            <span className='text_his'>
                <h1>Available Food</h1>
            </span>
            <div className="parent-container">

                <div className="Child_conatiner_doner_his1">
                    <button className="button-4" role="button"><FontAwesomeIcon icon={faCalendar} /> Recent</button>
                    <button className="button-4" role="button"><FontAwesomeIcon icon={faMapMarkerAlt} /> Find nearby</button>
                    <button className="button-4" role="button"><FontAwesomeIcon icon={faUtensils} /> Food type</button>
                    <button className="button-4" role="button"><FontAwesomeIcon icon={faTimes} /> Reset filters</button>
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
                                        <p>Receiver Name - {food.name}</p>
                                        <p>Donation date - {formatDateAsDDMMYYYYHHMMSS(food.createdon)}</p>
                                        <p>Total - {food.totalitems} items</p>
                                        <p onClick={(e) => { window.open(instance().GOOGLE_MAPS_BASE_URL + `&destination=${food.latitude},${food.longitude}`) }}>
                                            <span className="map-location">
                                                <FontAwesomeIcon icon={faMapLocationDot} /> Location in map
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