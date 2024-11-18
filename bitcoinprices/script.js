// Connect to Binance WebSocket API
const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

// Reference to the price element
const priceElement = document.getElementById('price-value');
let previousPrice = null; // Store the previous price
let latestPrice = null; // Store the latest price from WebSocket

// Function to update the price with smooth color transition
function updatePriceOnInterval() {
    if (latestPrice !== null) {
        // Compare the latest price with the previous price
        if (previousPrice !== null) {
            if (latestPrice > previousPrice) {
                // Price increased: set color to green
                priceElement.style.color = '#4caf50';
            } else if (latestPrice < previousPrice) {
                // Price decreased: set color to red
                priceElement.style.color = '#ff3b3b';
            }
        }

        // Update the displayed price
        priceElement.textContent = `$${Math.floor(latestPrice)}`;

        // Smoothly transition back to white after 0.5 seconds
        setTimeout(() => {
            priceElement.style.color = 'white';
        }, 500);

        // Update the previous price
        previousPrice = latestPrice;
    }
}

// Update price every 5 seconds
setInterval(updatePriceOnInterval, 3000);

// Listen for messages from the WebSocket
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    latestPrice = parseFloat(data.p); // Store the latest price
};

// Handle connection errors
socket.onerror = (error) => {
    priceElement.textContent = 'Error fetching price!';
    console.error('WebSocket error:', error);
};

// Handle connection close
socket.onclose = () => {
    priceElement.textContent = 'Connection closed!';
};