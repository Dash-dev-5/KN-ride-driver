"use client"

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"

// Screens
import SplashScreen from "./screens/SplashScreen"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import DashboardScreen from "./screens/DashboardScreen"
import CreateTripScreen from "./screens/CreateTripScreen"
import PassengerListScreen from "./screens/PassengerListScreen"
import TripDetailScreen from "./screens/TripDetailScreen"
import ProfileScreen from "./screens/ProfileScreen"
import RatePassengerScreen from "./screens/RatePassengerScreen"
import HistoryScreen from "./screens/HistoryScreen"

// Help & Account Screens
import HelpCenterScreen from "./screens/help/HelpCenterScreen"
import TermsScreen from "./screens/help/TermsScreen"
import PrivacyPolicyScreen from "./screens/help/PrivacyPolicyScreen"
import SupportScreen from "./screens/help/SupportScreen"
import PersonalInfoScreen from "./screens/account/PersonalInfoScreen"
import VehicleInfoScreen from "./screens/account/VehicleInfoScreen"

// Context
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ThemeContext } from "./context/ThemeContext"
import { getColors } from "./styles/theme"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  const { isDarkMode } = React.useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Tableau de bord" }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: "Historique" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Mon Profil" }} />
    </Tab.Navigator>
  )
}

function AppContent() {
  const { isDarkMode } = React.useContext(ThemeContext)
  const colors = getColors(isDarkMode)
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken")
        setUserToken(token)
        setIsLoading(false)
      } catch (e) {
        console.log("Failed to fetch the token from storage")
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Inscription Chauffeur" }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="CreateTrip" component={CreateTripScreen} options={{ title: "Créer un Trajet" }} />
            <Stack.Screen
              name="PassengerList"
              component={PassengerListScreen}
              options={{ title: "Liste des Passagers" }}
            />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: "Détails du Trajet" }} />
            <Stack.Screen
              name="RatePassenger"
              component={RatePassengerScreen}
              options={{ title: "Noter le Passager" }}
            />

            {/* Help & Account Screens */}
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: "Centre d'aide" }} />
            <Stack.Screen name="Terms" component={TermsScreen} options={{ title: "Conditions d'utilisation" }} />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{ title: "Politique de confidentialité" }}
            />
            <Stack.Screen name="Support" component={SupportScreen} options={{ title: "Contacter le support" }} />
            <Stack.Screen
              name="PersonalInfo"
              component={PersonalInfoScreen}
              options={{ title: "Informations personnelles" }}
            />
            <Stack.Screen
              name="VehicleInfo"
              component={VehicleInfoScreen}
              options={{ title: "Informations du véhicule" }}
            />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

