import { useNhostClient } from "@nhost/react";
import { useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import {
  Alert,
  ScrollView,
  Image,
  TextInput,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import CustomButton from "../components/CustomButton";
import SocialSignInButtons from "../components/SocialSignInButtons";

const SignInScreen: FC = () => {
  const { height } = useWindowDimensions();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nhost = useNhostClient();

  const onSignInPressed = async () => {
    const result = await nhost.auth.signIn({
      email,
      password,
    });
    if (result.error) Alert.alert("Error", result.error.message);
  };

  const onForgotPasswordPressed = () => {
    console.warn("Forgot password");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/notJust-dev/Pinterest/main/screens/Auth/SignInScreen/logo.png",
          }}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Eamil"
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />

        <CustomButton text="Sign In" onPress={onSignInPressed} />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={() => navigate("SignUp")}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
  },
  input: {
    backgroundColor: "white",
    width: "100%",

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
    height: 50,
  },
});

export default SignInScreen;
