import React, {useState, useRef, useEffect, createContext} from 'react';
import {Text, View,StatusBar,ScrollView} from 'react-native';

import Header from './Header';
import TimestampForm from './TimestampForm';
import ListView from './ListView';

import {styles} from './StyleSheet';
import {AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk';


export const UtilityContext = createContext();

export default MainScreenWrapper = (props) => {

  console.log("!!!!Inside MainScreenWrapper!!!!");

  const scrollRef=useRef();
  const [userDetails, setuserDetails] = useState([]);

  
  fetchUserDetailsFromFacebook = (error, result) => {
    console.log("Fetching User details for the current user from Facebook API!!!");
    if(!error)
    {
      setuserDetails({userId: result.id, profilePicURL: result.picture.data.url });
      console.log("User Details Set");
    }
    else
    {
      setuserDetails({userId: 20130, profilePicURL: "https://i.picsum.photos/id/459/200/300.jpg?hmac=4Cn5sZqOdpuzOwSTs65XA75xvN-quC4t9rfYYyoTCEI" });
    }
  };


  useEffect(() => {
    AccessToken.getCurrentAccessToken()
    .then(data => {
      
      const processRequest = new GraphRequest('/me?fields=name,picture.type(large)',null,fetchUserDetailsFromFacebook);
      // Start the graph request(sync call).
      new GraphRequestManager().addRequest(processRequest).start();
    })


  }, []);



  if(userDetails.userId !=null)
  {
    return(
      <UtilityContext.Provider value={{scrollRef, userDetails}} >
        <ScrollView ref={scrollRef} stickyHeaderIndices={[1]}>
            <StatusBar barStyle="dark-content" />
            <Header/>
            <TimestampForm/>
            <ListView navigation={props.navigation}/>
        </ScrollView>
      </UtilityContext.Provider>
    );

  }
  
  else
  {
    return(
      <View style={[styles.screen, styles.redBackground]}>
        <Text>{"\n\n\n\n"}</Text>
        <Text style={[styles.text, styles.whiteText, {fontSize: 20}]}>
          getting user details from facebook...
        </Text>
      </View>
    )
  }

};