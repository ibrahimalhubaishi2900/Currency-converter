const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const resultText = document.getElementById('result-text');
const rateInfo = document.getElementById('exchange-rate-info');
const swapBtn = document.getElementById('swap-btn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('result-container');

// Complete Full Name Dictionary for World Currencies
const currencyFullNames = {
  USD: 'United States Dollar', EUR: 'Euro', GBP: 'British Pound Sterling', JPY: 'Japanese Yen',
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
  ALL: 'Albanian Lek', RSD: 'Serbian Dinar', GEL: 'Georgian Lari', AMD: 'Armenian Dram',
  AFN: 'Afghan Afghani', AOA: 'Angolan Kwanza', AWG: 'Aruban Florin', AZN: 'Azerbaijani Manat',
  BAM: 'Bosnia-Herzegovina Convertible Mark', BBD: 'Barbadian Dollar', BIF: 'Burundian Franc',
  BMD: 'Bermudian Dollar', BND: 'Brunei Dollar', BOB: 'Bolivian Boliviano', BSD: 'Bahamian Dollar',
  BTN: 'Bhutanese Ngultrum', BWP: 'Botswana Pula', BYN: 'Belarusian Ruble', BZD: 'Belize Dollar',
  CDF: 'Congolese Franc', CRC: 'Costa Rican Colón', CUP: 'Cuban Peso', CVE: 'Cape Verdean Escudo',
  DJF: 'Djiboutian Franc', DOP: 'Dominican Peso', ERN: 'Eritrean Nakfa', ETB: 'Ethiopian Birr',
  FJD: 'Fijian Dollar', FKP: 'Falkland Islands Pound', FOK: 'Faroese Króna', GMD: 'Gambian Dalasi',
  GNF: 'Guinean Franc', GTQ: 'Guatemalan Quetzal', GYD: 'Guyanese Dollar', HNL: 'Honduran Lempira',
  HTG: 'Haitian Gourde', ILS: 'Israeli New Shekel', IMP: 'Manx Pound', JEP: 'Jersey Pound',
  JMD: 'Jamaican Dollar', KGS: 'Kyrgyzstani Som', KHR: 'Cambodian Riel', KMF: 'Comorian Franc',
  KYD: 'Cayman Islands Dollar', KZT: 'Kazakhstani Tenge', LAK: 'Laotian Kip', LKR: 'Sri Lankan Rupee',
  LRD: 'Liberian Dollar', LSL: 'Lesotho Loti', LYD: 'Libyan Dinar', MDL: 'Moldovan Leu',
  MGA: 'Malagasy Ariary', MKD: 'Macedonian Denar', MMK: 'Myanmar Kyat', MNT: 'Mongolian Tugrik',
  MOP: 'Macanese Pataca', MRU: 'Mauritanian Ouguiya', MUR: 'Mauritian Rupee', MVR: 'Maldivian Rufiyaa',
  MWK: 'Malawian Kwacha', MZN: 'Mozambican Metical', NAD: 'Namibian Dollar', NIO: 'Nicaraguan Córdoba',
  NPR: 'Nepalese Rupee', PAB: 'Panamanian Balboa', PGK: 'Papua New Guinean Kina', PYG: 'Paraguayan Guarani',
  RWF: 'Rwandan Franc', SBD: 'Solomon Islands Dollar', SCR: 'Seychellois Rupee', SDG: 'Sudanese Pound',
  SHP: 'Saint Helena Pound', SLE: 'Sierra Leonean Leone', SLL: 'Sierra Leonean Leone', SOS: 'Somali Shilling',
  SRD: 'Surinamese Dollar', SSP: 'South Sudanese Pound', STN: 'São Tomé and Príncipe Dobra',
  SYP: 'Syrian Pound', SZL: 'Eswatini Lilangeni', TJS: 'Tajikistani Somoni', TMT: 'Turkmenistan Manat',
  TOP: 'Tongan Paʻanga', TTD: 'Trinidad and Tobago Dollar', TWD: 'New Taiwan Dollar', UAH: 'Ukrainian Hryvnia',
  UZS: 'Uzbekistani Som', VES: 'Venezuelan Bolívar', VUV: 'Vanuatu Vatu', WST: 'Samoan Tala',
  XAF: 'Central African CFA Franc', XCD: 'East Caribbean Dollar', XOF: 'West African CFA Franc',
  XPF: 'CFP Franc', ZWG: 'Zimbabwean ZiG'
};

async function initializeApp() {
  try {
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    const currencyCodes = Object.keys(data.rates);
    
    // Sort array based on FULL NAMES alphabetically
    currencyCodes.sort((a, b) => {
      const nameA = currencyFullNames[a] || a;
      const nameB = currencyFullNames[b] || b;
      return nameA.localeCompare(nameB);
    });

    populateDropdowns(currencyCodes);

    fromSelect.value = 'USD';
    toSelect.value = 'EUR';

    await convertCurrency();
  } catch (err) {
    loading.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultText.textContent = 'Error';
    rateInfo.textContent = 'Unable to initialize currencies.';
  }
}

function populateDropdowns(codes) {
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  codes.forEach(code => {
    // Uses strictly the full name
    const fullName = currencyFullNames[code] || `${code} Currency`;

    const opt1 = document.createElement('option');
    opt1.value = code;
    opt1.textContent = fullName;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = code;
    opt2.textContent = fullName;
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

    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (data.result !== 'success') throw new Error('Failed to load rates');

    const rate = data.rates[to];
    const converted = (amount * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const toFullName = currencyFullNames[to] || to;
    const fromFullName = currencyFullNames[from] || from;

    resultText.textContent = `${converted} ${toFullName}`;
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

swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

initializeApp();
