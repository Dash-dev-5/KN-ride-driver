"use client"

import { useState, useContext, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [vehicleColor, setVehicleColor] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const { register, isLoading } = useContext(AuthContext)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

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

  const nextStep = () => {
    // Validation for step 1
    if (currentStep === 1) {
      if (!fullName || !phoneNumber || !password || !confirmPassword) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
        return
      }

      if (password !== confirmPassword) {
        Alert.alert("Erreur", "Les mots de passe ne correspondent pas")
        return
      }
    }

    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  const handleRegister = async () => {
    // Validation for step 2
    if (!vehicleModel || !licensePlate || !licenseNumber) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    try {

    //   {
    //     "name": "Driver Name",
    //     "email": "driver@example.com",
    //     "phone": "+243987654321",
    //     "password": "password123",
    //     "password_confirmation": "password123",
    //     "vehicle_model": "Toyota Hiace",
    //     "vehicle_number": "ABC123",
    //     "license_number": "DL123456"
    // }
      const userData = {
        name: fullName,
        phone: phoneNumber,
        email: email || null, // Only include if provided
        password,
        password_confirmation: password,
        vehicle_model: vehicleModel,
        vehicle_number: licensePlate,
        license_number: licenseNumber,
        // vehicle_color: vehicleColor || undefined,
      }

      await register(userData)
      Alert.alert(
        "Inscription réussie",
        "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      )
    } catch (error) {
      Alert.alert("Erreur d'inscription", error.message)
      console.log(error)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {currentStep === 1 ? "Créer un compte chauffeur" : "Informations du véhicule"}
          </Text>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: currentStep === 2 ? colors.primary : colors.border }]} />
            <View style={[styles.stepCircle, { backgroundColor: currentStep === 2 ? colors.primary : colors.border }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
          </View>

          {currentStep === 1 ? (
            // Step 1: Personal Information
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Nom complet</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Entrez votre nom complet"
                  placeholderTextColor={colors.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Numéro de téléphone</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Entrez votre numéro de téléphone"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Email (optionnel)</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Entrez votre email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Mot de passe</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Créez un mot de passe"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Confirmer le mot de passe</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Confirmez votre mot de passe"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={nextStep}>
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Step 2: Vehicle Information
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Modèle du véhicule</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Ex: Toyota Corolla"
                  placeholderTextColor={colors.textSecondary}
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Plaque d'immatriculation</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Ex: AB-123-CD"
                  placeholderTextColor={colors.textSecondary}
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Numéro de permis</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Entrez votre numéro de permis"
                  placeholderTextColor={colors.textSecondary}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                />
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Couleur du véhicule</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Ex: Noir"
                  placeholderTextColor={colors.textSecondary}
                  value={vehicleColor}
                  onChangeText={setVehicleColor}
                />
              </View> */}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.backButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={prevStep}
                >
                  <Text style={[styles.backButtonText, { color: colors.text }]}>Retour</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.primary,
                      flex: 1,
                      marginLeft: 10,
                    },
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>S'inscrire</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Se connecter</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  stepLine: {
    height: 2,
    width: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  backButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default RegisterScreen

