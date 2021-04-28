import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './components/Splash';
import LoginScreen from './components/LoginScreen';
import MainSceenWrapper from './components/MainScreenWrapper';
import NfcEvents from './components/NFCEvents';
import linkingConfig from './components/DeepLinkingConfig';
import TimestampToggler from './components/TimestampToggler';


const App = () => {


  const Stack = createStackNavigator();
  return (
    <NavigationContainer linking={linkingConfig}>
      <NfcEvents/>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainSceenWrapper" component={MainSceenWrapper}/>
        <Stack.Screen name="TimestampToggler" component={TimestampToggler}/>
      </Stack.Navigator>
    </NavigationContainer>
  );

};

export default App;