import React, { Component } from "react";
import { View, Text } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPost, fetchUserFollowing } from "../redux/action/index";
import firebase from "firebase/app";
import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/search"

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
  return null;
};
export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserPost();
    this.props.fetchUserFollowing();
  }
  render() {
    return (
      <Tab.Navigator initialRoutename="Feed">
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          component={EmptyScreen}
          listeners={({navigation})=>({
            tabPress: event =>{
              event.preventDefault();
              navigation.navigate("Add")
            }
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          navigation={this.props.navigation}
          listeners={({navigation})=>({
            tabPress: event =>{
              event.preventDefault();
              navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
            }
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            ),
          }}
        />
         <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser,fetchUserPost, fetchUserFollowing }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
