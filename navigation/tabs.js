// import all the required libraries
import React from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator, BottomTabBar} from "@react-navigation/bottom-tabs"
import { Covid, MobileNet}  from "../screens"
import { COLORS, icons } from '../constants'


//initialize the bottom tab navigator
const Tab = createBottomTabNavigator();



const Tabs = () => {
    return (
        <Tab.Navigator >

            {/* Screen 1: screen for Mobilenet */}
            <Tab.Screen
                name="MobileNet"
                component={MobileNet}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.robot}
                            resizeMode="contain"
                            style={{
                                width: 35,
                                height: 35,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    )
                }} 
            />

            {/*  Screen 2: screen for covid */}
            <Tab.Screen
                name="Covid"
                component={Covid}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.doctor}
                            resizeMode="contain"
                            style={{
                                width: 35,
                                height: 35,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    )
                }} 
            />

        </Tab.Navigator>

    )//end return
}//end Tabs Function



export default Tabs;