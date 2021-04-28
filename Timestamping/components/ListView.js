import React, {useState, useEffect, useContext} from 'react';
import {Text, Dimensions, ScrollView, View} from 'react-native';
import { Avatar, Button, IconButton, Colors } from 'react-native-paper';
import {styles} from './StyleSheet';
import database from '@react-native-firebase/database';
import { UtilityContext } from './MainScreenWrapper';
import Moment from 'moment';

const ListView = () => {
  console.log("!!!!Inside ListView!!!!");

  const [timestampsList, setTimestampsList] = useState([]);
  let {scrollRef, userDetails}=useContext(UtilityContext);

  useEffect(() => {
    console.log("Getting List of all activities for user from FireDB....");
    try
    {
      database().ref('/timestamps_info/20130')
      .on('value', (snapshot) => {
          let data = snapshot.val();
          setTimestampsList(data);
      })
      .then(()=>{
        console.log("Feteched timestamps list from FireDB!!");
      }).catch ((error)=>{
        console.log(error);
      }) 
    }
    catch(e)
    {
      
    }
  }, []);



  const deleteTimestamp = async (timestampId) =>{
        await database().ref("/timestamps_info/20130/"+timestampId).remove()
        .then(()=>{
            console.log("Timestamp deleted from firebase DB!!");
        })
    }


  
  if(timestampsList!=null && Object.keys(timestampsList).length>0 )
  {
    console.log("Preparing Timestamp List View!!!");
    return(
        <ScrollView style={[styles.container, styles.whiteBackground]} decelerationRate={0} snapToAlignment={"center"} contentInset={{top: 0,left: 0,bottom: 0,right: 0,}} >
            <Text>{"\n"}</Text>
            <Text style={[styles.text, styles.grayText, styles.boldText, {fontSize: 22}]}>
                Your Timestamps
            </Text>
            {
                Object.keys(timestampsList).map(key => 
                    <View key={key} style={[styles.card, {backgroundColor: timestampsList[key].outTime!=null ? '#32a89b' : "#e21234"}]}>
                        
                        <Avatar.Image size={40} source={{ uri:userDetails.profilePicURL }}/>
                        
                        <Text style={[styles.cardText, styles.boldText]} >
                            {Moment(timestampsList[key].inTime, 'DD.MM.YYYY HH.mm').format('DD.MM.YYYY HH.mm')}
                        </Text>

                        <Text style={[styles.cardText, {fontSize: 16}]} >
                          {Moment(timestampsList[key].inTime, 'DD.MM.YYYY HH.mm').format('HH.mm')}
                            -
                          {timestampsList[key].outTime!=null ? Moment(timestampsList[key].outTime, 'DD.MM.YYYY HH.mm').format('HH.mm') : ""}
                        </Text>

                        <IconButton icon="delete" color={Colors.white} size={20} onPress={() => deleteTimestamp(key)} />
                    </View>
                )
            }
        </ScrollView>
    );
}

return(
  <View style={[styles.screen, styles.blueBackground]}>
        <Text style={[styles.text, styles.whiteText, {fontSize: 16}]}>
            fetching timestamps list from firebase... 
        </Text>
    </View>
)

  

};

export default ListView;