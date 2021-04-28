import * as React from 'react';
import {View, Text } from 'react-native';
import {styles} from './StyleSheet';

export default function Splash({navigation}) {

    setTimeout(() =>{
        navigation.replace('LoginScreen');
    }, 4000);

  return (
    <View style={[styles.screen, styles.redBackground]}>

        <Text style={[styles.text, styles.whiteText, styles.boldText, {fontSize: 100}]}>
           CGI
        </Text>

    </View>
  );
}