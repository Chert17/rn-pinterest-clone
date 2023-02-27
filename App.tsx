import { NhostClient, NhostProvider } from "@nhost/react";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./src/navigation/Navigator";

const nhost = new NhostClient({
  backendUrl: "https://gdiwppcopeyhkcjnntsw.nhost.run",
  clientStorageType: "expo-secure-storage",
  clientStorage: SecureStore,
});

export default function App() {
  return (
    <NhostProvider nhost={nhost}>
      <SafeAreaView style={{ flex: 1 }}>
        <Navigator />
        <StatusBar style="auto" />
      </SafeAreaView>
    </NhostProvider>
  );
}
