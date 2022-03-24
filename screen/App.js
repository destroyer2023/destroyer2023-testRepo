import 'react-native-gesture-handler';

import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler, Alert } from "react-native";
import {AlertGetData, SharedGetUserSessionData} from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './Login'
import BaseScreen from './BaseScreen'


export default function App({ props }) {

  // sayfa render edildikten sonra donanım üzerinde back tuşunu dinlemek için gerekli Listener metodlarını yerleştirdim. Ve devamını aşağıda tanımladım.( satır 20)
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

  // burada Uygulamanın X sayfasında cihazın menü tuşu kullanılırsa kulanıcıya uygulamadan çıkmak üzere olduğunu bir mesaj ile bildirdim.
  const backActionHandler = () => {

    Alert.alert(AlertGetData.messageHeader, AlertGetData.messageBody, [
      {
        text: AlertGetData.messageButtonCancel,
        onPress: () => null,
        style: AlertGetData.messageButtonStyleCancel
      },
      {
        text: AlertGetData.messageButtonOk, onPress: () => {
          AsyncStorage.setItem("@"+SharedGetUserSessionData.id,  "")
          BackHandler.exitApp()
        }
      }
    ]);
    return true;
  }


  const Stack = createNativeStackNavigator();

  // uygulamada sol menü olmayacağından olabildiğince basit yaklaştım ve az sayıdaki sayfalarımızı bir stack yıgınına aldım (Login ve BaseScreen(anasayfa)) Uygulama Default olarak Login ekranından başlar.
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
          initialParams={{ delete: 0 }}
        />
        <Stack.Screen
          name="BaseScreen"
          component={BaseScreen}
          options={{
            headerShown: false,
          }}
          initialParams={{ delete: 0 }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
