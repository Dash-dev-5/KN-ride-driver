// Light theme colors
export const lightColors = {
  primary: "#0066CC",
  background: "#F8F8F8",
  card: "#FFFFFF",
  text: "#333333",
  textSecondary: "#666666",
  border: "#EEEEEE",
  notification: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFA500",
  buttonText: "#FFFFFF",
  inputBackground: "#F8F8F8",
  shadow: "#000",
}

// Dark theme colors
export const darkColors = {
  primary: "#3B82F6",
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  border: "#333333",
  notification: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFA500",
  buttonText: "#FFFFFF",
  inputBackground: "#2A2A2A",
  shadow: "#000",
}

// Get colors based on theme
export const getColors = (isDarkMode) => {
  return isDarkMode ? darkColors : lightColors
}

