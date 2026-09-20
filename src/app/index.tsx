import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleReceiveLocation = () => {
    router.push('/location');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🚕</Text>
          </View>

          <Text style={styles.appName}>RideLink</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>
            Book a ride{'\n'}
            <Text style={styles.titleAccent}>for someone else.</Text>
          </Text>

          <Text style={styles.description}>
            Receive their location, set the destination, and open Uber with
            the pickup location ready to go.
          </Text>

          <View style={styles.flowCard}>
            <View style={styles.flowStep}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>1</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Receive location</Text>
                <Text style={styles.stepDescription}>
                  Get your friend's location from WhatsApp.
                </Text>
              </View>
            </View>

            <View style={styles.connector} />

            <View style={styles.flowStep}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>2</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Set destination</Text>
                <Text style={styles.stepDescription}>
                  Enter where they need to go.
                </Text>
              </View>
            </View>

            <View style={styles.connector} />

            <View style={styles.flowStep}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>3</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Open Uber</Text>
                <Text style={styles.stepDescription}>
                  Continue with the pickup and destination.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Pressable
            onPress={handleReceiveLocation}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Receive Location</Text>
            <Text style={styles.primaryButtonArrow}>→</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Your location data is used only for the ride workflow.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D10',
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#171B21',
    borderWidth: 1,
    borderColor: '#2A3038',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoEmoji: {
    fontSize: 22,
  },

  appName: {
    marginLeft: 12,
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },

  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.2,
  },

  titleAccent: {
    color: '#6EE7B7',
  },

  description: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 25,
    color: '#9CA3AF',
    maxWidth: 430,
  },

  flowCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#12161B',
    borderWidth: 1,
    borderColor: '#242A32',
  },

  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B2C27',
    borderWidth: 1,
    borderColor: '#315A4C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6EE7B7',
  },

  stepContent: {
    flex: 1,
    marginLeft: 14,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  stepDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: '#8B949E',
  },

  connector: {
    width: 1,
    height: 18,
    backgroundColor: '#30363D',
    marginLeft: 18,
    marginVertical: 4,
  },

  bottomSection: {
    paddingTop: 16,
  },

  primaryButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#6EE7B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  primaryButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#07110D',
  },

  primaryButtonArrow: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#07110D',
  },

  footerText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: '#626B75',
  },
});