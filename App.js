import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import firebase from "firebase/app";
import 'firebase/auth'
const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAXlbdEM4KWMmj0eM3kam-8iVmPVs5GhRc",
  authDomain: "instagram-native-777d8.firebaseapp.com",
  projectId: "instagram-native-777d8",
  storageBucket: "instagram-native-777d8.appspot.com",
  messagingSenderId: "850818903021",
  appId: "1:850818903021:web:12b7ba1197e8d1b07195e4",
  measurementId: "G-S3VYGTHFT4",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loggedIn: false, loaded: true });
      } else {
        this.setState({ loggedIn: true, loaded: true });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      <NavigationContainer>
        <Stack.Navigator initialRoutename="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>;
    }
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>User is logged In</Text>
      </View>
    );
  }
}

export default App;
