window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fetch-data").addEventListener("click", () => {
        document.getElementById("fetch-data").className = 'loading';
        
        const errorElement = document.querySelector(".home-page p");

        // convert timzone given by weather api into string
        const secondsToTimeZoneString = (offsetSeconds) => {
            const hours = Math.floor(offsetSeconds / 3600); 
            const minutes = Math.floor((offsetSeconds % 3600) / 60); 
            const sign = offsetSeconds < 0 ? '-' : '+';
            const formattedOffset = `${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            return `UTC${formattedOffset}`;
        }

        const degreesToWindDirection = (degrees) => {
            const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
            const index = Math.round(degrees / 22.5) % 16;
            return directions[index];
        }

        /**
         * Get current location of user.
         * We'll use `GeoLocation` API.
         */
        if ("geolocation" in navigator) {
            const useUserLocation = () => {
                console.log("Fetching data")
                navigator.geolocation.getCurrentPosition(function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude; 

                    /**
                     * Now we have location of user.
                     * Let's fetch weather data and also show location in DOM.
                     */
                    document.getElementById("latitude").textContent = `Lat: ${latitude}`;
                    document.getElementById("longitude").textContent = `Lat: ${longitude}`;
                
                    /**
                     * We are using here `iframe` for showing google map
                     * AIzaSyALJd4lJaW_3pOn-XeE5Bg0Be_FO5u9X0M
                     */
                    const iframe = document.createElement("iframe");
                    iframe.style.cssText = "height:100%;width:100%;border: 0;";
                    iframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
                    document.querySelector(".map").appendChild(iframe);
    
                    /**
                     * Fetch weather information                                          
                    */
                    // AIzaSyCPOzH6UR9b1E2-lNgrYgANceBotQIW2DQ

                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=225c3ba08e641a9f72fea81fd52ceb38`)
                            .then(e => e.json())
                    .then(data => {
                        console.log(data);
                        document.body.classList.add('main');
                        document.body.classList.remove('home');
                        document.querySelector("#location").textContent = "Location : "+data.name;
                        document.querySelector("#speed").textContent = "Wind Speed : "+(data.wind.speed*3.6).toFixed(3) + "kmph"; 
                        document.querySelector("#humidity").textContent = "Humidity : "+data.main.humidity;
                        document.querySelector("#timezone").textContent = "Time Zone : "+secondsToTimeZoneString(data.timezone);
                        document.querySelector("#pressure").textContent = "Pressure : "+data.main.pressure;
                        document.querySelector("#direction").textContent = "Wind Direction : "+degreesToWindDirection(data.wind.deg)
                        document.querySelector("#uv-index ").textContent="UV Index : 500";
                        document.querySelector("#feels ").textContent ="Feels_like : " +data.main.feels_like;
                    })        
                    .catch(e => {
                        console.log("dsdsdc")
                        errorElement.textContent = e.message;
                    });
                });
            }

            useUserLocation();

        } else {
            // errorElement.textContent = "Geolocation is not supported by your browser.";
            alert("Geolocation is not supported by your browser.");
        }
    });
});
