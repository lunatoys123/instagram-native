import React, { Component } from "react";
import { View, Button, TextInput } from "react-native";
import * as firebase from "firebase";
export class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <View>
        <TextInput
          placeholder="name"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          secureTextEntry={true}
        />
        <Button
          onPress={() => {
            this.onSignUp();
          }}
          title="Sign up"
        />
      </View>
    );
  }
}

export default login;
