import React from 'react';
import Moment from 'moment';

import {Text, View} from 'react-native';
import {styles} from './StyleSheet';


import database from '@react-native-firebase/database';

const TimestampToggler = (props) => {

    console.log("!!!!Inside TimestampToggler!!!!");

    //Toggle timestamp as soon this compoent is loaded
    console.log("Recieved Deep Linkk!!Toggling state at Firebase side");
        let status="", last_timestampId="";

        database().ref('/meta_info/20130')
        .once('value', (snapshot) => {
            let data = snapshot.val();
            console.log("Current Status="+data.status);
            status=data.status;
            last_timestampId=data.last_timestampId;
        })
        .then(()=>{
            console.log("Feteched current status of user from Firebase!!");

            if(status==="out")
            {
                console.log("User did IN. creating new entry in Firebase");
                var operation = database().ref("/timestamps_info/20130/").push()
                operation.child("/").set({inTime: Moment(new Date()).format('DD.MM.YYYY HH.mm')})
                .then(() =>{
                    console.log("Successfully added new entry for Timestamp in Firebase DB with id:"+operation.key);
                    last_timestampId=operation.key;
                })
            }
            else if(status==="in")
            {
                console.log("User did OUT. Updating last timestamp with id:"+last_timestampId);
                database().ref("/timestamps_info/20130/"+last_timestampId)
                .update(
                {
                    "outTime": Moment(new Date()).format('DD.MM.YYYY HH.mm')
                }
                )
                .then(()=>{
                    console.log("Updated OUT time in Firebase DB!!");
                })
            }
            else
            {
                console.log("Unknown Opeartion in FireDB"+status);
            }


            console.log("Updating Meta_info table with new status!!");
            database().ref("/meta_info/20130")
            .update(
              {
                status: status==="out" ? "in" : "out",
                last_timestampId: last_timestampId
              }
            )
            .then(()=>{
              console.log("Updated Meta Info in Fire DB!!");
            })    
        })



    setTimeout(() =>{
        props.navigation.replace('MainSceenWrapper');
        } , 5000);

    return(
        <View style={[styles.screen, styles.blueBackground]}>

        <Text style={[styles.boldText, styles.whiteText, {fontSize: 20}]}>
          Handling your timestamp!! You will be redirected after this..
        </Text>

      </View>
    );

  };
  
  export default TimestampToggler;