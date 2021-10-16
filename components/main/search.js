import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

import firebase from "firebase/app";
import "firebase/firestore";
export default function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUser = (search) => {
    firebase
      .firestore()
      .collection("user")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let Users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        console.log("Users", Users);
        setUsers(Users);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Type Here"
        onChangeText={(search) => fetchUser(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Profile", { uid: item.id })
              }
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
