"use client"

import { useContext } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

const PrivacyPolicyScreen = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Politique de confidentialité</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>Dernière mise à jour: 25 Mars 2024</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Collecte des informations</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous collectons les informations que vous nous fournissez directement, comme vos coordonnées, informations
              de paiement et préférences de voyage. Nous collectons également automatiquement certaines informations
              lorsque vous utilisez notre application, notamment votre localisation, informations sur l'appareil et
              données d'utilisation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Utilisation des informations</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous utilisons vos informations pour fournir, maintenir et améliorer nos services, traiter vos
              réservations et paiements, communiquer avec vous, et assurer la sécurité de notre plateforme. Nous pouvons
              également utiliser vos données pour développer de nouvelles fonctionnalités et vous proposer des offres
              personnalisées.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Partage des informations</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous partageons vos informations avec les chauffeurs pour faciliter vos trajets, avec nos prestataires de
              services qui nous aident à exploiter notre plateforme, et lorsque la loi l'exige. Nous pouvons également
              partager des données anonymisées à des fins d'analyse et d'amélioration de service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Protection des données</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos
              informations contre tout accès non autorisé, perte ou altération. Cependant, aucune méthode de
              transmission ou de stockage électronique n'est totalement sécurisée.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Vos droits</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Vous avez le droit d'accéder, de corriger, de supprimer vos données personnelles et de limiter leur
              traitement. Vous pouvez également vous opposer au traitement de vos données et demander leur portabilité.
              Pour exercer ces droits, contactez-nous via les coordonnées fournies dans l'application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Conservation des données</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services, respecter nos
              obligations légales, résoudre les litiges et faire appliquer nos accords. La durée de conservation peut
              varier en fonction du type d'information et des exigences légales.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Modifications de la politique</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Nous vous informerons de tout
              changement important par le biais de l'application ou par d'autres moyens. Votre utilisation continue de
              nos services après ces modifications constitue votre acceptation de la nouvelle politique.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Contact</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité ou nos
              pratiques en matière de données, veuillez nous contacter à privacy@taxibooking.com.
            </Text>
          </View>
        </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
})

export default PrivacyPolicyScreen

