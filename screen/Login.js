/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';

import { Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const axios = require('axios');
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import AwesomeAlert from 'react-native-awesome-alerts';
import { ErrorText, ProgressText, SharedGetUserSessionData, TextButton_, TextInput_, TextLabel_, UrlAll } from './Config';
import { blue, loginStyle } from './Styles_';
import { TextInput } from 'react-native-gesture-handler';


const App = ({ navigation }) => {

  const [paramProgress, setparamProgress] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [isValid, setisValid] = useState(true);
  const [paramAlert, setparamAlert] = useState(false);
  const [paramAlertinfo, setparamAlertinfo] = useState("info");
  const [paramAlertMsg, setparamAlertMsg] = useState("");

  // kullanıcının kritik olmayan bazı oturum bilgilerini local'de saklıyoruz. 
  // Dolayısı ile sayfa render edildikten sonra kullanıcının uygulamadan oturumunu kapatarakmı yoksa kapatmadanmı çıktığını tespit edip ,
  // tekrar login olmasını yada çıkış yapılmamışsa direkt olarak BaseScreen'e (Ana sayfaya) gitmesini sağlıyoruz  

  const __isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {

    let userData = [
      "@" + SharedGetUserSessionData.id,
      "@" + SharedGetUserSessionData.name,
      "@" + SharedGetUserSessionData.email,
      "@" + SharedGetUserSessionData.created_at,
      "@" + SharedGetUserSessionData.updated_at,
      "@" + SharedGetUserSessionData.token,
    ]

    AsyncStorage.multiGet(userData)
      .then(values => {
        console.log(values)

        // null yada 0 ise çıkış yapılmıştır yada ilk kurulumdur. değilse uygulamayı ana sayfaya yönlendiriyoruz.
        if (values[0][1] !== null && values[0][1] !== "0" && values[0][1] !== "") {
          navigation.navigate("BaseScreen", { data: values })
        }

      })
      .catch(err => console.log(err))
  }, []);

  const __doLogin = () => {

    // email ve parola kontrolü yapıyoruz
    if (!email) {
      seterror(ErrorText.labelERROR_A)
      setisValid(false)
      return
    } else if (password.length < 5) {
      seterror(ErrorText.labelERROR_B)
      setisValid(false)
      return

    } else if (!__isValidEmail(email)) {
      seterror(ErrorText.labelERROR_C)
      setisValid(false)
      return
    }
    // email ve parola için sorun yoksa  login işlemini başlatıyoruz
    setparamProgress(true)
    __doSingIn(email, password);

  }

  const __doSingIn = () => {

    var Data = {
      "email": email,
      "password": password,
    };

    var config = {
      url: UrlAll.UrlEmployessToken,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: Data
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser = JSON.parse(JSON.stringify(response.data));
        console.log(jsondata_parser)
        try {
          console.log("email")

          // login olduğumuzda bize dönen email adresi bizim girdiğimiz email ile eşitse login olmuşuz demektir 
          // ve akabinde gelen token ile verification işlemini başlatıyoruz
          if (jsondata_parser.user.email === email) {

            Data = {
              "api_token": jsondata_parser.token
            };

            config = {
              url: UrlAll.UrlEmployessTokenVerification,
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + jsondata_parser.token
              },
              data: Data
            };

            axios(config)
              .then(function (response) {
                setparamProgress(false)
                setparamProgress(false)
                setparamProgress(false)

                let jsondata_parser_ = JSON.parse(JSON.stringify(response.data));
                console.log(jsondata_parser)
                try {
                  console.log("email")
                  if (jsondata_parser.token === jsondata_parser_.token) {

                    // burada gelen token ve gönderdiğimiz token eşitmi buna bakıyoruz. eşitlik varsa datalarımızı local'e kayıt yaparak ana sayfaya geçiyoruz
                    console.log("data ok")

                    AsyncStorage.setItem("@" + SharedGetUserSessionData.id, String(jsondata_parser_.user.id))
                    AsyncStorage.setItem("@" + SharedGetUserSessionData.name, jsondata_parser_.user.name)
                    AsyncStorage.setItem("@" + SharedGetUserSessionData.email, jsondata_parser_.user.email)
                    AsyncStorage.setItem("@" + SharedGetUserSessionData.created_at, jsondata_parser_.user.created_at)
                    AsyncStorage.setItem("@" + SharedGetUserSessionData.updated_at, jsondata_parser_.user.updated_at)
                    AsyncStorage.setItem("@" + SharedGetUserSessionData.token, jsondata_parser_.token)

                    console.log(jsondata_parser.token)
                    console.log(jsondata_parser_.token)

                    navigation.navigate("BaseScreen",
                      {
                        data:
                          [
                            ["id", jsondata_parser.user.id],
                            ["name", jsondata_parser.user.name],
                            ["email", jsondata_parser.user.email],
                            ["created_at", jsondata_parser.user.created_at],
                            ["updated_at", jsondata_parser.user.updated_at],
                            ["token", jsondata_parser.token],
                          ]
                      }
                    )

                  } else {
                    __Message(ErrorText.labelERROR_G)
                  }
                } catch (error) {
                  __Message(ErrorText.error)
                }
              })
              .catch(function (error) {
                __Message(ErrorText.labelERROR_D)

              });

            console.log(jsondata_parser.token)
          } else {
            __Message(ErrorText.labelERROR_G)
          }
        } catch (error) {
          __Message(error)
        }

      })
      .catch(function (error) {
        setparamProgress(false)
        __Message(ErrorText.labelERROR_D)
      });
  }

  const __Message = (msj) => {
    setparamProgress(false)

    setparamAlertinfo('danger')
    setparamAlertMsg(msj)
    setTimeout(() => {
      setparamAlert(true)
    }, 200);
  }
  const __handleClose = () => {
    setparamAlert(false)
  }

  return (
    <View style={loginStyle.containerStyle}>
      <View style={loginStyle.headerContainerStyle}>
        <Text style={{ color: "red", fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' }}>{TextLabel_.labelGirisYap}</Text>
      </View>
      <View style={loginStyle.formContainerStyle}>
        <TextInput
          label={TextInput_.label}
          keyboardType={TextInput_.keyboardType}
          style={loginStyle.textInputStyle}
          placeholder={TextInput_.text}
          onChangeText={text => {
            setisValid(__isValidEmail(text))
            setemail(text)
          }}
          error={isValid}
        />
        <TextInput label={TextInput_.parola}
          secureTextEntry
          style={loginStyle.textInputStyle}
          selectionColor={blue}
          placeholder={TextInput_.parola2}
          error={isValid}
          onChangeText={text => setpassword(text)} />
      </View>

      {error ? (
        <View style={loginStyle.errorLabelContainerStyle}>
          <Text style={loginStyle.errorTextStyle}>{error}</Text>
        </View>
      ) : null}

      <View style={loginStyle.signInButtonContainerStyle}>
        <TouchableHighlight style={loginStyle.signInButtonStyle} onPress={() => __doLogin()} underlayColor={blue}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around"
            }}>
            <Text style={{ color: "red", fontSize: 16, fontStyle: 'italic', fontWeight: 'bold' }}>{TextButton_.buttonDevam}</Text>
          </View>
        </TouchableHighlight>
      </View>

      <AwesomeAlert
        show={paramProgress}
        showProgress={true}
        progressSize="large"
        message={ProgressText.labelPROGRESS_A}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
      <SCLAlert
        show={paramAlert}
        theme={paramAlertinfo}
        onRequestClose={__handleClose}
        title={""}
        subtitle={paramAlertMsg}
        slideAnimationDuration={90}
        cancellable={false}>

        <SCLAlertButton theme="info" onPress={() => setparamAlert(false)}>{TextButton_.buttonTamam}</SCLAlertButton>
      </SCLAlert>
    </View>
  );
};

export default App;
