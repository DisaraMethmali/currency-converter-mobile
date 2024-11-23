// services/currencyApi.js

import axios from 'axios';

const API_KEY = '04eac8884a8e877fb2791768eb186882'; // your actual API key

const fetchExchangeRates = async (baseCurrency, selectedCurrencies) => {
  try {
    const response = await axios.get('http://api.exchangeratesapi.io/v1/latest', {
      params: {
        access_key: API_KEY,
        base: baseCurrency,  // Include the base currency
        symbols: selectedCurrencies.join(','), // Use selectedCurrencies
      },
    });
    return response.data.rates;
  } catch (error) {
    throw new Error('Error fetching exchange rates');
  }
};

export default {
  fetchExchangeRates,
};
