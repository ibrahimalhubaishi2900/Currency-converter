const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const resultFlag = document.getElementById('result-flag');
const resultText = document.getElementById('result-text');
const rateInfo = document.getElementById('exchange-rate-info');
const swapBtn = document.getElementById('swap-btn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('result-container');

// Complete Mapping: Currency Code -> 2-Letter Country Code for Flags
const currencyToCountry = {
  USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', CAD: 'ca', AUD: 'au', CHF: 'ch', CNY: 'cn',
  INR: 'in', AED: 'ae', SAR: 'sa', YER: 'ye', EGP: 'eg', BRL: 'br', ZAR: 'za', TRY: 'tr',
  RUB: 'ru', KRW: 'kr', MXN: 'mx', NZD: 'nz', SGD: 'sg', HKD: 'hk', SEK: 'se', NOK: 'no',
  DKK: 'dk', PLN: 'pl', THB: 'th', IDR: 'id', MYR: 'my', PHP: 'ph', PKR: 'pk', BDT: 'bd',
  VND: 'vn', IQD: 'iq', KWD: 'kw', QAR: 'qa', OMR: 'om', BHD: 'bh', JOD: 'jo', LBP: 'lb',
  ARS: 'ar', CLP: 'cl', COP: 'co', PEN: 'pe', UYU: 'uy', MAD: 'ma', DZD: 'dz', TND: 'tn',
  NGN: 'ng', GHS: 'gh', KES: 'ke', TZS: 'tz', UGX: 'ug', ZMW: 'zm', CZK: 'cz', HUF: 'hu',
  RON: 'ro', BGN: 'bg', HRK: 'hr', ISK: 'is', ALL: 'al', RSD: 'rs', GEL: 'ge', AMD: 'am'
};

// Comprehensive Currency Names Dictionary
const currencyNames = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound Sterling', JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  INR: 'Indian Rupee', AED: 'United Arab Emirates Dirham', SAR: 'Saudi Riyal', YER: 'Yemeni Rial',
  EGP: 'Egyptian Pound', BRL: 'Brazilian Real', ZAR: 'South African Rand', TRY: 'Turkish Lira',
  RUB: 'Russian Ruble', KRW: 'South Korean Won', MXN: 'Mexican Peso', NZD: 'New Zealand Dollar',
  SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar', SEK: 'Swedish Krona', NOK: 'Norwegian Krone',
  DKK: 'Danish Krone', PLN: 'Polish Zloty', THB: 'Thai Baht', IDR: 'Indonesian Rupiah',
  MYR: 'Malaysian Ringgit', PHP: 'Philippine Peso', PKR: 'Pakistani Rupee', BDT: 'Bangladeshi Taka',
  VND: 'Vietnamese Dong', IQD: 'Iraqi Dinar', KWD: 'Kuwaiti Dinar', QAR: 'Qatari Riyal',
  OMR: 'Omani Rial', BHD: 'Bahraini Dinar', JOD: 'Jordanian Dinar', LBP: 'Lebanese Pound',
  ARS: 'Argentine Peso', CLP: 'Chilean Peso', COP: 'Colombian Peso', PEN: 'Peruvian Sol',
  UYU: 'Uruguayan Peso', MAD: 'Moroccan Dirham', DZD: 'Algerian Dinar', TND: 'Tunisian Dinar',
  NGN: 'Nigerian Naira', GHS: 'Ghanaian Cedi', KES: 'Kenyan Shilling', TZS: 'Tanzanian Shilling',
  UGX: 'Ugandan Shilling', ZMW: 'Zambian Kwacha', CZK: 'Czech Koruna', HUF: 'Hungarian Forint',
  RON: 'Romanian Leu', BGN: 'Bulgarian Lev', HRK: 'Croatian Kuna', ISK: 'Icelandic Króna',
  ALL: 'Albanian Lek', RSD: 'Serbian Dinar', GEL: 'Georgian Lari', AMD: 'Armenian Dram'
};

async function initializeApp() {
  try {
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    const currencyCodes = Object.keys(data.rates).sort();
    populateDropdowns(currencyCodes);

    fromSelect.value = 'USD';
    toSelect.value = 'EUR';

    updateFlags();
    await convertCurrency();
  } catch (err) {
    loading.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultText.textContent = 'Error';
    rateInfo.textContent = 'Unable to initialize currencies.';
  }
}

// Reliable CDN using 2-letter ISO codes with fallback
function getFlagUrl(currencyCode) {
  const countryCode = currencyToCountry[currencyCode] || currencyCode.substring(0, 2).toLowerCase();
  return `https://flags.restcountries.com/v5/w640/${countryCode}.png`;
}

function populateDropdowns(codes) {
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  codes.forEach(code => {
    // Ensures FULL NAME is displayed alongside the 3-letter code
    const name = currencyNames[code] ? currencyNames[code] : `${code} Currency`;
    const labelText = `${code} - ${name}`;

    const opt1 = document.createElement('option');
    opt1.value = code;
    opt1.textContent = labelText;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = code;
    opt2.textContent = labelText;
    toSelect.appendChild(opt2);
  });
}

function updateFlags() {
  fromFlag.src = getFlagUrl(fromSelect.value);
  toFlag.src = getFlagUrl(toSelect.value);
  resultFlag.src = getFlagUrl(toSelect.value);
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  updateFlags();

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = '--';
    rateInfo.textContent = 'Please enter a valid amount';
    return;
  }

  try {
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    const rate = data.rates[to];
    const converted = (amount * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const toFullName = currencyNames[to] || to;
    const fromFullName = currencyNames[from] || from;

    resultText.textContent = `${converted} ${to}`;
    rateInfo.textContent = `1 ${fromFullName} = ${rate.toFixed(4)} ${toFullName}`;

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

// Handle image load errors gracefully by falling back to a generic globe icon
[fromFlag, toFlag, resultFlag].forEach(img => {
  img.onerror = function() {
    this.src = 'https://flags.restcountries.com/v5/w640/un.png';
  };
});

swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

initializeApp();
