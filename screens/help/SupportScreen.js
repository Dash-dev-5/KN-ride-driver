"use client"

import { useContext, useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

const SupportScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // FAQ animations
  const faqAnimations = {
    1: useRef(new Animated.Value(0)).current,
    2: useRef(new Animated.Value(0)).current,
    3: useRef(new Animated.Value(0)).current,
  }

  // Animer l'entrée du composant
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const toggleFaq = (id) => {
    // Si on clique sur un FAQ déjà ouvert, on le ferme
    if (expandedFaq === id) {
      Animated.timing(faqAnimations[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpandedFaq(null)
      })
    } else {
      // Si un autre FAQ est ouvert, on le ferme d'abord
      if (expandedFaq) {
        Animated.timing(faqAnimations[expandedFaq], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start()
      }

      // Puis on ouvre le nouveau
      setExpandedFaq(id)
      Animated.timing(faqAnimations[id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      Alert.alert(
        "Message envoyé",
        "Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      )
    }, 1500)
  }

  const renderFaqItem = (id, question, answer) => {
    const height = faqAnimations[id].interpolate({
      inputRange: [0, 1],
      outputRange: [0, answer.length > 100 ? 120 : 80],
    })

    return (
      <View key={id}>
        <TouchableOpacity
          style={[styles.faqItem, { borderColor: colors.border }]}
          onPress={() => toggleFaq(id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: faqAnimations[id].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            }}
          >
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={{
            height: height,
            overflow: "hidden",
          }}
        >
          <View style={[styles.faqAnswer, { backgroundColor: colors.card + "80", borderColor: colors.border }]}>
            <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>{answer}</Text>
          </View>
        </Animated.View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Contacter le support</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Notre équipe est à votre disposition pour répondre à vos questions et résoudre vos problèmes.
          </Text>

          <View style={styles.contactOptions}>
            <TouchableOpacity
              style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name="call-outline" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.contactOptionTitle, { color: colors.text }]}>Téléphone</Text>
              <Text style={[styles.contactOptionValue, { color: colors.primary }]}>+243 123 456 789</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name="mail-outline" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.contactOptionTitle, { color: colors.text }]}>Email</Text>
              <Text style={[styles.contactOptionValue, { color: colors.primary }]}>support@taxibooking.com</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Envoyez-nous un message</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Sujet</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Entrez le sujet de votre message"
                placeholderTextColor={colors.textSecondary}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Message</Text>
              <TextInput
                style={[
                  styles.messageInput,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Décrivez votre problème ou votre question en détail..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
                {loading ? "Envoi en cours..." : "Envoyer"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.faqSection}>
            <Text style={[styles.faqTitle, { color: colors.text }]}>Questions fréquentes</Text>

            {renderFaqItem(
              1,
              "Comment annuler une course ?",
              "Pour annuler une course, allez dans l'onglet 'Mes Trajets' où vous verrez toutes vos courses. Vous pouvez annuler une course jusqu'à 1 heure avant le départ. Passé ce délai, l'annulation n'est plus possible.",
            )}

            {renderFaqItem(
              2,
              "Comment trouver mon trajet ?",
              "Pour trouver un trajet, utilisez la barre de recherche sur l'écran d'accueil. Entrez votre ville de départ, votre destination et la date souhaitée, puis appuyez sur 'Rechercher'. Vous verrez alors tous les trajets disponibles correspondant à vos critères.",
            )}

            {renderFaqItem(
              3,
              "Comment fonctionne le paiement ?",
              "Une fois le paiement initialisé, vous devez le confirmer avec un mot de passe dans votre application de mobile money. Assurez-vous d'avoir suffisamment de fonds sur votre compte et que votre numéro de téléphone est correct.",
            )}
          </View>
        </Animated.View>
      </ScrollView>
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
  contactOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  contactOption: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  contactOptionValue: {
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  faqSection: {
    marginBottom: 30,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  faqQuestion: {
    fontSize: 16,
    flex: 1,
  },
  faqAnswer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default SupportScreen

