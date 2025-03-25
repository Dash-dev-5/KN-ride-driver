"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Switch, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const ProfileScreen = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: () => logout() },
    ])
  }

  const renderSettingItem = (icon, title, value, onToggle) => {
    return (
      <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        <View style={styles.settingInfo}>
          <Ionicons name={icon} size={24} color={colors.textSecondary} />
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#DDDDDD", true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    )
  }

  const renderMenuItem = (icon, title, onPress) => {
    return (
      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={onPress}>
        <View style={styles.menuInfo}>
          <Ionicons name={icon} size={24} color={colors.textSecondary} />
          <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.profileInfo}>
            <Image source={require("../assets/driver-placeholder.png")} style={styles.profileImage} />
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{userInfo?.name || "Chauffeur"}</Text>
              <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                {userInfo?.phone || "+243 XX XXX XX XX"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary + "20" }]}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Paramètres</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {renderSettingItem("notifications-outline", "Notifications", notificationsEnabled, setNotificationsEnabled)}
            {renderSettingItem("moon-outline", "Mode sombre", isDarkMode, toggleTheme)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Compte</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {renderMenuItem("person-outline", "Informations personnelles", () => navigation.navigate("PersonalInfo"))}
            {renderMenuItem("car-outline", "Informations du véhicule", () => navigation.navigate("VehicleInfo"))}
            {renderMenuItem("shield-checkmark-outline", "Sécurité", () => {})}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Assistance</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {renderMenuItem("help-circle-outline", "Centre d'aide", () => navigation.navigate("HelpCenter"))}
            {renderMenuItem("chatbubble-outline", "Contacter le support", () => navigation.navigate("Support"))}
            {renderMenuItem("document-text-outline", "Conditions d'utilisation", () => navigation.navigate("Terms"))}
            {renderMenuItem("shield-outline", "Politique de confidentialité", () =>
              navigation.navigate("PrivacyPolicy"),
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0 By Kollectif numerique inc.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userPhone: {
    fontSize: 14,
    marginTop: 3,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
    marginLeft: 10,
  },
  versionInfo: {
    alignItems: "center",
    padding: 20,
  },
  versionText: {
    fontSize: 14,
  },
})

export default ProfileScreen

