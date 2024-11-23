import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultDisplay = ({ amount, baseCurrency, convertedAmount, targetCurrency }) => {
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>
        {amount} {baseCurrency} = {convertedAmount} {targetCurrency}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultDisplay;
