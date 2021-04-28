import React, {useContext} from 'react';
import {LoginButton} from 'react-native-fbsdk';
import database from '@react-native-firebase/database';


export default FBLoginButton = (props) => {


  return(
    <LoginButton 
      publishPermissions={["email"]}
      onLoginFinished=
      {
        (error, result) => {
          if (error) {
            alert("Login failed with error: " + error.message);
            console.log("User pressed Login Button and landed upto error"+JSON.stringify(error));
            console.log(error);
          } 
          else if (result.isCancelled) {
            alert("User pressed Login Button and then somehow Login was cancelled");
            console.log("User pressed Login Button and then somehow Login was cancelled");
          } 
          else{
            console.log("User pressed Login Button and login was successful!!");
            props.navigation.replace('MainSceenWrapper');
          }
        }
      }


      onLogoutFinished=
      {
        () => {
          console.log("User is logging out!!");
        }
      }

      
    />

  )
}