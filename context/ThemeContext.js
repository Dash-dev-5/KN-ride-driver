"use client"

import { createContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("themePreference")
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "dark")
        } else {
          // Use device theme as default if no stored preference
          setIsDarkMode(deviceTheme === "dark")
        }
      } catch (error) {
        console.log("Error loading theme preference:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadThemePreference()
  }, [deviceTheme])

  // Save theme preference when it changes
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode
      setIsDarkMode(newTheme)
      await AsyncStorage.setItem("themePreference", newTheme ? "dark" : "light")
    } catch (error) {
      console.log("Error saving theme preference:", error)
    }
  }

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isLoading }}>{children}</ThemeContext.Provider>
}

