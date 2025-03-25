"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { searchTrips } from "../api/apiService"

const TripListScreen = ({ route, navigation }) => {
  const { fromCity, toCity, date } = route.params
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  console.log("data :", fromCity, toCity, date)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await searchTrips(fromCity, toCity, date)
        // console.log('lo :g  :',data.data[0].driver);

        setTrips(data.data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchTrips()
  }, [fromCity, toCity, date])

  const fetchTripsAll = async () => {
    setLoading(true)
    try {
      const data = await searchTrips(null, null, null)
      console.log("lo :g  :", data)

      setTrips(data.data)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const renderTripItem = ({ item }) => {
    const departureTime = new Date(item.departure_time)
    // const arrivalTime = new Date(item.arrival_time)

    return (
      <TouchableOpacity style={styles.tripCard} onPress={() => navigation.navigate("TripDetail", { tripId: item.id })}>
        <View style={styles.tripHeader}>
          <View style={styles.driverInfo}>
            <Image
              source={item?.driver?.avatar ? { uri: item?.driver?.avatar } : require("../assets/driver.jpeg")}
              // driver-placeholder
              style={styles.driverAvatar}
            />
            <View>
              <Text style={styles.driverName}>{item?.driver?.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {item?.driver?.rating?.toFixed(1) ? item?.driver?.rating?.toFixed(1) : 2}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{item?.driver?.vehicle_model}</Text>
            <Text style={styles.vehicleNumber}>{item?.driver?.license_number}</Text>
          </View>
        </View>

        <View style={styles.tripDetails}>
          <View style={styles.locationContainer}>
            <View style={styles.locationTimeline}>
              <View style={styles.startDot} />
              <View style={styles.timelineLine} />
              <View style={styles.endDot} />
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationPoint}>
                <Text style={styles.time}>
                  {format(departureTime, "EEEE 'le' d MMMM y 'à' HH:mm", { locale: fr })}{" "}
                </Text>
                <Text style={styles.location}>{item?.from_city}</Text>
              </View>

              <View style={styles.locationPoint}>
                {/* <Text style={styles.time}>{format(arrivalTime, "HH:mm")}</Text> */}
                <Text style={styles.location}>{item?.to_city}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tripFooter}>
            <View style={styles.seatsContainer}>
              <Ionicons name="person" size={18} color="#666666" />
              <Text style={styles.seatsText}>
                {item.available_seats} place{item.available_seats > 1 ? "s" : ""} disponible
                {item.available_seats > 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price_per_seat} Fc</Text>
              <Text style={styles.perSeat}>par place</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (trips.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="car-outline" size={60} color="#CCCCCC" />
        <Text style={styles.noTripsText}>Aucun trajet disponible</Text>
        <Text style={styles.noTripsSubtext}>Aucun trajet trouvé pour cette date et cette destination</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Modifier la recherche</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTripsAll}>
          <Text style={styles.retryButtonText}>Afficher tous les trajets</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchInfo}>
        <Text style={styles.searchRoute}>
          {fromCity ? fromCity : "Tous les Départ"} → {toCity ? toCity : "Tous les Arrivés"}
        </Text>
        <Text style={styles.searchDate}>
          {date ? format(new Date(date), "EEEE d MMMM yyyy", { locale: fr }) : "Toutes les dates"}
        </Text>
      </View>

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
    backgroundColor: "#F8F8F8",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  searchInfo: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  searchRoute: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  searchDate: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
    textTransform: "capitalize",
  },
  listContainer: {
    padding: 15,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 14,
    color: "#666666",
  },
  vehicleInfo: {
    alignItems: "flex-end",
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  vehicleNumber: {
    fontSize: 12,
    color: "#666666",
    marginTop: 3,
  },
  tripDetails: {
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  locationTimeline: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0066CC",
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: "#CCCCCC",
    marginVertical: 5,
  },
  endDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
  },
  locationInfo: {
    flex: 1,
  },
  locationPoint: {
    marginBottom: 20,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  location: {
    fontSize: 14,
    color: "#666666",
    marginTop: 3,
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666666",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
  },
  perSeat: {
    fontSize: 12,
    color: "#666666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  noTripsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
  },
  noTripsSubtext: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
})

export default TripListScreen

