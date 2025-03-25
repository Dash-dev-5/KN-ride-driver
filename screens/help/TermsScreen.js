"use client"

import { useContext } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { ThemeContext } from "../../context/ThemeContext"
import { getColors } from "../../styles/theme"

const TermsScreen = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const colors = getColors(isDarkMode)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Conditions d'utilisation</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>Dernière mise à jour: 25 Mars 2024</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptation des conditions</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              En accédant ou en utilisant l'application Taxi Booking, vous acceptez d'être lié par ces conditions
              d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Description du service</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Taxi Booking est une plateforme qui permet aux utilisateurs de réserver des trajets avec des chauffeurs
              partenaires. Nous ne fournissons pas de services de transport directement, mais facilitons la mise en
              relation entre les passagers et les chauffeurs.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Inscription et compte</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Pour utiliser notre service, vous devez créer un compte en fournissant des informations précises et
              complètes. Vous êtes responsable de maintenir la confidentialité de votre mot de passe et de toutes les
              activités qui se produisent sous votre compte.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Réservations et paiements</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              En effectuant une réservation, vous acceptez de payer le montant indiqué. Les paiements sont traités via
              les méthodes de paiement disponibles sur l'application. Des frais d'annulation peuvent s'appliquer selon
              notre politique d'annulation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Comportement des utilisateurs</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Vous acceptez d'utiliser notre service de manière responsable et de respecter les chauffeurs et les autres
              utilisateurs. Tout comportement abusif, illégal ou perturbateur peut entraîner la suspension ou la
              résiliation de votre compte.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Limitation de responsabilité</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Taxi Booking n'est pas responsable des actions, comportements ou conduite des chauffeurs ou des passagers.
              Nous ne sommes pas responsables des dommages directs, indirects, accessoires ou consécutifs résultant de
              l'utilisation de notre service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Modifications des conditions</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet
              dès leur publication sur l'application. Votre utilisation continue du service après ces modifications
              constitue votre acceptation des nouvelles conditions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Loi applicable</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Ces conditions sont régies par les lois en vigueur dans notre juridiction, sans égard aux principes de
              conflits de lois.
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

export default TermsScreen

