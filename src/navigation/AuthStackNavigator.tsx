import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC } from "react";
import SignInScreen from "../screens/Auth/SignInScreen/SignInScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen/SignUpScreen";

const Stack = createNativeStackNavigator();

const AuthStackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
