import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  TextInput,
  Button
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

import * as jpeg from 'jpeg-js';
           
  

export default function MobileNet(){
                
                const [url, setUrl]= useState('https://oceana.org/sites/default/files/tiger_shark_0.jpg')
                const [displayText, setDisplayText] = useState('')
  
    const chooseFile = (type) => {
                  let options = {
                    mediaType: type,
                    maxWidth: 300,
                    maxHeight: 550,
                    quality: 1,
                  };
                  launchImageLibrary(options, (response) => {
                    console.log('Response = ', response);
              
                    if (response.didCancel) {
                      alert('User cancelled camera picker');
                      return;
                    } else if (response.errorCode == 'camera_unavailable') {
                      alert('Camera not available on device');
                      return;
                    } else if (response.errorCode == 'permission') {
                      alert('Permission not satisfied');
                      return;
                    } else if (response.errorCode == 'others') {
                      alert(response.errorMessage);
                      return;
                    }
                    console.log('base64 -> ', response.base64);
                    console.log('uri -> ', response.uri);
                    console.log('width -> ', response.width);
                    console.log('height -> ', response.height);
                    console.log('fileSize -> ', response.fileSize);
                    console.log('type -> ', response.type);
                    console.log('fileName -> ', response.fileName);
                    setUrl(response);
                  });
                };
                

    function renderHeader(){
                    return(
                
                        <View style={{ flexDirection: 'row', height: 50 }}>
                
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View
                                    style={{
                                        width: '100%',
                                        height: "100%",
                                        backgroundColor: 'orange',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                       
                                    }}>
                                <Text  style={{ ...FONTS.h3 }}> MobileNet Image Classification  </Text>
                                   
                                    </View>
                                </View>
                
                               
                      </View>
                    )
                }

    async function getPrediction(url){
                    // setDisplayText("Loading Tensor Flow")
                    setDisplayText("Loading ...")
                    await tf.ready()

                    setDisplayText("Processing ...")
                    
                    const model= await mobilenet.load()
                    setDisplayText("Processing");

               
                    const response =await fetch(url.uri, {}, { isBinary : true});
                    setDisplayText("Processing")
              
                    const imageData = await response.arrayBuffer();
                    setDisplayText("Processing")
  
                    const imageTensor = imageToTensor(imageData);
                    setDisplayText("Loading Result")
               
                    const prediction = (await model.classify(imageTensor));
             
                  
                
                    setDisplayText(JSON.stringify(prediction[0]["className"]))
                  


                }



    function imageToTensor(rawData){
                    const {width, height, data}= jpeg.decode(rawData, true)
                    const buffer = new Uint8Array(width*height*3)
                    let offset = 0;
                    for(let i=0; i<buffer.length; i+=3){
                        buffer[i]=data[offset]
                        buffer[i+1]=data[offset+1]
                        buffer[i+2]=data[offset+2]
                        offset +=4

                    }

                    return tf.tensor3d(buffer, [height, width, 3])

                }

    return(
                    <SafeAreaView >
                        <View>
                        {renderHeader()}
                        </View>
                        <Text  style={{ marginTop:SIZES.padding2*4, alignItems:'center', justifyContent:'center',...FONTS.h1 }}> Welcome to Deep Learning </Text>
                        <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: SIZES.padding2*6
                        }}
                        >

                         <View >
 
                          <Image
                            source={{uri: url.uri}}
                            style={styles.imageStyle}
                          />
                        
                          <TouchableOpacity
                            activeOpacity={0.5}
                            style={{width: 212,
                            height:38,
                            backgroundColor:'orange',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: SIZES.radius,
                            marginTop: SIZES.padding2*4,
                          marginLeft: SIZES.padding2*5.5}}
                            onPress={() => chooseFile('photo')}>
                            <Text style={styles.textStyle}>Choose Image</Text>
                          </TouchableOpacity>
                          
                        </View>
   
                        <TouchableOpacity
                                style={{
                                    width: "50%",
                                    backgroundColor:'orange',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius,
                                    marginTop: SIZES.padding2*4,
                                }} 
                                >
                    <Button title="Classify" color={COLORS.white}  onPress={() => getPrediction(url.uri)} style={{ ...FONTS.h3 }}></Button>
                       
                    </TouchableOpacity>
                    <Text  style={{marginTop:SIZES.padding2*2,  ...FONTS.h3 }}>RESULT:</Text>
                    <Text  style={{marginTop:SIZES.padding2*2,  ...FONTS.h3 }}>{displayText}</Text>
                    </View>
                        
                 </SafeAreaView>
                )
                
            }
        

    const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: COLORS.lightGray4
                },
                container1:{
                    flex:2,
                    alignItems: 'center',
                    justifyContent: 'center'

                },
                shadow: {
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 1,
                },buttonStyle: {
                    color: 'red',
                    marginTop: 20,
                    padding: 20,
                    backgroundColor: 'green'
                },
                imageStyle:{
                    width: 350,
                    height: 250
                },
                buttonStyle:{
                    backgroundColor:'orange',
                    width: '50%'
                },
                textStyle:{
                    color:'white',
                   ...FONTS.h4

                }
            })



           


           