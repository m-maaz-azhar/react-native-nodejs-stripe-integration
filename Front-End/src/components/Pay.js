import React from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Pay(props) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const {amount, oldCustomer} = props.route.params;

  const fetchPaymentSheetParams = async () => {
    let customer_id = oldCustomer ? 'cus_LhXjs3OdJEgCKG' : null;
    try {
      const response = await fetch(
        'https://cab1-182-189-119-148.eu.ngrok.io/payment-sheet',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: {price: amount * 100},
            customer_id,
          }),
        },
      );
      const {paymentIntent, ephemeralKey, customer} = await response.json();

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (e) {
      console.log('\n\n\n ======> \n ', e);
      return {
        paymentIntent: '',
        ephemeralKey: '',
        customer: '',
      };
    }
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Zeeshan Khan',
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Payment Error: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{color: '#000', paddingLeft: 10, paddingTop: 10}}>
        {amount}
      </Text>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}
