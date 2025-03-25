"use client"

import { useState, useEffect, useContext, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getTripPassengers, updateTripStatus, confirmPayment, getTrips } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const PassengerListScreen = ({ route, navigation }) => {
  const { tripId, trip } = route.params
  const [passengers, setPassengers] = useState([])
  const [tripDetails, setTripDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    fetchPassengers()

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

  const fetchPassengers = async () => {
    try {
      // const response = await getTripPassengers(tripId)
      // const response = await getTrips()
      console.log('LLLLLLL',trip.bookings);
      
      setPassengers(trip.bookings || [])
      // setTripDetails(trip || null)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching passengers:", error)
      setLoading(false)
      Alert.alert("Erreur", "Impossible de charger la liste des passagers")
    }
  }

  const handleStartTrip = async () => {
    setUpdating(true)
    try {
      await updateTripStatus(tripId, "ongoing")
      Alert.alert("Succès", "Le trajet a été démarré avec succès")
      fetchPassengers() // Refresh data
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
      navigation.navigate("Dashboard")
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de terminer le trajet")
      setUpdating(false)
    }
  }

  const handleConfirmPayment = async (paymentId, passengerId) => {
    try {
      await confirmPayment(paymentId)

      // Update local state to reflect the payment confirmation
      setPassengers(
        passengers.map((passenger) =>
          passenger.id === passengerId ? { ...passenger, payment_status: "paid" } : passenger,
        ),
      )

      Alert.alert("Succès", "Paiement confirmé avec succès")
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de confirmer le paiement")
    }
  }

  const renderPassengerItem = ({ item }) => {
    const isPaid = item.status === "confirmed"

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={[styles.passengerCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.passengerHeader}>
            <View style={styles.passengerInfo}>
              <Image
                source={item.avatar ? { uri: item.avatar } : require("../assets/passenger-placeholder.png")}
                style={styles.passengerAvatar}
              />
              <View>
                <Text style={[styles.passengerName, { color: colors.text }]}>{item.user.name || "Passager"}</Text>
                <Text style={[styles.passengerPhone, { color: colors.textSecondary }]}>{item.user.phone || "N/A"}</Text>
              </View>
            </View>
            <View
              style={[
                styles.paymentStatus,
                { backgroundColor: isPaid ? colors.success + "20" : colors.warning + "20" },
              ]}
            >
              <Text style={[styles.paymentStatusText, { color: isPaid ? colors.success : colors.warning }]}>
                {isPaid ? "Payé" : "En attente"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.bookingDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Places</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.seats}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Montant</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.total_amount} Fc</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Point de prise</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.pickup_location || "N/A"} à {item.dropoff_location || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + "20" }]}
              onPress={() => {
                // Call passenger
                Alert.alert("Appeler", `Appeler ${item.user.name} au ${item.user.phone}?`, [
                  { text: "Annuler", style: "cancel" },
                  { text: "Appeler", style: "default" },
                ])
              }}
            >
              <Ionicons name="call-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Appeler</Text>
            </TouchableOpacity>

            {!isPaid && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={() => handleConfirmPayment(item.payment_id, item.id)}
              >
                <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonTextWhite}>Confirmer paiement</Text>
              </TouchableOpacity>
            )}

            {tripDetails?.status === "completed" && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.warning }]}
                onPress={() => navigation.navigate("RatePassenger", { passengerId: item.id, tripId })}
              >
                <Ionicons name="star-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonTextWhite}>Noter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    )
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.tripInfoCard,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.tripInfo}>
          <Text style={[styles.tripRoute, { color: colors.text }]}>
            {trip?.from_city} → {trip?.to_city}
          </Text>
          <View style={styles.tripStats}>
            <View style={styles.tripStat}>
              <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.tripStatText, { color: colors.textSecondary }]}>
                {passengers.length}/{trip?.available_seats} passagers dispo
              </Text>
            </View>
            <View style={styles.tripStat}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.tripStatText, { color: colors.textSecondary }]}>
                {trip?.price_per_seat} Fc/place
              </Text>
            </View>
          </View>
        </View>

        {tripDetails?.status === "scheduled" && (
          <TouchableOpacity
            style={[styles.startTripButton, { backgroundColor: colors.primary }]}
            onPress={handleStartTrip}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="play" size={18} color="#FFFFFF" />
                <Text style={styles.startTripButtonText}>Démarrer le trajet</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {tripDetails?.status === "ongoing" && (
          <TouchableOpacity
            style={[styles.startTripButton, { backgroundColor: colors.success }]}
            onPress={handleCompleteTrip}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.startTripButtonText}>Terminer le trajet</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </Animated.View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Liste des passagers</Text>

      {passengers.length > 0 ? (
        <FlatList
          data={passengers}
          renderItem={renderPassengerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.passengerList}
        />
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Ionicons name="people-outline" size={50} color={colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Aucun passager pour ce trajet</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tripInfoCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tripStats: {
    flexDirection: "row",
  },
  tripStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  tripStatText: {
    marginLeft: 5,
    fontSize: 14,
  },
  startTripButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  startTripButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  passengerList: {
    paddingBottom: 20,
  },
  passengerCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passengerPhone: {
    fontSize: 14,
  },
  paymentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  actionButtonText: {
    fontWeight: "500",
    marginLeft: 5,
  },
  actionButtonTextWhite: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    borderRadius: 10,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
})

export default PassengerListScreen

