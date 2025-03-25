"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const SplashScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken")

        // Simulate loading time
        setTimeout(() => {
          if (token === null) {
            navigation.replace("Login")
          } else {
            navigation.replace("MainTabs")
          }
        }, 2000)
      } catch (e) {
        console.log("Failed to fetch the token from storage")
        navigation.replace("Login")
      }
    }

    checkLoginStatus()
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpeg")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Taxi Booking - Chauffeur</Text>
      <ActivityIndicator size="large" color="#0066CC" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
})

export default SplashScreen

