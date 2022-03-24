import { StyleSheet } from 'react-native';

/* Styles Login Screen*/

export const baseMargin = 5;
export const doubleBaseMargin = 10;
export const blue = "#ff0000";

export const loginStyle = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: "space-around"
    },
    headerContainerStyle: {
        flex: 0.2,
        alignItems: "center"
    },
    headerTitleStyle: {
        color: blue,
        fontSize: 30,
        fontWeight: "bold"
    },
    formContainerStyle: {
        paddingHorizontal: doubleBaseMargin,
        justifyContent: "space-around"
    },
    textInputStyle: {
        height: 60,
        marginVertical: baseMargin,
        borderRadius: 6,
        paddingHorizontal: doubleBaseMargin,
        backgroundColor: "transparent",
        borderColor: "#888",
        borderWidth: 1
    },
    errorLabelContainerStyle: {
        flex: 0.1,
        alignItems: "center",
        justifyContent: "center"
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center"
    },
    signInButtonContainerStyle: {
        flex: 0.3,
        marginTop: doubleBaseMargin,
        alignItems: "flex-end",
        paddingHorizontal: baseMargin
    },
    signInButtonStyle: {
        width: 130,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 130 / 4,
        alignItems: "center",
        backgroundColor: "white"
    },
})

export const baseScreenStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212732' },
    header: { height: 50, backgroundColor: '#537791' },
    textHeader: { textAlign: 'center', fontWeight: '100', color: '#fefefe' },
    textFooter: { textAlign: 'left', fontWeight: '100', color: '#fefefe', padding: 5 },
    dataWrapper: { marginTop: -1 },
    touchable: { borderColor: 'black', borderWidth: 0.5, borderRadius: 1 },
    touchable2: { width: 40, borderColor: 'white', borderWidth: 0.5, borderRadius: 90 },
    touchable3: { borderColor: 'white', borderWidth: 0.5, borderRadius: 90, backgroundColor: 'black', height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '100%' },
    MainContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
  
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
    item: {
      width: 60,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    itemText: {
      fontSize: 30,
      color: 'white',
      textAlign: 'center'
    },
    btn: {
      borderRadius: 5,
      backgroundColor: 'orange',
      height: 30,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonStyle: {
      backgroundColor: '#C8161D',
      width: '100%',
      top: 20,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    buttonTextStyle: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      width: '100%'
    },
    touchStyle: {
      backgroundColor: '#fff',
      borderRadius: 5,
      borderColor: '#000',
      height: 50,
      width: '100%',
      top: 10
    },
    TextInput: {
      height: 30,
      top: 5,
      flex: 1,
      padding: 5,
      marginLeft: 2,
      color: 'black'
    },
    cardShadow: {
      marginLeft: 10,
      marginRight: 10,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      marginBottom: 10,
      elevation: 10,
      borderRadius: 5
    }
    ,
    cardShadow2: {
      width: '90%',
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      marginBottom: 10,
      elevation: 10,
      borderRadius: 5
    },
    bottomContent: {
      justifyContent: 'center', left: 10, alignContent: 'center', width: '100%', height: '70%'
    },
    bottomInputText: {
      top: 20, padding: 10, width: '100%'
    }
  });