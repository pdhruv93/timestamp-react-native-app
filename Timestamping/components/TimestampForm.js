import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';

import {Text, View, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import {styles} from './StyleSheet';
import Moment from 'moment';

import database from '@react-native-firebase/database';



const TimestampForm = () => {

  console.log("!!!!Inside TimestampForm!!!!");

  let [userMetaInfo, setUserMetaInfo] = useState([]);

  useEffect(() => {
    console.log("Getting current status of User....");

    try
    {
      database().ref('/meta_info/20130')
      .on('value', (snapshot) => {
          let data = snapshot.val();
          console.log("Current Status="+data.status);
          setUserMetaInfo({last_timestampId: data.last_timestampId, status: data.status });
      })
      .then(()=>{
        console.log("Feteched current status of user from Firebase!!");
      }).catch ((error)=>{
        console.log(error);
      }) 
    }
    catch(e)
    {
      
    }
}, []);



const updateStatusInFireDB = async (newStatus, newId) =>{
  console.log("Updating status in Meta Table in Fire DB!!");
  database().ref("/meta_info/20130")
    .update(
      {
        status: newStatus,
        last_timestampId: newId
      }
    )
    .then(()=>{
      console.log("Updated Meta Info in Fire DB!!");
    })    
}




const recordTimestamp = async () =>{
  console.log("Recording Timestamp to DB!!");

  if(userMetaInfo.status==="out")
  {
    console.log("User did IN. creating new entry in Firebase");
    var operation = database().ref("/timestamps_info/20130/").push()
    operation.child("/").set({inTime: Moment(new Date()).format('DD.MM.YYYY HH.mm')})
    .then(() =>{
      console.log("Successfully added new entry for Timestamp in Firebase DB with id:"+operation.key);
      updateStatusInFireDB("in", operation.key);
      setUserMetaInfo({last_timestampId: operation.key, status: "in" });
    })
  }
  else if(userMetaInfo.status==="in")
  {
    console.log("User did OUT. Updating last timestamp with id:"+userMetaInfo.last_timestampId);
    database().ref("/timestamps_info/20130/"+userMetaInfo.last_timestampId)
    .update(
      {
        "outTime": Moment(new Date()).format('DD.MM.YYYY HH.mm')
      }
    )
    .then(()=>{
      console.log("Updated OUT time in Firebase DB!!");
      updateStatusInFireDB("out", userMetaInfo.last_timestampId);
      setUserMetaInfo({last_timestampId: userMetaInfo.last_timestampId, status: "out" });
    })
  }
  else
  {
    console.log("User did unknown operation:"+userMetaInfo.status);
  }
        
}


if(userMetaInfo.status==null || userMetaInfo.status=="")
{
  return(
    <View style={[styles.screen, styles.redBackground]}>
      <Text>{"\n\n\n\n"}</Text>
      <Text style={[styles.text, styles.whiteText, {fontSize: 20}]}>
        connecting to Firebase DB...
      </Text>
    </View>
  )
}
else
{
  return(
      <View style={[styles.screen, styles.redBackground]}>
        <Text>{"\n\n\n\n"}</Text>
        <Text style={[styles.text, styles.whiteText, {fontSize: 20}]}>
          Record your timestamp...
        </Text>

        <Button color="white" mode="contained" style={styles.scrollButton} onPress={() => recordTimestamp()}  >
            {userMetaInfo.status==="out" ? "IN" : "OUT" }
        </Button>
      </View>
  
    )
}
};

export default TimestampForm;