const dropList = document.querySelectorAll("form select"),
      fromCurrency = document.querySelector(".from select"),
      toCurrency = document.querySelector(".to select"),
      getButton = document.querySelector("form button");

// Add currency options dynamically to both select elements
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        // Set default selected currencies
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "NPR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag); // Add options to select
    }

    // When a currency is changed, update the flag
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); // Call function to change flag when a new currency is selected
    });
}

// Function to load flag for selected currency
function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img"); // Select the sibling img tag
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`; // Set new image source
        }
    }
}

// Load the exchange rate when the page loads
window.addEventListener("load", () => {
    getExchangeRate();
});

// Fetch exchange rate when button is clicked
getButton.addEventListener("click", e => {
    e.preventDefault(); // Prevent form submission
    getExchangeRate();
});

// Swap currencies when the exchange icon is clicked
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value; // Temporary variable to store fromCurrency
    fromCurrency.value = toCurrency.value; // Swap currencies
    toCurrency.value = tempCode;
    loadFlag(fromCurrency); // Update flags after swap
    loadFlag(toCurrency);
    getExchangeRate(); // Fetch new exchange rate after swap
});

// Function to get the exchange rate and calculate conversion
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    
    // If input is empty or zero, set it to 1
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate..."; // Display loading text

    // Replace 'YOUR-API-KEY' with your actual API key from the ExchangeRate-API
    let url = `https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/${fromCurrency.value}`;
    
    // Fetch exchange rate data from the API
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value]; // Get exchange rate for selected currencies
            let totalExRate = (amountVal * exchangeRate).toFixed(2); // Calculate conversion
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`; // Display result
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong"; // Display error if API call fails
        });
}
