import { FC, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNhostClient } from "@nhost/react";
import {
  Button,
  Image,
  TextInput,
  View,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const CREATE_PIN_MUTATION = `
mutation MyMutation ($image: String!, $title: String) {
  insert_pins(objects: {image: $image, title: $title}) {
    returning {
      created_at
      id
      image
      title
      user_id
    }
  }
}
`;

const CreatePinScreen: FC = () => {
  const [imageUri, setImageUri] = useState<null | string>(null);
  const [title, setTitle] = useState("");

  const { graphql, storage } = useNhostClient();
  const { goBack } = useNavigation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri as any);
    }
  };

  const uploadFile = async () => {
    if (!imageUri)
      return {
        error: {
          message: "No image selected",
        },
      };

    const parts = imageUri.split("/");
    const name = parts[parts.length - 1];
    const nameParts = name.split(".");
    const extension = nameParts[nameParts.length - 1];

    const uri =
      Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;

    const result = await storage.upload({
      file: {
        name,
        type: `image/${extension}`,
        uri,
      },
    });

    return result;
  };

  const onSubmit = async () => {
    const uploadResult = await uploadFile();

    if (uploadResult?.error)
      return Alert.alert(
        "Error uploading the image",
        uploadResult.error.message
      );

    const result = await graphql.request(CREATE_PIN_MUTATION, {
      title,
      image: uploadResult.fileMetadata.id,
    });

    if (result.error)
      Alert.alert("Error creating the pin", result.error?.message);

    goBack();
  };

  return (
    <View style={styles.root}>
      <Button title="Upload your Pin" onPress={pickImage} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TextInput
            placeholder="Title..."
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <Button title="Submit Pin" onPress={onSubmit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "gainsboro",
    padding: 6,
    width: "100%",
    borderRadius: 4,
    marginVertical: 8,
  },
});

export default CreatePinScreen;
