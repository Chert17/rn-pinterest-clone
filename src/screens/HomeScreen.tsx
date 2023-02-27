import { FC, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import MasonreList from "../components/MasonreList";
import { useNhostClient } from "@nhost/react";

const HomeScreen: FC = () => {
  const { graphql } = useNhostClient();

  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPins = async () => {
    setLoading(true);
    const response = await graphql.request(`
      query MyQuery {
        pins {
          created_at
          id
          image
          title
          user_id
        }
      }
    `);

    if (response.error) Alert.alert("Error fetching pins");

    setPins(response.data.pins);

    setLoading(false);
  };

  useEffect(() => {
    fetchPins();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MasonreList pins={pins} onRefresh={fetchPins} refreshing={loading} />
    </View>
  );
};

export default HomeScreen;
