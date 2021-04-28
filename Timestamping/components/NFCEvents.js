import React, {useEffect} from 'react';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Moment from 'moment';


import database from '@react-native-firebase/database';

const NFCEvents = () => {


    // Pre-step, call this before any NFC operations
    async function initNfc() {
        await NfcManager.start();
    }

    const cleanUp = () => {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    };


    //Nothing to do with NFC. Just Firbase Update Work
    const timestampTableUpdate = async (newStatus, newId) =>{
        console.log("Updating status in Firebase after NFC Read!");
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
       
      }
      
  
  function readNdef() {
        return new Promise((resolve) => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
                //tag has all tag details
                resolve(tag);
                console.log("!!!!!!!!!!!!!!!NFC Found!!!!!!!!!!!!!!!!!!");
                timestampTableUpdate();
            });
        
            NfcManager.registerTagEvent();
        });
    }

    useEffect(() => {
        console.log("Starting NFC....");
        initNfc().then(()=>{
            console.log("NFC Started. Reading Tag!!");
            readNdef();
          }).catch((error)=>{
            console.log("Error!!"+ error);
          })
        
    }, []);

    return(
        <></>
    );

  };
  
  export default NFCEvents;