// import all required libraries
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
          Button} from 'react-native';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';  
import * as jpeg from 'jpeg-js';
import { ScrollView } from 'react-native-gesture-handler';
       


export default function Covid(){
            
    const [url, setUrl]= useState('https://oceana.org/sites/default/files/tiger_shark_0.jpg')
    const [displayText, setDisplayText] = useState('None')
    const [filePath, setFilePath] = useState({});
        
            
        
          
    //function to choose file
    const chooseFile = (type) => {

              //define file attributes
          let options = {mediaType: type,
                         maxWidth: 300,
                         maxHeight: 550,
                         quality: 1,
                        };

              //launch trhe image gallery of device
          launchImageLibrary(options, (response) => {

          console.log('Response = ', response);
          
          if (response.didCancel) {
              alert('User cancelled camera picker');
              return;
          } 
                
          else if (response.errorCode == 'camera_unavailable') {
              alert('Camera not available on device');
              return;
          } 
                
          else if (response.errorCode == 'permission') {
              alert('Permission not satisfied');
              return;
          } 
                
          else if (response.errorCode == 'others') {
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
            

   /** Top Title Bar  */
    function renderHeader(){

        return(
              <View style={{ flexDirection: 'row', height: 50 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{width: '100%',
                            height: "100%",
                            backgroundColor: 'purple',
                            alignItems: 'center',
                            justifyContent: 'center',   
                                }}>
                            
                      {/* title of the screen */}
                      <Text  style={{ ...FONTS.h3 }}> COVID VS PNEUMONIA  </Text>

                  </View>
                </View>   
              </View>
                )
            } //end renderHeader



    // path to model
    const modelJson = require('../assets/model4/model.json');
    const modelWeights = require('../assets/model4/weights.bin');

    
    /** async function to load model and predict the image */
    async function getPrediction(url){
         
        setDisplayText("Loading ...")

        const ul = await resizeImage(url,224,224)
        await tf.ready()

        //combine model weights
        setDisplayText("Loading model..")
        const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
                 
        setDisplayText("Image fetching ...")
        const response =await fetch(ul.uri, {}, { isBinary : true});

        setDisplayText("Processing..")
        const imageData = await response.arrayBuffer();

        //convert image into tensor
        setDisplayText("Processing...")
        const imageTensor = imageToTensor(imageData);

        //prediction
        setDisplayText("Loading Result...")
        const prediction = await model.predict(imageTensor);

        //retrieve required data
        const preds=prediction.dataSync()
        setDisplayText(JSON.stringify(preds))   
            
        }//end getPrediction function
            
          

    // preprocess the test image
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




    /** function to convert image into tensor */
    function imageToTensor(rawData){

        //decode the image
        const {width, height, data} = jpeg.decode(rawData, true)

        //create a buffer
        const buffer = new Uint8Array(width*height*3)
        let offset = 0;

        for(let i=0; i<buffer.length; i+=3){
            buffer[i]=data[offset]
            buffer[i+1]=data[offset+1]
            buffer[i+2]=data[offset+2]
            offset +=4
            }

        //return image
        return tf.tensor4d(buffer, [1,224, 224, 3])

        }//end function image to tensor

      
    //main return
    return(
      
      //Scroll View
        <ScrollView>

            {/* Screen Title View */}
            <SafeAreaView  style={styles.container} >
              <View>
                {renderHeader()}
              </View>
            </SafeAreaView>
            {/*End Screen Title View */}


            {/* Welcome Message View */}
            <View style={{ alignItems:'center', justifyContent:'center'}}>
               <Text  style={{ marginTop:SIZES.padding2*4, alignItems:'center', justifyContent:'center',...FONTS.h2 }}> Welcome to Deep Learning </Text>
            </View>
            {/* End Welcome Title View */}


              {/* Body View */}     
            <View style={{alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: SIZES.padding2}}
                          >
                    
                  {/* Display Test Image */} 
                  <Image source={{uri: url.uri}} style={styles.imageStyle} />
                  {/* End Display Test Image */} 
                        

                    {/* Choose File Button View */} 
                    <View>
                      <TouchableOpacity activeOpacity={0.5} style={{width: 200,
                                                                  backgroundColor:'purple',
                                                                  justifyContent: 'center',
                                                                  alignItems: 'center',
                                                                  borderRadius: SIZES.radius,
                                                                  marginTop: SIZES.padding2*2,}}
                                                                >
                           
                            <Button title="Choose Image" color={COLORS.white}  onPress={() => chooseFile('photo')} style={{ ...FONTS.h3 }, {width:"50%"}} ></Button>
                        </TouchableOpacity>       
                    </View>
                    {/* End Choose File Button View */} 
   

                    {/* Classify Button View */} 
                    <View>
                      <TouchableOpacity
                                style={{
                                    width: 200,
                                    backgroundColor:'purple',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius,
                                    marginTop: SIZES.padding2*2,
                                    marginBottom: SIZES.padding2*2,
                                }} 
                                >
                            <Button title="Classify" color={COLORS.white}  onPress={() => getPrediction(url)} style={{ ...FONTS.h3 }}></Button>
                       
                      </TouchableOpacity>
                    </View>
                    {/* End Classify Button View */} 


                {/* Display Result View */}
                <View style={{flex: 1,
                              height: 150}}
                            >

                    <View style={{width: 300,
                                  height: "100%",
                                  backgroundColor: 'purple',
                                  alignItems:'center',
                                  justifyContent:'center',
                                  borderRadius: 10,
                                }}
                                >
                        <Text  style={{flex: 2, color:"white",  ...FONTS.h2}}> Result: </Text>
                        <Text  style={{flex: 2, color:"white", marginTop:SIZES.padding2,  ...FONTS.h4 }}>{displayText}</Text>
                      </View>
                  </View>
                 {/*End  Display Result View */}
                    
            </View>{/* End Body View */}
                        
        </ScrollView>//end ScrollView

      )//end main return

    }//end main function
        

    /** StyleSheet */
    const styles = StyleSheet.create({
                      container: {flex: 1,
                                  backgroundColor: COLORS.primary
                                },

                      container1:{flex:2,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                 },

                      shadow: {shadowColor: "#000",
                                shadowOffset: {width: 0,
                                               height: 3,
                                              },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 1,
                                },

                      buttonStyle: {color: 'red',
                                    marginTop: 20,
                                    padding: 20,
                                    backgroundColor: 'green'
                                    },

                      imageStyle:{width: 350,
                                  height: 250
                                  },
                      
                      buttonStyle:{backgroundColor:'orange',
                                   width: '50%'
                                  },

                      textStyle:{color:'white',
                                 ...FONTS.h4
                                }
                    }         
                  )//end


       


     

