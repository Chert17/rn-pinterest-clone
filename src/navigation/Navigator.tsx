import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { FC } from "react";
import { useAuthenticationStatus } from "@nhost/react";

import { RootStackParamList } from "./nav.types";
import PinScreen from "../screens/PinScreen";
import MenuTabs from "./MenuTabs";
import AuthStackNavigator from "./AuthStackNavigator";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: FC = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  if (isLoading) <ActivityIndicator />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthStackNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Root"
              component={MenuTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Pin"
              component={PinScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
