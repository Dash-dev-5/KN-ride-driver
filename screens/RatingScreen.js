"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { rateDriver } from "../api/apiService"

const RatingScreen = ({ route, navigation }) => {
  const { bookingId } = route.params
  const [rating, setRating] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [vehicle_condition, setVehicle_condition] = useState(0)
  const [driver_behavior, setDriver_behavior] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner une note")
      return
    }

    setLoading(true)
    try {
      //   {
      //     "trip_id": 1,
      //     "rating": 5,
      //     "comment": "Great service!",
      //     "punctuality": 5,
      //     "vehicle_condition": 4,
      //     "driver_behavior": 5
      // }

      const ratingData = {
        trip_id: bookingId,
        rating: rating,
        comment: comment,
        punctuality: punctuality,
        vehicle_condition: vehicle_condition,
        driver_behavior: driver_behavior,
      }

      await rateDriver(ratingData)

      setLoading(false)
      Alert.alert("Merci !", "Votre évaluation a été enregistrée avec succès.", [
        { text: "OK", onPress: () => navigation.navigate("MainTabs") },
      ])
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur", error.message)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starContainer}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={40}
            color={i <= rating ? "#FFD700" : "#CCCCCC"}
          />
        </TouchableOpacity>,
      )
    }
    return stars
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../assets/driver.jpeg")} style={styles.driverAvatar} />
        {/* driver-placeholder.png */}

        <Text style={styles.title}>Comment s'est passé votre trajet ?</Text>
        <Text style={styles.subtitle}>Votre avis nous aide à améliorer l'expérience de tous les utilisateurs</Text>

        <View style={styles.ratingContainer}>{renderStars()}</View>

        <View style={styles.ratingLabels}>
          <Text style={styles.ratingLabelLeft}>Mauvais</Text>
          <Text style={styles.ratingLabelRight}>Excellent</Text>
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Commentaire (optionnel)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Partagez votre expérience..."
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Soumettre</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("MainTabs")} disabled={loading}>
          <Text style={styles.skipButtonText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  driverAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  starContainer: {
    padding: 5,
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  ratingLabelLeft: {
    fontSize: 14,
    color: "#666666",
  },
  ratingLabelRight: {
    fontSize: 14,
    color: "#666666",
  },
  commentContainer: {
    width: "100%",
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
    textAlignVertical: "top",
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666666",
    fontSize: 16,
  },
})

export default RatingScreen

