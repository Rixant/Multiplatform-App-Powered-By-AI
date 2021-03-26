import React from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator, BottomTabBar} from "@react-navigation/bottom-tabs"
import { Covid, MobileNet}  from "../screens"
import { COLORS, icons } from '../constants'


const Tab = createBottomTabNavigator();


const Tabs = () => {
    return (
        <Tab.Navigator >
            <Tab.Screen
                name="MobileNet"
                component={MobileNet}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.dog}
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

            <Tab.Screen
                name="Covid"
                component={Covid}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.cat}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    )
                }} 
            />

        </Tab.Navigator>
    )
}


export default Tabs;