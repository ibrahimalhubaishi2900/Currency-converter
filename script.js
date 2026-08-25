const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const resultText = document.getElementById('result-text');
const rateInfo = document.getElementById('exchange-rate-info');
const swapBtn = document.getElementById('swap-btn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('result-container');

let cachedRates = {};

async function initializeApp() {
  try {
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // Fetch initial rates (defaults to USD base) to get full list of currencies
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    cachedRates = data.rates;
    const currencyCodes = Object.keys(data.rates).sort();

    // Populate dropdowns dynamically with ALL available currencies
    populateDropdowns(currencyCodes);

    // Set default selections
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';

    convertCurrency();
  } catch (err) {
    loading.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultText.textContent = 'Error';
    rateInfo.textContent = 'Unable to fetch initial rates.';
  }
}

function populateDropdowns(codes) {
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  codes.forEach(code => {
    const opt1 = document.createElement('option');
    opt1.value = code;
    opt1.textContent = code;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = code;
    opt2.textContent = code;
    toSelect.appendChild(opt2);
  });
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = '--';
    rateInfo.textContent = 'Please enter a valid amount';
    return;
  }

  try {
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // Fetch fresh rates for the chosen 'From' currency
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    const rate = data.rates[to];
    const converted = (amount * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    resultText.textContent = `${converted} ${to}`;
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

    loading.classList.add('hidden');
    resultContainer.classList.remove('hidden');
  } catch (err) {
    loading.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultText.textContent = 'Error';
    rateInfo.textContent = 'Unable to fetch conversion rates.';
  }
}

// Event Listeners
amountInput.addEventListener('input', convertCurrency);
fromSelect.addEventListener('change', convertCurrency);
toSelect.addEventListener('change', convertCurrency);

swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

initializeApp();
