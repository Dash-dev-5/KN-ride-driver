import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"

// Helper function to handle API requests
const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = await AsyncStorage.getItem("userToken")
    console.log("Using token:", token)

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const config = {
      method,
      headers,
    }

    if (body && (method === "POST" || method === "PUT")) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_URL}${endpoint}`, config)
    console.log("API Response:", response)

    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      // Token might be expired, clear it and redirect to login
      await AsyncStorage.removeItem("userToken")
      throw new Error("Session expirée. Veuillez vous reconnecter.")
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// API service functions for driver app
export const createTrip = (tripData) => {
  return apiRequest("/trips", "POST", tripData)
}

export const getDriverTrips = (status = null) => {
  const queryParams = status ? `?status=${status}` : ""
  return apiRequest(`/trips/driver${queryParams}`)
}

export const getTripDetails = (tripId) => {
  return apiRequest(`/trips/${tripId}`)
}

export const getTripPassengers = (tripId) => {
  return apiRequest(`/bookings?trip_id=${tripId}`)
}

export const updateTripStatus = (tripId, status) => {
  return apiRequest(`/trips/${tripId}/status`, "PUT", { status })
}

export const updateLocation = (locationData) => {
  return apiRequest("/location", "POST", locationData)
}

export const confirmPayment = (paymentId) => {
  return apiRequest(`/payments/${paymentId}/confirm`, "POST")
}

export const ratePassenger = (ratingData) => {
  return apiRequest("/ratings", "POST", ratingData)
}

export const getDriverStats = () => {
  return apiRequest("/driver/stats")
}

export const getPopularRoutes = () => {
  return apiRequest("/trips/popular-routes")
}

export const getPopularCities = () => {
  return apiRequest("/trips/popular-routes")
}

export const createPayment = (paymentData) => {
  return apiRequest("/payments", "POST", paymentData)
}

export const rateDriver = (ratingData) => {
  return apiRequest("/ratings", "POST", ratingData)
}

export const searchTrips = (fromCity, toCity, date) => {
  let endpoint = "/trips?"
  const params = []

  if (fromCity) {
    params.push(`from_city=${fromCity}`)
  }
  if (toCity) {
    params.push(`to_city=${toCity}`)
  }
  if (date) {
    params.push(`departure_time=${date}`)
  }

  if (params.length > 0) {
    endpoint += params.join("&")
  }

  return apiRequest(endpoint)
}

