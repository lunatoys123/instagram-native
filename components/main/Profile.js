import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/firestore";

function Profile(props) {
  const [userPosts, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .doc(props.route.params.uid)
      .delete();
  };
  const onfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  useEffect(() => {
    const { currentUser, posts } = props;
    console.log({ currentUser, posts });

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPost(posts);
    } else {
      firebase
        .firestore()
        .collection("user")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exists");
          }
        });

      firebase
        .firestore()
        .collection("post")
        .doc(props.route.params.uid)
        .collection("userPost")
        .orderBy("create", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPost(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  if (user == null) {
    return <View></View>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onfollow()} />
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => {
            console.log(item.downloadURL);
            return (
              <View style={styles.containerImage}>
                <Image
                  source={{ uri: item.downloadURL }}
                  style={styles.image}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  containerInfo: {
    margin: 20,
  },

  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },

  containerImage: {
    flex: 1 / 3,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
