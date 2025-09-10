const weatherCard = document.getElementById('weather-card');
const refreshBtn = document.getElementById('refresh-btn');
const errorMsg = document.getElementById('error-msg');
const darkToggle = document.getElementById('dark-toggle');

async function getWeather() {
    errorMsg.textContent = '';
    weatherCard.textContent = 'Loading...';

    if (!navigator.geolocation) {
        errorMsg.textContent = 'Geolocation is not supported.';
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);

        try {
            // Fetch weather data from Open-Meteo
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
            const resp = await fetch(url);
            const data = await resp.json();

            if (!data.current_weather) throw new Error('Weather data unavailable');

            const weather = data.current_weather;

            const lines = [
                `Latitude: ${lat}`,
                `Longitude: ${lon}`,
                `Temperature: ${weather.temperature} °C`,
                `Windspeed: ${weather.windspeed} km/h`
            ];

            weatherCard.textContent = '';
            await typeLines(lines, 50);

        } catch(err) {
            errorMsg.textContent = 'Error fetching weather: ' + err.message;
            weatherCard.textContent = '';
        }

    }, (err) => {
        errorMsg.textContent = 'Geolocation error: ' + err.message;
        weatherCard.textContent = '';
    });
}

// Typewriter effect
async function typeLines(lines, delay = 50) {
    for (let line of lines) {
        for (let char of line) {
            weatherCard.textContent += char;
            await new Promise(r => setTimeout(r, delay));
        }
        weatherCard.textContent += '\n';
    }
    // Remove cursor after typing
     weatherCard.classList.remove('cursor');
}

// Refresh button
refreshBtn.addEventListener('click', getWeather);

// Dark mode toggle
darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkToggle.checked);
});

// Initial load
getWeather();
