"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { createPayment } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"
import { useContext } from "react"

const PaymentScreen = ({ route, navigation }) => {
  const { bookingId, amount, tripDetails } = route.params
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("orange") // orange, wave, free_money
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert("Erreur", "Veuillez entrer votre numéro de téléphone")
      return
    }

    setLoading(true)
    try {
      const paymentData = {
        booking_id: bookingId,
        amount: amount,
        provider: paymentMethod,
        payment_method: "mobile_money",
        phone: phoneNumber,
      }

      console.log(paymentData)
      const response = await createPayment(paymentData)

      console.log("payement :", response)

      // Simulate payment success for demo purposes
      setTimeout(() => {
        setLoading(false)
        navigation.navigate("MainTabs", {
          bookingId: bookingId,
          tripDetails: tripDetails,
        })
      }, 2000)
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur de paiement", error.message)
    }
  }

  const renderPaymentMethodOption = (method, label, icon) => {
    return (
      <TouchableOpacity
        style={[
          styles.paymentMethodOption,
          paymentMethod === method && styles.paymentMethodSelected,
          {
            borderColor: paymentMethod === method ? colors.primary : colors.border,
            backgroundColor: paymentMethod === method ? colors.primary + "20" : colors.card,
          },
        ]}
        onPress={() => setPaymentMethod(method)}
      >
        <Ionicons name={icon} size={24} color={paymentMethod === method ? colors.primary : colors.textSecondary} />
        <Text
          style={[
            styles.paymentMethodLabel,
            paymentMethod === method && styles.paymentMethodLabelSelected,
            { color: paymentMethod === method ? colors.primary : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>Paiement</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Paiement de 50% pour réserver votre trajet
          </Text>
        </View>

        <View style={[styles.tripSummary, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Résumé du trajet</Text>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Trajet</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {tripDetails.fromCity} → {tripDetails.toCity}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {format(new Date(tripDetails.departureTime), "EEEE d MMMM yyyy", { locale: fr })}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Heure de départ</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {format(new Date(tripDetails.departureTime), "HH:mm")}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Nombre de places</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{tripDetails.seats}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Montant total</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{amount * 2} FCFA</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Acompte (50%)</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{amount} FCFA</Text>
          </View>
        </View>

        <View style={[styles.paymentSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Méthode de paiement</Text>

          <View style={styles.paymentMethods}>
            {renderPaymentMethodOption("orange", "Orange Money", "phone-portrait-outline")}
            {renderPaymentMethodOption("wave", "Wave", "wallet-outline")}
            {renderPaymentMethodOption("free_money", "Free Money", "cash-outline")}
          </View>

          <View style={styles.phoneInputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Numéro de téléphone</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Entrez votre numéro de téléphone"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Text style={[styles.paymentNote, { color: colors.textSecondary }]}>
            Vous allez recevoir une notification sur votre téléphone pour confirmer le paiement.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Montant à payer</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>{amount} FCFA</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.payButtonText}>Payer maintenant</Text>}
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  tripSummary: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  paymentSection: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  paymentMethodOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  paymentMethodSelected: {
    borderWidth: 2,
  },
  paymentMethodLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  paymentMethodLabelSelected: {
    fontWeight: "500",
  },
  phoneInputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  paymentNote: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 150,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PaymentScreen

