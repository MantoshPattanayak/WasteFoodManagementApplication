const instance = () => {
    return(
        {
            baseURL: "http://localhost:8000",
            headers: {
                'Content-type': "application/json",
                'Authorization': 'Bearer ' +  sessionStorage?.getItem('accessToken'),
                'sid': sessionStorage?.getItem('session-id'),
                'refreshToken': 'Bearer ' + localStorage.getItem('refreshToken')
            },
            urlTimeout: 50000,
            ENCRYPT_DECRYPT_KEY: '1234567890abcdef1234567890abcdef',
            IV: 'fedcba0987654321fedcba0987654321',
            baseName: '/soul',
            REACT_APP_GOOGLE_MAPS_API_KEY: "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao",
            APPLICATION_MODE: 'production', // production, development
        }
    )
}
export default instance;