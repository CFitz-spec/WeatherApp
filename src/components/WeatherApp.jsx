import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import loadingGif from "../assets/images/loading.gif";

import { useState } from "react";
import { useEffect } from "react";




const WeatherApp = () => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState("")
    const [unit, setUnit] = useState("metric")
    const [symbol, setSymbol] = useState("℃")
    const [image, setImage] = useState("")
    const [weatherImages, setWeatherImages] = useState({
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy,
    })
    const [backgroundImages, setBackgroundImages] = useState({
        Clear: `linear-gradient(to right, #f3b07c, #fcd283)`, //orange red also default
        Clouds: `linear-gradient(to right, #57d6d4, #71eeec)`, //blue
        Rain: `linear-gradient(to right, #6bc8fb, #80eaff)`, //lightish blue?
        Snow: `linear-gradient(to right, #aff2ff, #fff)`,//whiteish
        Haze: `linear-gradient(to right, #57d6d4, #71eeec)`,//blue
        Mist: `linear-gradient(to right, #57d6d4, #71eeec)`,//blue
    });
    const [loading, setLoading] = useState(false)
    const background = data.weather ? backgroundImages[data.weather[0].main] : `linear-gradient(to right, #f3b07c, #fcd283)`;

    function getDate() {
        const currentDate = new Date();
        const days = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"]
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const dayOfweek = days[currentDate.getDay()];
        const currentMonth = months[currentDate.getMonth()]
        const dayOfMonth = currentDate.getDate()
        const year = currentDate.getFullYear()
        return `${dayOfweek}: ${dayOfMonth}, ${currentMonth}, ${year}`
    }

    useEffect(() => {
        async function fetchDefaultLocation() {
            setLoading(true)
            //Don't have API key in front end. Send request to server to retrive and send data back
            const defaultLocaiton = "London"
            const api_key = (`1a4893e623e96cd7639831669ed3f3d0`)
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocaiton}&units=${unit}&appid=${api_key}`
            try {
                const result = await fetch(url)
                const data = await result.json();
                console.log(data)
                setData(data)
                setLoading(false)
                const weatherimage = data.weather ? weatherImages[data.weather[0].main] : null;
                setImage(weatherimage)
            }
            catch (err) {
                console.log("API Error: ", err)
            }
        }
        fetchDefaultLocation()
    }, [])



    function handleInput(e) {
        setLocation(e.target.value)
    }
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            search()
        }
    }
    function handleClick(e) {
        setUnit(e.target.value)
    }

    async function search() {

        if (location.trim() !== "") {
            //Don't have API key in front end. Send request to server to retrive and send data back
            setLoading(true)
            const api_key = (`1a4893e623e96cd7639831669ed3f3d0`)
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${api_key}`
            try {
                const result = await fetch(url)
                const data = await result.json();
                console.log(data)
                if (data.cod !== 200) {
                    setData({
                        notFound: true
                    })
                } else {
                    setData(data)
                    const weatherimage = data.weather ? weatherImages[data.weather[0].main] : null;
                    setImage(weatherimage)
                    setLocation("")
                    setLoading(false)
                    if (unit == "metric") {
                        setSymbol("℃")
                    } else if (unit == "standard") {
                        setSymbol("K");
                    } else {
                        setSymbol("℉")
                    }
                }

            }
            catch (err) {
                console.log("Error accessing API: ", err);
            }
        }
    }






    return (
        <div className="container" style={{ background }}>
            <div className="weather-app" style={{ background: background && background.replace ? background.replace("to right", "to top") : null }}>
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="locaion">{data.name ? data.name : "City not found"}</div>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Enter Location"
                            name="location"
                            value={location}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown} />
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>

                    <div className="search-under">

                        <input type="radio" name="unit" value="metric" id="metric" onChange={handleClick} />
                        <label htmlFor="metric">Metric</label>
                        <input type="radio" name="unit" value="standard" id="kelvin" onChange={handleClick} />
                        <label htmlFor="kelvin">Kelvin</label>
                        <input type="radio" name="unit" value="imperial" id="imperial" onChange={handleClick} />
                        <label htmlFor="kelvin">Imperial</label>



                    </div>
                </div>


                {loading ? (<img src={loadingGif} className="loading" alt="Loading Image" />) :
                    data.notFound ? (<div className="not-found">Not found 😢</div>) :
                        (<>
                            <div className="weather">
                                <img src={image ? image : sunny} alt="Image of the weather" />
                                <div className="weather-type">{data.weather ? `${data.weather[0].main}` : null}</div>
                                <div className="temp">{data.main ? `${Math.floor(data.main.temp)}${symbol}` : null}</div>
                            </div>
                            <div className="weather-date">
                                <p>{getDate()}</p>
                            </div>
                            <div className="weather-data">
                                <div className="humidity">
                                    <div className="data-name">Humidity</div>
                                    <i className="fa-solid fa-droplet"></i>
                                    <div className="data">{data.main ? data.main.humidity : null} %</div>
                                </div>
                                <div className="wind">
                                    <div className="data-name">Wind</div>
                                    <i className="fa-solid fa-wind"></i>
                                    <div className="data">{data.wind ? Math.floor(data.wind.speed) : null} km/h</div>
                                </div>
                            </div>
                        </>
                        )}
            </div>
        </div>
    )
}

export default WeatherApp

