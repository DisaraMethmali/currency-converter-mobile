import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, Switch, Alert, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default base currency
  const [selectedCurrencies, setSelectedCurrencies] = useState(['EUR', 'INR', 'GBP']); // Default target currencies
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [rates, setRates] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Currency options for the picker
  const currencyOptions = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'INR', value: 'INR' },
    { label: 'JPY', value: 'JPY' },
    { label: 'CAD', value: 'CAD' },
    { label: 'AUD', value: 'AUD' },
  ];
  const API_KEY = '04eac8884a8e877fb2791768eb186882'; // your actual API key

  // Fetch exchange rates from the API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('http://api.exchangeratesapi.io/v1/latest', {
          params: {
            access_key: API_KEY,
            symbols: selectedCurrencies.join(','), // Use selectedCurrencies here
          },
        });
        setRates(response.data.rates);
        setError('');
      } catch (error) {
        setError('Error fetching exchange rates.');
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, [baseCurrency, selectedCurrencies]); // Add selectedCurrencies to the dependency array

  // Convert the amount whenever the user updates input or changes the base currency
  useEffect(() => {
    if (amount && rates) {
      const newConvertedAmounts = {};
      selectedCurrencies.forEach((currency) => {
        if (rates[currency]) {
          newConvertedAmounts[currency] = (amount * rates[currency]).toFixed(2);
        }
      });
      setConvertedAmounts(newConvertedAmounts);
    } else {
      setConvertedAmounts({});
    }
  }, [amount, selectedCurrencies, rates]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleAmountChange = (text) => {
    if (!isNaN(text) || text === '') {
      setAmount(text);
    } else {
      Alert.alert('Invalid input', 'Please enter a valid number');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCurrencyChange = (currency) => {
    if (selectedCurrencies.includes(currency)) {
      setSelectedCurrencies(selectedCurrencies.filter((item) => item !== currency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  const renderCurrencyOption = ({ item }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => handleCurrencyChange(item.value)}
    >
      <Text style={[styles.checkboxText, { color: isDarkMode ? '#fff' : '#000' }]}>{selectedCurrencies.includes(item.value) ? '✓ ' : ''}{item.label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Currency Converter</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, { color: isDarkMode ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Enter Amount</Text>
      <TextInput
        style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff' }] }
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Base Currency</Text>
      <Picker
        selectedValue={baseCurrency}
        style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff' }]}
        onValueChange={(itemValue) => setBaseCurrency(itemValue)}
      >
        {currencyOptions.map((currency) => (
          <Picker.Item key={currency.value} label={currency.label} value={currency.value} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Select Target Currencies</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Currencies</Text>
            <FlatList
              data={currencyOptions}
              renderItem={renderCurrencyOption}
              keyExtractor={(item) => item.value}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} color={isDarkMode ? '#fff' : '#000'} />
          </View>
        </View>
      </Modal>

      {selectedCurrencies.map((currency) => (
        <View key={currency} style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: isDarkMode ? '#fff' : '#000' }]}>
            {currency}: {convertedAmounts[currency] || 'N/A'}
          </Text>
        </View>
      ))}

     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    justifyContent: 'center',
    top:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
  resultContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 0,
    borderRadius: 5,
    borderWidth: 0.5, // Set the border width
    borderColor: '#D3D3D3', // Light grey border color
    // Optional: Add a background color
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    padding: 10, // Optional: Adjust padding as needed
    borderRadius: 10, 
  },
  resultText: {
    fontSize: 18,
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 18,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default App;
