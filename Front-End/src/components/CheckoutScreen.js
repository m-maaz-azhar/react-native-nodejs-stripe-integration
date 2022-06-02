import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

function CheckoutScreen({navigation}) {
  const [amount, setAmount] = useState(0);
  const [oldCustomer, setOldCustomer] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
      <Text style={{color: '#000', marginTop: 20}}>AMOUNT ($): </Text>
      <TextInput
        style={{
          color: '#000',
          borderBottomColor: '#000',
          borderBottomWidth: 2,
          width: '80%',
        }}
        onChangeText={value => setAmount(Number(value))}
        keyboardType="numeric"
      />
      <Text style={{marginVertical: 20, color: '#000'}}>OLD CUSTOMER : </Text>
      <CheckBox
        disabled={false}
        value={oldCustomer}
        onValueChange={newValue => setOldCustomer(newValue)}
        style={{backgroundColor: '#000'}}
      />
      <TouchableOpacity
        disabled={amount < 1}
        style={{backgroundColor: '#404040', padding: 10, marginVertical: 10}}
        onPress={() => navigation.navigate('pay', {amount, oldCustomer})}>
        <Text style={{color: '#fff'}}>CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CheckoutScreen;
