"use client"

import { useContext, useState, useRef, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

// Données des questions fréquentes
const faqData = [
  {
    category: "Réservation",
    icon: "calendar-outline",
    items: [
      {
        question: "Comment réserver un trajet",
        answer:
          "Pour réserver un trajet, accédez à l'écran d'accueil, entrez votre point de départ, votre destination et la date souhaitée. Appuyez sur 'Rechercher' pour voir les trajets disponibles, puis sélectionnez celui qui vous convient et suivez les instructions pour finaliser votre réservation.",
      },
      {
        question: "Annuler une réservation",
        answer:
          "Pour annuler une réservation, allez dans l'onglet 'Mes Trajets', trouvez le trajet que vous souhaitez annuler et appuyez sur 'Annuler la course'. Notez que vous ne pouvez annuler une course que jusqu'à 1 heure avant le départ prévu.",
      },
      {
        question: "Modifier une réservation",
        answer:
          "Actuellement, il n'est pas possible de modifier directement une réservation. Vous devez annuler votre réservation actuelle (si possible) et en créer une nouvelle avec les détails souhaités.",
      },
    ],
  },
  {
    category: "Paiement",
    icon: "card-outline",
    items: [
      {
        question: "Méthodes de paiement acceptées",
        answer:
          "Nous acceptons les paiements par mobile money (Orange Money, Wave, Free Money). Vous pouvez ajouter ou modifier vos méthodes de paiement dans la section 'Méthodes de paiement' de votre profil.",
      },
      {
        question: "Problèmes de paiement",
        answer:
          "Si vous rencontrez des problèmes de paiement, vérifiez que votre compte mobile money est actif et dispose de fonds suffisants. Assurez-vous également que le numéro de téléphone associé est correct. Si le problème persiste, contactez notre support.",
      },
      {
        question: "Remboursements",
        answer:
          "Les remboursements sont traités automatiquement en cas d'annulation éligible. Le montant sera crédité sur votre compte mobile money dans un délai de 3 à 5 jours ouvrables.",
      },
    ],
  },
  {
    category: "Compte",
    icon: "person-outline",
    items: [
      {
        question: "Modifier mes informations",
        answer:
          "Pour modifier vos informations personnelles, accédez à votre profil en appuyant sur l'onglet 'Profil', puis sur 'Informations personnelles'. Vous pourrez y modifier votre nom, numéro de téléphone, email et adresse.",
      },
      {
        question: "Changer de mot de passe",
        answer:
          "Pour changer votre mot de passe, allez dans votre profil, puis dans 'Informations personnelles'. Dans la section 'Sécurité', appuyez sur 'Changer le mot de passe' et suivez les instructions.",
      },
      {
        question: "Supprimer mon compte",
        answer:
          "Pour supprimer votre compte, veuillez contacter notre support. Notez que cette action est irréversible et que toutes vos données, y compris l'historique de vos trajets, seront définitivement supprimées.",
      },
    ],
  },
  {
    category: "Trajet",
    icon: "car-outline",
    items: [
      {
        question: "Suivre mon chauffeur",
        answer:
          "Pour suivre votre chauffeur en temps réel, accédez à l'écran 'Mes Trajets', sélectionnez votre trajet en cours, puis appuyez sur 'Suivre'. Une carte s'affichera avec la position en temps réel de votre chauffeur.",
      },
      {
        question: "Contacter le chauffeur",
        answer:
          "Pour contacter votre chauffeur, accédez aux détails de votre trajet et appuyez sur l'icône de téléphone à côté des informations du chauffeur. Vous pouvez également envoyer un message via l'application.",
      },
      {
        question: "Signaler un problème",
        answer:
          "Pour signaler un problème avec votre trajet, accédez à l'historique de vos trajets, sélectionnez le trajet concerné, puis appuyez sur 'Signaler un problème'. Décrivez le problème rencontré et notre équipe vous contactera dans les plus brefs délais.",
      },
    ],
  },
]

const HelpCenterScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    // Animation d'entrée
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

  // Fonction de recherche
  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text.trim() === "") {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Recherche dans toutes les questions
    const results = []
    faqData.forEach((category) => {
      category.items.forEach((item) => {
        if (
          item.question.toLowerCase().includes(text.toLowerCase()) ||
          item.answer.toLowerCase().includes(text.toLowerCase())
        ) {
          results.push({
            category: category.category,
            icon: category.icon,
            ...item,
          })
        }
      })
    })

    setSearchResults(results)
  }

  // Modifier la fonction renderHelpTopic pour éviter d'utiliser des hooks à l'intérieur
  const renderHelpTopic = useCallback(
    (topic, index) => {
      return (
        <Animated.View
          key={index}
          style={[
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + index * 10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.topicCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.topicHeader}>
              <Ionicons name={topic.icon} size={24} color={colors.primary} />
              <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.category}</Text>
            </View>
            {topic.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.helpItem}
                onPress={() => navigation.navigate("Support", { question: item.question })}
              >
                <Text style={[styles.helpItemText, { color: colors.textSecondary }]}>{item.question}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )
    },
    [navigation, colors, fadeAnim],
  )

  const renderSearchResult = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.searchResultItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => {
          Alert.alert(item.question, item.answer)
        }}
      >
        <View style={styles.searchResultHeader}>
          <Ionicons name={item.icon} size={20} color={colors.primary} />
          <Text style={[styles.searchResultCategory, { color: colors.textSecondary }]}>{item.category}</Text>
        </View>
        <Text style={[styles.searchResultQuestion, { color: colors.text }]}>{item.question}</Text>
        <Text style={[styles.searchResultAnswer, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.answer}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Centre d'aide</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Comment pouvons-nous vous aider aujourd'hui ?
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.searchBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher une question..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {isSearching ? (
          <View style={styles.searchResultsContainer}>
            <Text style={[styles.searchResultsTitle, { color: colors.text }]}>
              {searchResults.length > 0 ? `${searchResults.length} résultat(s) trouvé(s)` : "Aucun résultat trouvé"}
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `search-result-${index}`}
              contentContainerStyle={styles.searchResultsList}
            />
          </View>
        ) : (
          <>
            <View style={styles.topicsContainer}>{faqData.map((topic, index) => renderHelpTopic(topic, index))}</View>

            <Animated.View
              style={[
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.contactTitle, { color: colors.text }]}>Besoin de plus d'aide ?</Text>
                <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate("Support")}
                >
                  <Text style={[styles.contactButtonText, { color: colors.buttonText }]}>Contacter le support</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        )}
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
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  topicsContainer: {
    padding: 20,
  },
  topicCard: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  helpItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  helpItemText: {
    fontSize: 16,
  },
  contactCard: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchResultsContainer: {
    padding: 20,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  searchResultsList: {
    paddingBottom: 20,
  },
  searchResultItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  searchResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchResultCategory: {
    fontSize: 12,
    marginLeft: 5,
  },
  searchResultQuestion: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  searchResultAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default HelpCenterScreen

