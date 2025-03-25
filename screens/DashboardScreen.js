"use client"

import { useState, useEffect, useContext, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getDriverTrips, getDriverStats, getPopularRoutes } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const DashboardScreen = ({ navigation }) => {
  const [activeTrips, setActiveTrips] = useState([])
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [stats, setStats] = useState(null)
  const [popularRoutes, setPopularRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    fetchData()

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

  const fetchData = async () => {
    try {
      // Fetch active trips (ongoing)
      const activeData = await getDriverTrips("ongoing")
      setActiveTrips(activeData.data || [])

      // Fetch upcoming trips (scheduled)
      const upcomingData = await getDriverTrips("scheduled")
      setUpcomingTrips(upcomingData.data || [])

      // Fetch driver stats
      const statsData = await getDriverStats()
      setStats(
        statsData.data || {
          total_trips: 0,
          total_earnings: 0,
          total_passengers: 0,
          rating: 0,
        },
      )

      // Fetch popular routes
      const routesData = await getPopularRoutes()
      setPopularRoutes(routesData.data || [])

      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const renderTripCard = (trip, isActive = false) => {
    const departureTime = new Date(trip.departure_time)

    return (
      <TouchableOpacity
        key={trip.id}
        style={[styles.tripCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        onPress={() => navigation.navigate("TripDetail", { tripId: trip.id })}
      >
        <View style={styles.tripHeader}>
          <Text style={[styles.tripDate, { color: colors.text }]}>
            {format(departureTime, "EEEE d MMMM", { locale: fr })}
          </Text>
          <Text style={[styles.tripTime, { color: colors.primary }]}>{format(departureTime, "HH:mm")}</Text>
        </View>

        <View style={styles.tripRoute}>
          <View style={styles.routeContainer}>
            <View style={styles.routeTimeline}>
              <View style={[styles.startDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
              <View style={[styles.endDot, { backgroundColor: colors.notification }]} />
            </View>

            <View style={styles.routeInfo}>
              <Text style={[styles.routePoint, { color: colors.text }]}>{trip.from_city}</Text>
              <Text style={[styles.routePoint, { color: colors.text }]}>{trip.to_city}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tripFooter, { borderTopColor: colors.border }]}>
          <View style={styles.tripStats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {trip.booked_seats}/{trip.available_seats} places
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{trip.price_per_seat} Fc/place</Text>
            </View>
          </View>

          {isActive && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("PassengerList", { tripId: trip.id })}
            >
              <Text style={styles.actionButtonText}>Voir passagers</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
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
        <Text style={styles.greeting}>Tableau de bord</Text>
        <TouchableOpacity style={styles.createTripButton} onPress={() => navigation.navigate("CreateTrip")}>
          <Text style={styles.createTripButtonText}>Créer un trajet</Text>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Ionicons name="car-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats?.total_trips || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trajets</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Ionicons name="cash-outline" size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats?.total_earnings || 0} Fc</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Revenus</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Ionicons name="star-outline" size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.rating ? stats.rating.toFixed(1) : "0.0"}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Note</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trajets en cours</Text>
          {activeTrips.length > 0 ? (
            activeTrips.map((trip) => renderTripCard(trip, true))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Ionicons name="car-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Aucun trajet en cours</Text>
            </View>
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trajets à venir</Text>
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map((trip) => renderTripCard(trip))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Ionicons name="calendar-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Aucun trajet programmé</Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate("CreateTrip")}
              >
                <Text style={styles.createButtonText}>Créer un trajet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Itinéraires populaires</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularRoutesContainer}>
            {popularRoutes.length > 0 ? (
              popularRoutes.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.popularRouteCard, { backgroundColor: colors.card }]}
                  onPress={() =>
                    navigation.navigate("CreateTrip", {
                      fromCity: route.from_city,
                      toCity: route.to_city,
                    })
                  }
                >
                  <Text style={[styles.popularRouteTitle, { color: colors.text }]}>
                    {route.from_city} → {route.to_city}
                  </Text>
                  <Text style={[styles.popularRouteSubtitle, { color: colors.textSecondary }]}>
                    {route.trip_count} trajets • {route.avg_price} Fc
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={[styles.emptyPopularRoute, { backgroundColor: colors.card }]}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Aucun itinéraire populaire</Text>
              </View>
            )}
          </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  createTripButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createTripButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: -20,
  },
  statCard: {
    width: "30%",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 3,
  },
  section: {
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
    marginBottom: 15,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  tripTime: {
    fontSize: 16,
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
    justifyContent: "space-between",
    height: 60,
  },
  routePoint: {
    fontSize: 16,
    fontWeight: "500",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
  },
  tripStats: {
    flexDirection: "column",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  createButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  popularRoutesContainer: {
    flexDirection: "row",
  },
  popularRouteCard: {
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 200,
  },
  popularRouteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  popularRouteSubtitle: {
    fontSize: 14,
  },
  emptyPopularRoute: {
    padding: 20,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default DashboardScreen

