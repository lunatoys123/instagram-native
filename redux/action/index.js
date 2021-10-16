import firebase from "firebase/app";
import {
  USER_STATE_CHANGE,
  USER_POST_STATE_CHANGE,
  USER_Following_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POST_STATE_CHANGE,
} from "../constants/index";
import "firebase/firestore";

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
          console.log("snapshot", snapshot.data());
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function fetchUserPost() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("post")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPost")
      .orderBy("create", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        console.log("posts", posts);
        dispatch({ type: USER_POST_STATE_CHANGE, posts });

      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        console.log("following", following);
        dispatch({ type: USER_Following_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUserData(following[i]));
        }
      });
  };
}

export function fetchUserData(uid) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("user")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            dispatch(fetchUserFollowingPost(user.id));
          } else {
            console.log("does not exist");
          }
        });
    }
  };
}

export function fetchUserFollowingPost(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("post")
      .doc(uid)
      .collection("userPost")
      .orderBy("create", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        console.log('uid', uid);

        const found = getState().usersState.users.find((el) => el.uid === uid);
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        console.log("posts", posts);
        dispatch({ type: USERS_POST_STATE_CHANGE, posts, uid });
      });
  };
}
