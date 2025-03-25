"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { format } from "date-fns"

const { width, height } = Dimensions.get("window")

const TrackingScreen = ({ route, navigation }) => {
  const { bookingId, tripDetails } = route.params
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [tripStatus, setTripStatus] = useState("waiting") // waiting, ongoing, completed
  const [estimatedArrival, setEstimatedArrival] = useState(15) // minutes

  useEffect(() => {
    // Get user's location
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permission denied", "Permission to access location was denied")
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      } catch (error) {
        console.log("Error getting location:", error)
      }
    }

    // Simulate driver location (in a real app, this would come from an API)
    const simulateDriverLocation = () => {
      // Simulated driver location (slightly offset from user location)
      setTimeout(() => {
        if (userLocation) {
          setDriverLocation({
            latitude: userLocation.latitude - 0.01,
            longitude: userLocation.longitude - 0.01,
          })
          setLoading(false)
        }
      }, 2000)
    }

    getUserLocation()
    simulateDriverLocation()
    // Simulate trip progress
    const tripSimulation = setInterval(() => {
      if (tripStatus === "waiting") {
        setTripStatus("ongoing")
      } else if (tripStatus === "ongoing") {
        if (estimatedArrival > 0) {
          setEstimatedArrival((prev) => prev - 1)
        } else {
          setTripStatus("completed")
          clearInterval(tripSimulation)

          // Navigate to rating screen after trip completion
          setTimeout(() => {
            navigation.navigate("Rating", { bookingId })
          }, 3000)
        }
      }
    }, 5000) // Update every 5 seconds for simulation

    // Cleanup
    return () => {
      clearInterval(tripSimulation)
    }
  }, [userLocation, tripStatus, estimatedArrival])

  // Update driver location simulation
  useEffect(() => {
    if (userLocation && tripStatus === "ongoing") {
      const driverMovement = setInterval(() => {
        setDriverLocation((prev) => {
          if (!prev) return null

          // Move driver closer to user
          const latDiff = userLocation.latitude - prev.latitude
          const lngDiff = userLocation.longitude - prev.longitude

          return {
            latitude: prev.latitude + latDiff * 0.1,
            longitude: prev.longitude + lngDiff * 0.1,
          }
        })
      }, 3000)

      return () => clearInterval(driverMovement)
    }
  }, [userLocation, tripStatus])

  const renderStatusCard = () => {
    switch (tripStatus) {
      case "waiting":
        return (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>En attente du chauffeur</Text>
              <View style={[styles.statusIndicator, { backgroundColor: "#FFA500" }]} />
            </View>
            <Text style={styles.statusMessage}>Le chauffeur est en route pour vous prendre en charge</Text>
            <ActivityIndicator color="#0066CC" style={styles.loader} />
          </View>
        )
      case "ongoing":
        return (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Trajet en cours</Text>
              <View style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]} />
            </View>
            <Text style={styles.statusMessage}>
              Arrivée estimée dans {estimatedArrival} minute{estimatedArrival > 1 ? "s" : ""}
            </Text>
            <View style={styles.tripProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${100 - (estimatedArrival / 15) * 100}%` }]} />
              </View>
            </View>
          </View>
        )
      case "completed":
        return (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Trajet terminé</Text>
              <View style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]} />
            </View>
            <Text style={styles.statusMessage}>Vous êtes arrivé à destination</Text>
            <TouchableOpacity style={styles.rateButton} onPress={() => navigation.navigate("Rating", { bookingId })}>
              <Text style={styles.rateButtonText}>Noter le chauffeur</Text>
            </TouchableOpacity>
          </View>
        )
    }
  }

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Votre position">
            <View style={styles.userMarker}>
              <Ionicons name="person" size={18} color="#FFFFFF" />
            </View>
          </Marker>
        )}

        {driverLocation && (
          <Marker coordinate={driverLocation} title="Chauffeur">
            <View style={styles.driverMarker}>
              <Ionicons name="car" size={18} color="#FFFFFF" />
            </View>
          </Marker>
        )}

        {userLocation && driverLocation && (
          <Polyline coordinates={[userLocation, driverLocation]} strokeColor="#0066CC" strokeWidth={3} />
        )}
      </MapView>

      <View style={styles.tripInfoCard}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripRoute}>
            {tripDetails.fromCity} → {tripDetails.toCity}
          </Text>
          <Text style={styles.tripDate}>{format(new Date(tripDetails.departureTime), "dd/MM/yyyy HH:mm")}</Text>
        </View>

        <View style={styles.driverInfo}>
          <Image source={require("../assets/driver.jpeg")} style={styles.driverAvatar} />
          {/* driver-placeholder */}
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>John Doe</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>Toyota Corolla</Text>
          <Text style={styles.vehicleNumber}>AB-123-CD</Text>
        </View>
      </View>

      {renderStatusCard()}
    </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  map: {
    width: width,
    height: height,
  },
  userMarker: {
    backgroundColor: "#0066CC",
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  driverMarker: {
    backgroundColor: "#FF6B6B",
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  tripInfoCard: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    marginBottom: 10,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  tripDate: {
    fontSize: 14,
    color: "#666666",
    marginTop: 3,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverDetails: {
    flex: 1,
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
  callButton: {
    backgroundColor: "#0066CC",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleName: {
    fontSize: 14,
    color: "#333333",
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  statusCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  loader: {
    marginTop: 5,
  },
  tripProgress: {
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#EEEEEE",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  rateButton: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  rateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default TrackingScreen

