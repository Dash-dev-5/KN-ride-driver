"use client"

import { useState, useContext, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ratePassenger } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const RatePassengerScreen = ({ route, navigation }) => {
  const { passengerId, tripId } = route.params
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
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

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner une note")
      return
    }

    setLoading(true)
    try {
      const ratingData = {
        trip_id: tripId,
        passenger_id: passengerId,
        rating: rating,
        comment: comment,
      }

      await ratePassenger(ratingData)

      setLoading(false)
      Alert.alert("Merci !", "Votre évaluation a été enregistrée avec succès.", [
        { text: "OK", onPress: () => navigation.goBack() },
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
            color={i <= rating ? "#FFD700" : colors.textSecondary}
          />
        </TouchableOpacity>,
      )
    }
    return stars
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.title, { color: colors.text }]}>Noter le passager</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Votre avis nous aide à améliorer l'expérience de tous les utilisateurs
          </Text>

          <View style={styles.ratingContainer}>{renderStars()}</View>

          <View style={styles.ratingLabels}>
            <Text style={[styles.ratingLabelLeft, { color: colors.textSecondary }]}>Mauvais</Text>
            <Text style={[styles.ratingLabelRight, { color: colors.textSecondary }]}>Excellent</Text>
          </View>

          <View style={styles.commentContainer}>
            <Text style={[styles.commentLabel, { color: colors.text }]}>Commentaire (optionnel)</Text>
            <TextInput
              style={[
                styles.commentInput,
                { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Partagez votre expérience avec ce passager..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitRating}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Soumettre</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.skipButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
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
    alignSelf: "center",
    marginBottom: 30,
  },
  ratingLabelLeft: {
    fontSize: 14,
  },
  ratingLabelRight: {
    fontSize: 14,
  },
  commentContainer: {
    width: "100%",
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

export default RatePassengerScreen

