"use client"

import { useContext, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

const PaymentMethodsScreen = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  const [selectedMethod, setSelectedMethod] = useState("mobile_money")

  const handleAddPaymentMethod = () => {
    Alert.alert("Ajouter une méthode de paiement", "Cette fonctionnalité sera disponible prochainement.")
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Méthodes de paiement</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Gérez vos méthodes de paiement pour vos trajets
          </Text>

          <View style={[styles.methodsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Méthode de paiement préférée</Text>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedMethod === "mobile_money" && [styles.selectedMethod, { borderColor: colors.primary }],
              ]}
              onPress={() => setSelectedMethod("mobile_money")}
            >
              <View style={styles.methodInfo}>
                <View style={[styles.methodIconContainer, { backgroundColor: colors.primary + "20" }]}>
                  <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.methodName, { color: colors.text }]}>Mobile Money</Text>
                  <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>
                    Paiement via votre compte mobile
                  </Text>
                </View>
              </View>
              {selectedMethod === "mobile_money" && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>

            <View style={styles.mobilePayOptions}>
              <TouchableOpacity
                style={[
                  styles.mobilePayOption,
                  { backgroundColor: colors.inputBackground, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.mobilePayName, { color: colors.text }]}>Orange Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobilePayOption,
                  { backgroundColor: colors.inputBackground, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.mobilePayName, { color: colors.text }]}>Wave</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobilePayOption,
                  { backgroundColor: colors.inputBackground, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.mobilePayName, { color: colors.text }]}>Free Money</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleAddPaymentMethod}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>Ajouter une méthode de paiement</Text>
          </TouchableOpacity>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: colors.text }]}>Paiements sécurisés</Text>
            </View>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Toutes vos transactions sont sécurisées et cryptées. Nous ne stockons pas vos informations de paiement
              sensibles sur nos serveurs.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  methodsContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedMethod: {
    borderWidth: 2,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
  },
  mobilePayOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  mobilePayOption: {
    width: "30%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  mobilePayName: {
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default PaymentMethodsScreen

