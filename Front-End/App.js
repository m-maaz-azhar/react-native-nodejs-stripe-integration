import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StripeProvider} from '@stripe/stripe-react-native';
import Pay from './src/components/Pay';
import CheckoutScreen from './src/components/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51L03C8C28HUvnWbWeK51fhEx6fGXK1vLSFos0KPMOBYn1xNRZsM4OsVZnazO0k2fYQKEjmFOa1P5Tz2qLKLVGBPn00c6D6yvbf"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.payment_integration" // required for Apple Pay
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="checkout" component={CheckoutScreen} />
          <Stack.Screen name="pay" component={Pay} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
