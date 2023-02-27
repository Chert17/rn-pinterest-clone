import { FC } from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { useNhostClient } from "@nhost/react";
import RemoteImage from "../components/RemoteImage";
import { IPin } from "../../types/pin.interface";

const GET_PIN_QUERY = `
query MyQuery ($id: uuid!) {
  pins_by_pk(id: $id) {
    created_at
    id
    image
    title
    user_id
    user {
      avatarUrl
      displayName
    }
  }
}
`;

type TypeRouteId = {
  PinScreen: {
    id: string;
  };
};

const PinScreen: FC = () => {
  const [pin, setPin] = useState<IPin | null>(null);

  const { graphql } = useNhostClient();

  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<TypeRouteId, "PinScreen">>();
  const { top } = useSafeAreaInsets();

  const pinId = params?.id;

  const fetchPin = async (pinId: string) => {
    const response = await graphql.request(GET_PIN_QUERY, { id: pinId });
    console.log(response);

    if (response.error) Alert.alert("Error fetching the pin");

    setPin(response.data.pins_by_pk);
  };

  useEffect(() => {
    fetchPin(pinId);
  }, [pinId]);

  const goBack = () => {
    navigation.goBack();
  };

  if (!pin) {
    return <Text>Pin not found</Text>;
  }

  return (
    <SafeAreaView style={{ backgroundColor: "black" }}>
      <StatusBar style="light" backgroundColor="black" />
      <View style={styles.root}>
        <RemoteImage fileId={pin.image} />
        <Text style={styles.title}>{pin.title}</Text>
      </View>

      <Pressable onPress={goBack} style={[styles.backBtn, { top: top + 20 }]}>
        <Ionicons name={"chevron-back"} size={35} color={"white"} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    margin: 10,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 35,
  },
  backBtn: {
    position: "absolute",
    left: 10,
  },
});

export default PinScreen;
