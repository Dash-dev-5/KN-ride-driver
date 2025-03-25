"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getTripDetails, updateTripStatus } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    fetchTripDetails()

    // Start animations
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

  const fetchTripDetails = async () => {
    try {
      const response = await getTripDetails(tripId)
      setTrip(response.trip)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching trip details:", error)
      setLoading(false)
      Alert.alert("Erreur", "Impossible de charger les détails du trajet")
    }
  }

  const handleStartTrip = async () => {
    setUpdating(true)
    try {
      await updateTripStatus(tripId, "ongoing")
      Alert.alert("Succès", "Le trajet a été démarré avec succès")
      fetchTripDetails() // Refresh data
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de démarrer le trajet")
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteTrip = async () => {
    setUpdating(true)
    try {
      await updateTripStatus(tripId, "completed")
      Alert.alert("Succès", "Le trajet a été marqué comme terminé")
      fetchTripDetails() // Refresh data
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de terminer le trajet")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelTrip = async () => {
    Alert.alert("Annuler le trajet", "Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible.", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui, annuler",
        style: "destructive",
        onPress: async () => {
          setUpdating(true)
          try {
            await updateTripStatus(tripId, "cancelled")
            Alert.alert("Succès", "Le trajet a été annulé avec succès")
            navigation.navigate("Dashboard")
          } catch (error) {
            Alert.alert("Erreur", error.message || "Impossible d'annuler le trajet")
            setUpdating(false)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!trip) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.notification} />
        <Text style={[styles.errorText, { color: colors.text }]}>Trajet non trouvé</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const departureTime = new Date(trip.departure_time)
  const formattedDate = format(departureTime, "EEEE d MMMM yyyy", { locale: fr })
  const formattedTime = format(departureTime, "HH:mm")

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>
          {trip.from_city} → {trip.to_city}
        </Text>
        <Text style={styles.headerSubtitle}>{formattedDate}</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Détails du trajet</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    trip.status === "completed"
                      ? colors.success + "20"
                      : trip.status === "ongoing"
                        ? colors.warning + "20"
                        : trip.status === "scheduled"
                          ? colors.primary + "20"
                          : colors.notification + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      trip.status === "completed"
                        ? colors.success
                        : trip.status === "ongoing"
                          ? colors.warning
                          : trip.status === "scheduled"
                            ? colors.primary
                            : colors.notification,
                  },
                ]}
              >
                {trip.status === "completed"
                  ? "Terminé"
                  : trip.status === "ongoing"
                    ? "En cours"
                    : trip.status === "scheduled"
                      ? "Programmé"
                      : "Annulé"}
              </Text>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{formattedDate}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{formattedTime}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {trip.booked_seats}/{trip.available_seats} places réservées
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{trip.price_per_seat} Fc par place</Text>
            </View>

            {trip.notes && (
              <View style={styles.detailItem}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{trip.notes}</Text>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.earnings}>
            <Text style={[styles.earningsTitle, { color: colors.text }]}>Revenus estimés</Text>
            <View style={styles.earningsDetails}>
              <View style={styles.earningsItem}>
                <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>Places réservées</Text>
                <Text style={[styles.earningsValue, { color: colors.text }]}>
                  {trip.booked_seats} x {trip.price_per_seat} Fc
                </Text>
              </View>
              <View style={styles.earningsItem}>
                <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>Total</Text>
                <Text style={[styles.earningsTotal, { color: colors.primary }]}>
                  {trip.booked_seats * trip.price_per_seat} Fc
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("PassengerList", { tripId: trip.id })}
          >
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Voir les passagers</Text>
          </TouchableOpacity>

          {trip.status === "scheduled" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={handleStartTrip}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="play" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonTextWhite}>Démarrer</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.notification }]}
                onPress={handleCancelTrip}
                disabled={updating}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonTextWhite}>Annuler</Text>
              </TouchableOpacity>
            </>
          )}

          {trip.status === "ongoing" && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={handleCompleteTrip}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonTextWhite}>Terminer</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    textTransform: "capitalize",
  },
  card: {
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tripDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  earnings: {
    marginBottom: 10,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  earningsDetails: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 15,
  },
  earningsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  earningsLabel: {
    fontSize: 14,
  },
  earningsValue: {
    fontSize: 14,
  },
  earningsTotal: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  actionButtonTextWhite: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default TripDetailScreen

