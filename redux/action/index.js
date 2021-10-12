import firebase from "firebase/app";
import { USER_STATE_CHANGE } from "../constants/index";
import 'firebase/firestore';

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
          console.log('snapshot', snapshot.data());
        } else {
          console.log("does not exist");
        }
      });
  };
}
