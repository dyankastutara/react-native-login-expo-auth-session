//webClientId 439195624759-j4q20f9l8vcnkt50h7v73dnishmcej7g.apps.googleusercontent.com
//iOsClientId 439195624759-e127jvo5db75lcic5hnepjdnf0kmehct.apps.googleusercontent.com
//androidClientId 439195624759-h7r28esv34ndepi89q4qjdr88nqfc0os.apps.googleusercontent.com
import { Link, Stack } from "expo-router";
import { StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "439195624759-j4q20f9l8vcnkt50h7v73dnishmcej7g.apps.googleusercontent.com",
    iosClientId:
      "439195624759-e127jvo5db75lcic5hnepjdnf0kmehct.apps.googleusercontent.com",
    androidClientId:
      "439195624759-h7r28esv34ndepi89q4qjdr88nqfc0os.apps.googleusercontent.com",
  });

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        const { authentication } = response;
        // Use authentication object here
        console.log(authentication);
        await getUserInfo(authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }
  const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = await response.json();
      console.log(response, user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } catch (error: any) {
      //Add your own error
    }
  };
  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);
  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This Login.</ThemedText>
        <Button title="Sign in with Google" onPress={() => promptAsync()} />
        <Button
          title="Delete local storage"
          onPress={() => AsyncStorage.removeItem("@user")}
        />
        <ThemedText>{JSON.stringify(userInfo, null, 2)}</ThemedText>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

export default LoginScreen;
