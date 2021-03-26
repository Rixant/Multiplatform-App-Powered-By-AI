import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { fetch, decodeJpeg, bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import React, {useState} from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
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
       

export default function Covid(){
            
            const [url, setUrl]= useState('https://oceana.org/sites/default/files/tiger_shark_0.jpg')
            const [displayText, setDisplayText] = useState('???')
            const [filePath, setFilePath] = useState({});
        
            
        
          
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
                            <Text  style={{ ...FONTS.h3 }}> COVID VS PNEUMONIA  </Text>
                               
                                </View>
                            </View>
            
                           
                  </View>
                )
            }


            const modelJson = require('../assets/model4/model.json');
            const modelWeights = require('../assets/model4/weights.bin');

          
            

    async function getPrediction(url){
                // setDisplayText("Loading Tensor Flow")
                setDisplayText("Loading ...")

                const ul = await resizeImage(url,224,224)
                await tf.ready()

            

                setDisplayText("Loading model..")
                
                const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
                
          
                setDisplayText("Image fetching ...")
           
                const response =await fetch(ul.uri, {}, { isBinary : true});
                setDisplayText("Processing..")

                
          
                const imageData = await response.arrayBuffer();
                setDisplayText("Processing...")

             

                const imageTensor = imageToTensor(imageData);
                setDisplayText("Loading Result...")
           
                const prediction = await model.predict(imageTensor);
                const preds=prediction.dataSync()

       
              
          
        
                
              
                setDisplayText(JSON.stringify(preds))   
            
              }
            
          


       






    async function resizeImage(imageUrl, width, height){
              const actions = [{
                resize: {
                  width,
                  height,
                
                  
                },
              }];
              const saveOptions = {
                compress: 0.75,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true,
              };
              const res = await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
              return res;
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

              return tf.tensor4d(buffer, [1,224, 224, 3])

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
                    marginLeft: SIZES.padding2*4}}
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
                    <Text  style={{marginTop:SIZES.padding2*2,  ...FONTS.h5 }}>{displayText}</Text>
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
                width: 300,
                height: 200
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



       


     

