"use client"

import { useContext, useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"
import { AuthContext } from "../../context/AuthContext"

const VehicleInfoScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const { userInfo } = useContext(AuthContext)
  const colors = getColors(isDarkMode)

  const [vehicleModel, setVehicleModel] = useState(userInfo?.vehicle_model || "")
  const [licensePlate, setLicensePlate] = useState(userInfo?.license_plate || "")
  const [licenseNumber, setLicenseNumber] = useState(userInfo?.license_number || "")
  const [vehicleColor, setVehicleColor] = useState(userInfo?.vehicle_color || "")
  const [vehicleYear, setVehicleYear] = useState(userInfo?.vehicle_year || "")
  const [loading, setLoading] = useState(false)

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

  const handleSave = () => {
    if (!vehicleModel.trim() || !licensePlate.trim() || !licenseNumber.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      Alert.alert("Informations mises à jour", "Les informations de votre véhicule ont été mises à jour avec succès.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    }, 1500)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Informations du véhicule</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Modifiez les informations de votre véhicule ci-dessous
          </Text>

          <View style={styles.vehicleImageContainer}>
            <Image source={require("../../assets/car-placeholder.png")} style={styles.vehicleImage} />
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Changer la photo</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Modèle du véhicule</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Ex: Toyota Corolla"
                placeholderTextColor={colors.textSecondary}
                value={vehicleModel}
                onChangeText={setVehicleModel}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Année</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Ex: 2020"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={vehicleYear}
                  onChangeText={setVehicleYear}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Couleur</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Ex: Noir"
                  placeholderTextColor={colors.textSecondary}
                  value={vehicleColor}
                  onChangeText={setVehicleColor}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Plaque d'immatriculation</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Ex: AB-123-CD"
                placeholderTextColor={colors.textSecondary}
                value={licensePlate}
                onChangeText={setLicensePlate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Numéro de permis</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Entrez votre numéro de permis"
                placeholderTextColor={colors.textSecondary}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>Enregistrer les modifications</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  vehicleImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  vehicleImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default VehicleInfoScreen

