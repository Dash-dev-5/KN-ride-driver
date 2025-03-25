"use client"

import { createContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  const login = async (phoneNumber, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/driver/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          password: password,
        }),
      })

      const dataResponse = await response.json()
      const data = dataResponse.data

      if (response.ok) {
        console.log(data)

        setUserToken(data.token)
        setUserInfo(data.user)

        if (data?.token) {
          console.log("token: ", data.token)
          await AsyncStorage.setItem("userToken", data.token)
        } else {
          console.error("Error: data.token is undefined or null")
        }

        if (data?.user) {
          console.log("user: ", data.user)
          await AsyncStorage.setItem("userInfo", JSON.stringify(data.user))
        } else {
          console.error("Error: data.user is undefined or null")
        }
      } else {
        throw new Error(data.message || "Une erreur est survenue")
      }
    } catch (error) {
      console.log("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      console.log(userData)

      const response = await fetch(`${API_URL}/auth/driver/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Registration successful:", data)
        return data
      } else {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }
    } catch (error) {
      console.log("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userInfo")
      setUserToken(null)
      setUserInfo(null)
    } catch (error) {
      console.log("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLoggedIn = async () => {
    try {
      setIsLoading(true)
      const userToken = await AsyncStorage.getItem("userToken")
      const userInfo = await AsyncStorage.getItem("userInfo")

      if (userInfo) {
        setUserInfo(JSON.parse(userInfo))
      }

      if (userToken) {
        setUserToken(userToken)
      }

      setIsLoading(false)
    } catch (e) {
      console.log("isLogged in error:", e)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

