import React, {Component} from 'react';
import {Text,View} from 'react-native';
import {AccessToken} from 'react-native-fbsdk';

import {styles} from './StyleSheet';
import FBLoginButton from './FBLoginButton';

export default LoginScreen = (props) => {
  
  setTimeout(() =>{

      AccessToken.getCurrentAccessToken()
      .then(data => {
       if(data!=null)
       {
         console.log('User has correct access Token Redirecting to MainScreenWrapper!!! Response');
         props.navigation.replace('MainSceenWrapper');
       }
      });

    } , 5000);



  return (

      <View style={[styles.screen, styles.redBackground]}>

        <Text style={[styles.boldText, styles.whiteText, {fontSize: 32}]}>
          You need to login first 
        </Text>
        
        <Text>{"\n"}</Text>
        
        <FBLoginButton navigation={props.navigation}/>

      </View>
  
  );
};