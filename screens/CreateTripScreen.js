"use client"

import { useState, useContext, useRef, useEffect } from "react"
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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import { createTrip } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const CreateTripScreen = ({ navigation, route }) => {
  // Get pre-filled values if coming from popular routes
  const initialFromCity = route.params?.fromCity || ""
  const initialToCity = route.params?.toCity || ""

  const [fromCity, setFromCity] = useState(initialFromCity)
  const [toCity, setToCity] = useState(initialToCity)
  const [departureDate, setDepartureDate] = useState(new Date())
  const [departureTime, setDepartureTime] = useState(new Date())
  const [availableSeats, setAvailableSeats] = useState("4")
  const [pricePerSeat, setPricePerSeat] = useState("")
  const [notes, setNotes] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDepartureDate(selectedDate)
    }
  }

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      setDepartureTime(selectedTime)
    }
  }

  const handleCreateTrip = async () => {
    // Validation
    if (!fromCity || !toCity || !availableSeats || !pricePerSeat) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    // Combine date and time
    const combinedDateTime = new Date(departureDate)
    combinedDateTime.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0)

    // Format for API
    const formattedDateTime = format(combinedDateTime, "yyyy-MM-dd HH:mm:ss")

    setLoading(true)
    try {
      const tripData = {
        from_city: fromCity,
        to_city: toCity,
        departure_time: formattedDateTime,
        available_seats: Number.parseInt(availableSeats),
        price_per_seat: Number.parseInt(pricePerSeat),
        notes: notes || undefined,
      }

      const response = await createTrip(tripData)

      setLoading(false)
      Alert.alert("Succès", "Votre trajet a été créé avec succès", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Dashboard"),
        },
      ])
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur", error.message || "Une erreur est survenue lors de la création du trajet")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Créer un nouveau trajet</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Renseignez les informations de votre trajet
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Ville de départ</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Ex: Kinshasa"
                placeholderTextColor={colors.textSecondary}
                value={fromCity}
                onChangeText={setFromCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Destination</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Ex: Lubumbashi"
                placeholderTextColor={colors.textSecondary}
                value={toCity}
                onChangeText={setToCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Date de départ</Text>
              <TouchableOpacity
                style={[styles.dateInput, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: colors.text }}>{format(departureDate, "dd/MM/yyyy")}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={departureDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Heure de départ</Text>
              <TouchableOpacity
                style={[styles.dateInput, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: colors.text }}>{format(departureTime, "HH:mm")}</Text>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker value={departureTime} mode="time" display="default" onChange={onTimeChange} />
              )}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Places disponibles</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Ex: 4"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={availableSeats}
                  onChangeText={setAvailableSeats}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Prix par place (Fc)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Ex: 5000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={pricePerSeat}
                  onChangeText={setPricePerSeat}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Notes (optionnel)</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Informations supplémentaires pour les passagers..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreateTrip}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Créer le trajet</Text>
              )}
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
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 30,
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
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default CreateTripScreen

