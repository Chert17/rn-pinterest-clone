import { FC } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { useNhostClient, useSignOut, useUserId } from "@nhost/react";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import MasonreList from "../components/MasonreList";
import { IPin } from "../../types/pin.interface";

const GET_USER_QUERY = `
query MyQuery($id: uuid!) {
  user(id: $id) {
    id
    avatarUrl
    displayName
    pins {
      id
      image
      title
      created_at
    }
  }
}
`;

interface IProfile {
  avatarUrl?: string;
  displayName?: string;
  pins: IPin[];
}

const ProfileScreen: FC = () => {
  const [user, setUser] = useState<IProfile>();

  const { signOut } = useSignOut();
  const { graphql } = useNhostClient();

  const userId = useUserId();

  const fetchUserData = async () => {
    const result = await graphql.request(GET_USER_QUERY, { id: userId });

    if (result.error) Alert.alert("Error fetching the user");

    setUser(result.data.user);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={signOut}>
            <Feather name="share" size={24} color="black" style={styles.icon} />
          </Pressable>
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color="black"
            style={styles.icon}
          />
        </View>

        <Image
          source={{
            uri: user.avatarUrl,
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>123 Followers | 534 Followings</Text>
      </View>

      <MasonreList pins={user.pins} onRefresh={fetchUserData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  subtitle: {
    color: "#181818",
    fontWeight: "600",
    margin: 10,
  },
  image: {
    width: 200,
    aspectRatio: 1,
    borderRadius: 200,
    marginVertical: 10,
  },
  header: {
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
  },
  icon: {
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
