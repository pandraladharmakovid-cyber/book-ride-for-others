import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';

import { geocodeAddress } from '../services/geocoding';
import { openUberRideRequest } from '../services/uber';

export default function DestinationScreen() {
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
    address?: string;
  }>();

  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pickupAddress = params.address || 'Pickup location received';
  const latitude = params.latitude || '';
  const longitude = params.longitude || '';

  const canContinue =
    destination.trim().length > 0 &&
    latitude.length > 0 &&
    longitude.length > 0 &&
    !loading;

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const pickupLatitude = Number(latitude);
      const pickupLongitude = Number(longitude);

      if (
        !Number.isFinite(pickupLatitude) ||
        !Number.isFinite(pickupLongitude)
      ) {
        throw new Error('The pickup location is invalid.');
      }

      // Convert the destination text into real coordinates.
      const dropoff = await geocodeAddress(destination);

      // Open Uber with both pickup and destination populated.
      const opened = await openUberRideRequest({
        pickup: {
          latitude: pickupLatitude,
          longitude: pickupLongitude,
          address: pickupAddress,
          nickname: 'Pickup',
        },
        dropoff: {
          latitude: dropoff.latitude,
          longitude: dropoff.longitude,
          address: dropoff.address,
          nickname: 'Destination',
        },
      });

      if (!opened) {
        throw new Error(
          'Uber could not be opened. Please make sure the Uber app is installed on this Android device.',
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              disabled={loading}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            <Text style={styles.screenTitle}>Destination</Text>

            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.content}>
            {/* Pickup */}
            <Text style={styles.eyebrow}>PICKUP</Text>

            <View style={styles.pickupCard}>
              <View style={styles.pickupIcon}>
                <Text style={styles.pickupIconText}>📍</Text>
              </View>

              <View style={styles.pickupDetails}>
                <Text style={styles.pickupTitle}>
                  Friend's location
                </Text>

                <Text
                  style={styles.pickupAddress}
                  numberOfLines={2}
                >
                  {pickupAddress}
                </Text>

                {latitude && longitude ? (
                  <Text style={styles.coordinates}>
                    {latitude}, {longitude}
                  </Text>
                ) : null}
              </View>

              <View style={styles.checkCircle}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            </View>

            {/* Destination */}
            <Text style={[styles.eyebrow, styles.destinationLabel]}>
              DESTINATION
            </Text>

            <View
              style={[
                styles.inputContainer,
                destination.length > 0 &&
                  styles.inputContainerActive,
              ]}
            >
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                value={destination}
                onChangeText={(text) => {
                  setDestination(text);
                  setErrorMessage('');
                }}
                placeholder="Where are they going?"
                placeholderTextColor="#69727D"
                style={styles.input}
                returnKeyType="done"
                autoCapitalize="words"
                autoCorrect
                editable={!loading}
              />

              {destination.length > 0 && !loading ? (
                <Pressable
                  onPress={() => {
                    setDestination('');
                    setErrorMessage('');
                  }}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearText}>×</Text>
                </Pressable>
              ) : null}
            </View>

            {/* Error */}
            {errorMessage ? (
              <View style={styles.errorCard}>
                <View style={styles.errorIcon}>
                  <Text style={styles.errorIconText}>!</Text>
                </View>

                <Text style={styles.errorText}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Information */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>ℹ</Text>

              <Text style={styles.infoText}>
                RideLink will find the destination coordinates and
                open Uber with both locations ready. You will review
                everything in Uber before confirming the ride.
              </Text>
            </View>
          </View>

          {/* Bottom button */}
          <View style={styles.bottomSection}>
            <Pressable
              disabled={!canContinue}
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                !canContinue && styles.continueButtonDisabled,
                pressed &&
                  canContinue &&
                  styles.pressed,
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#07110D"
                  />

                  <Text style={styles.loadingText}>
                    Finding destination...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.continueText,
                      !canContinue &&
                        styles.continueTextDisabled,
                    ]}
                  >
                    Continue with Uber
                  </Text>

                  <Text
                    style={[
                      styles.continueArrow,
                      !canContinue &&
                        styles.continueTextDisabled,
                    ]}
                  >
                    →
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D10',
  },

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },

  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#15191E',
    borderWidth: 1,
    borderColor: '#282E36',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    marginTop: -3,
    fontSize: 32,
    lineHeight: 36,
    color: '#FFFFFF',
    fontWeight: '300',
  },

  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  topBarSpacer: {
    width: 42,
  },

  content: {
    flex: 1,
    paddingTop: 32,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#68727D',
  },

  pickupCard: {
    marginTop: 10,
    minHeight: 82,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#12161B',
    borderWidth: 1,
    borderColor: '#242A32',
    flexDirection: 'row',
    alignItems: 'center',
  },

  pickupIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1B2C27',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pickupIconText: {
    fontSize: 19,
  },

  pickupDetails: {
    flex: 1,
    marginLeft: 12,
  },

  pickupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AEB6BF',
  },

  pickupAddress: {
    marginTop: 3,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  coordinates: {
    marginTop: 3,
    fontSize: 11,
    color: '#66707B',
  },

  checkCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#19352C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  checkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6EE7B7',
  },

  destinationLabel: {
    marginTop: 28,
  },

  inputContainer: {
    marginTop: 10,
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: '#12161B',
    borderWidth: 1,
    borderColor: '#242A32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  inputContainerActive: {
    borderColor: '#315A4C',
  },

  searchIcon: {
    fontSize: 25,
    color: '#6B7580',
    marginRight: 10,
    transform: [{ rotate: '-20deg' }],
  },

  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#FFFFFF',
  },

  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#252B32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearText: {
    marginTop: -2,
    fontSize: 22,
    lineHeight: 25,
    color: '#AEB6BF',
  },

  errorCard: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    backgroundColor: '#251719',
    borderWidth: 1,
    borderColor: '#593034',
    flexDirection: 'row',
    alignItems: 'center',
  },

  errorIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#6B3036',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  errorIconText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#E5A9AE',
  },

  infoCard: {
    marginTop: 18,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#11151A',
    borderWidth: 1,
    borderColor: '#20262D',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#202832',
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 13,
    fontWeight: '800',
    color: '#8D98A4',
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#737D88',
  },

  bottomSection: {
    paddingTop: 16,
  },

  continueButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#6EE7B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  continueButtonDisabled: {
    backgroundColor: '#20252B',
  },

  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#07110D',
  },

  continueTextDisabled: {
    color: '#555E68',
  },

  continueArrow: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#07110D',
  },

  loadingText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#07110D',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
});