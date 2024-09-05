import axios from "axios";
import instance from "../../env";
import tokenService from "./token.service";

const { baseURL, headers, urlTimeout: timeout } = instance();
let _retry_count = 0
let _retry = null

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
function timeDelay(k) {
    const base_interval = 0.5
    const base_multiplier = 1.5
    const retry_interval = ((base_interval * (base_multiplier ** (k - 1))) * 1000)
    const max = k === 5 ? 500 : retry_interval
    return retry_interval + randomInt(0, max)
}
  
function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

const instance = axios.create({
    baseURL,
    headers,
    timeout
});

instance.interceptors.request.use(
    config => {
        if(!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${tokenService.getLocalAccessToken()}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);


instance.interceptors.response.use((res) => res, async (err) => {
    const origReqConfig = err.config;
        
        if(err.response.status >= 500 && _retry_count < 4) {
            _retry_count++;
            return wait(timeDelay(_retry_count)).then(() => instance.request(origReqConfig))
        }
    
        if(err.response.status === 401 && origReqConfig.headers.hasOwnProperty('Authorization')) {
            const rtoken = tokenService.getLocalRefreshToken();
            if(rtoken && _retry_count < 4) {
                
                _retry_count++;
    
                delete origReqConfig.headers['Authorization']
    
                _retry = await refresh(rtoken)
                    .finally(() => _retry = null)
                    .catch(error => Promise.reject(error))
                
                return _retry.then((token) => {
                    origReqConfig.headers['Authorization'] = `Bearer ${token}`
                    return instance.request(origReqConfig)
                })
            }
        }
        return Promise.reject(err);
});
/** function to fetch refresh token on expiry */
async function refresh (rtoken) {
    let _rtoken = ''
    let _token = ''

    try {
        let response = await axios({
            baseURL: baseURL + '/refresh-token',
            timeout,
            method: 'post',
            data: {
                refreshToken: rtoken
            }
        });

        _rtoken = response.data.rtoken
        _token = response.data.token

        tokenService.updateLocalAccessToken(_token);
    } catch(error) {
        console.log(error)
    } finally {
        return _token
    }
}

export default instance;