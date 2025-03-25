"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getDriverTrips } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const HistoryScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    fetchTrips()

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

  const fetchTrips = async () => {
    try {
      // Fetch completed and cancelled trips
      const tripsData = await getDriverTrips();

      // Filtrer uniquement les trajets avec statut "completed" ou "cancelled"
      const filteredTrips = (tripsData.data || []).filter(
        trip => trip.status === "completed" || trip.status === "cancelled"
      );
      
      // Combine and sort by date (newest first)
      const allTrips = [...(filteredTrips.data || [])].sort(
        (a, b) => new Date(b.departure_time) - new Date(a.departure_time),
      )

      setTrips(allTrips)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching trips:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  const renderTripItem = ({ item, index }) => {
    const departureTime = new Date(item.departure_time)

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[styles.tripCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          onPress={() => navigation.navigate("TripDetail", { tripId: item.id })}
        >
          <View style={styles.tripHeader}>
            <Text style={[styles.tripDate, { color: colors.text }]}>
              {format(departureTime, "EEEE d MMMM yyyy", { locale: fr })}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: item.status === "completed" ? colors.success + "20" : colors.notification + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: item.status === "completed" ? colors.success : colors.notification,
                  },
                ]}
              >
                {item.status === "completed" ? "Terminé" : "Annulé"}
              </Text>
            </View>
          </View>

          <View style={styles.tripRoute}>
            <View style={styles.routeContainer}>
              <View style={styles.routeTimeline}>
                <View style={[styles.startDot, { backgroundColor: colors.primary }]} />
                <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                <View style={[styles.endDot, { backgroundColor: colors.notification }]} />
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.routePoint}>
                  <Text style={[styles.routePointText, { color: colors.text }]}>{item.from_city}</Text>
                  <Text style={[styles.routeTime, { color: colors.textSecondary }]}>
                    {format(departureTime, "HH:mm")}
                  </Text>
                </View>

                <View style={styles.routePoint}>
                  <Text style={[styles.routePointText, { color: colors.text }]}>{item.to_city}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.tripFooter, { borderTopColor: colors.border }]}>
            <View style={styles.tripStats}>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {item.booked_seats}/{item.available_seats} places
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {item.price_per_seat * item.booked_seats} Fc
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.notification} />
        <Text style={[styles.errorText, { color: colors.text }]}>Erreur: {error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            setLoading(true)
            fetchTrips()
          }}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (trips.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="car-outline" size={60} color={colors.textSecondary} />
        <Text style={[styles.noTripsText, { color: colors.text }]}>Aucun trajet</Text>
        <Text style={[styles.noTripsSubtext, { color: colors.textSecondary }]}>
          Vous n'avez pas encore effectué de trajet
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("CreateTrip")}
        >
          <Text style={styles.createButtonText}>Créer un trajet</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 15,
  },
  tripCard: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
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
  tripRoute: {
    marginBottom: 15,
  },
  routeContainer: {
    flexDirection: "row",
  },
  routeTimeline: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    height: 30,
    marginVertical: 5,
  },
  endDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeInfo: {
    flex: 1,
  },
  routePoint: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routePointText: {
    fontSize: 16,
    fontWeight: "500",
  },
  routeTime: {
    fontSize: 14,
  },
  tripFooter: {
    paddingTop: 15,
    borderTopWidth: 1,
  },
  tripStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  noTripsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  noTripsSubtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default HistoryScreen

