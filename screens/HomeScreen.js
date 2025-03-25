"use client"

import { useEffect, useState, useContext, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Entypo from "@expo/vector-icons/Entypo"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import { getPopularCities } from "../api/apiService"
import { ThemeContext } from "../context/ThemeContext"
import { getColors } from "../styles/theme"

const HomeScreen = ({ navigation }) => {
  const [fromCity, setFromCity] = useState(null)
  const [toCity, setToCity] = useState(null)
  const [date, setDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [popularCities, setPopularCities] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const searchBoxAnim = useRef(new Animated.Value(0.95)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Animation de pulsation pour le bouton de recherche
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        const data = await getPopularCities()
        setPopularCities(data)
        console.log("suka na bord:", data)
        setLoading(false)

        // Démarrer les animations une fois les données chargées
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
          Animated.timing(searchBoxAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          startPulseAnimation()
        })
      } catch (error) {
        setLoading(false)
      }
    }

    fetchPopularCities()
  }, [])

  useEffect(() => {
    console.log(date)
  }, [date])

  const handleSearch = () => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : null

    // Animation de clic sur le bouton
    Animated.sequence([
      Animated.timing(searchBoxAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(searchBoxAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("TripList", {
        fromCity,
        toCity,
        date: formattedDate,
      })
    })
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)
  }

  const renderCityItem = (city, index) => {
    return (
      <Animated.View
        key={index}
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
          style={[styles.cityCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          onPress={() => {
            setFromCity(city.from_city)
            setToCity(city.to_city)
          }}
        >
          <Image source={require("../assets/city.jpeg")} style={styles.cityImage} />
          <Text style={[styles.cityName, { color: colors.text }]}>
            {city.from_city} à {city.to_city}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

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
        <Text style={styles.greeting}>Bonjour 👋</Text>
        <Text style={styles.subtitle}>Où souhaitez-vous aller aujourd'hui ?</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: searchBoxAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.searchBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={24} color={colors.primary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ville de départ"
              placeholderTextColor={colors.textSecondary}
              value={fromCity}
              onChangeText={setFromCity}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.inputContainer}>
            <Ionicons name="navigate" size={24} color={colors.primary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Destination"
              placeholderTextColor={colors.textSecondary}
              value={toCity}
              onChangeText={setToCity}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              {date ? (
                <Text style={[styles.dateText, { color: colors.text }]}>{format(date, "dd-MM-yyyy")}</Text>
              ) : (
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>jj-mm-aaaa</Text>
              )}
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
                themeVariant={isDarkMode ? "dark" : "light"}
              />
            )}
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setDate(null)
              }}
            >
              <Entypo name="erase" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.popularContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Les courses populaires</Text>
        <View style={styles.popularCities}>
          {loading ? (
            <ActivityIndicator color={colors.primary} size={"large"} />
          ) : (
            popularCities.map((city, index) => renderCityItem(city, index))
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.promoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Offres spéciales</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            }}
          >
            <View style={styles.promoCard}>
              <Text style={styles.promoTitle}>-20% sur votre premier trajet</Text>
              <Text style={styles.promoDescription}>Utilisez le code WELCOME20</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [150, 0],
                  }),
                },
              ],
            }}
          >
            <View style={[styles.promoCard, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.promoTitle}>Trajet gratuit</Text>
              <Text style={styles.promoDescription}>Parrainez un ami et gagnez un trajet</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  searchContainer: {
    marginTop: -20,
    marginHorizontal: 20,
  },
  searchBox: {
    borderRadius: 10,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    marginVertical: 7,
  },
  divider: {
    height: 1,
    marginVertical: 5,
  },
  searchButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  popularContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  popularCities: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cityCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cityImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cityName: {
    padding: 10,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  promoContainer: {
    padding: 20,
    marginBottom: 20,
  },
  promoCard: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 250,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  promoDescription: {
    color: "#FFFFFF",
    fontSize: 14,
  },
})

export default HomeScreen

