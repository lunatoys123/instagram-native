import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/login";
import RegisterScreen from "./components/auth/Register";
import firebase from "firebase/app";
import "firebase/auth";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/Reducer";
import thunk from "redux-thunk";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/save";

const store = createStore(rootReducer, applyMiddleware(thunk));
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
    super();
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

    // if (!loggedIn) {
    //   <NavigationContainer>
    //     <Stack.Navigator initialRoutename="Landing">
    //       <Stack.Screen
    //         name="Landing"
    //         component={LandingScreen}
    //         options={{ headerShown: false }}
    //       />
    //       <Stack.Screen name="Register" component={RegisterScreen} />
    //     </Stack.Navigator>
    //   </NavigationContainer>;
    // }
    return (
      <Provider store={store}>
        {loggedIn == true ? (
          <NavigationContainer>
            <Stack.Navigator initialRoutename="Main">
              <Stack.Screen
                name="Main"
                component={MainScreen}
               
              />
              <Stack.Screen
                name="Add"
                component={AddScreen}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="Save"
                component={SaveScreen}
                navigation={this.props.navigation}
              />

            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Stack.Navigator initialRoutename="Landing">
              <Stack.Screen
                name="Landing"
                component={LandingScreen}
               
              />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </Provider>
    );
  }
}

export default App;
