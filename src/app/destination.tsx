import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { DestinationSearch } from '../components/DestinationSearch';
import { PickupCard } from '../components/PickupCard';

import { geocodeAddress } from '../services/geocoding';
import {
  openUberRideRequest,
} from '../services/uber';

import type { LocationData } from '../types/location';

import { COLORS } from '../utils/constants';

export default function DestinationScreen() {
  const params =
    useLocalSearchParams<{
      latitude?: string;
      longitude?: string;
      address?: string;
    }>();

  const [destination, setDestination] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const pickup =
    useMemo<LocationData | null>(() => {
      const latitude = Number(
        params.latitude,
      );

      const longitude = Number(
        params.longitude,
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return null;
      }

      return {
        latitude,
        longitude,
        address:
          params.address ||
          'Pickup location received',
        source: 'shared',
      };
    }, [
      params.latitude,
      params.longitude,
      params.address,
    ]);

  const canContinue = Boolean(
    pickup &&
      destination.trim() &&
      !loading,
  );

  const handleContinue =
    async () => {
      if (
        !pickup ||
        !destination.trim() ||
        loading
      ) {
        return;
      }

      setLoading(true);
      setErrorMessage('');

      try {
        /*
         * Resolve the destination into
         * latitude, longitude and address.
         */
        const dropoff =
          await geocodeAddress(
            destination.trim(),
          );

        /*
         * Open Uber with both locations.
         *
         * This function first attempts
         * the Uber app and then falls back
         * to the Uber web experience.
         */
        const result =
          await openUberRideRequest({
            pickup: {
              latitude:
                pickup.latitude,
              longitude:
                pickup.longitude,
              address:
                pickup.address,
              nickname: 'Pickup',
            },

            dropoff: {
              latitude:
                dropoff.latitude,
              longitude:
                dropoff.longitude,
              address:
                dropoff.address,
              nickname:
                'Destination',
            },
          });

        if (result === 'none') {
          throw new Error(
            'Unable to open Uber. Please check your internet connection and make sure Uber is available on this device.',
          );
        }

        /*
         * At this point:
         *
         * 'app'  = Uber app accepted the request
         * 'web'  = browser fallback opened
         *
         * RideLink does not book the ride itself.
         * The user reviews and confirms it in Uber.
         */
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.topBar}
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              disabled={loading}
              style={({ pressed }) => [
                styles.backButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Text
                style={
                  styles.backArrow
                }
              >
                ‹
              </Text>
            </Pressable>

            <Text
              style={
                styles.screenTitle
              }
            >
              Destination
            </Text>

            <View
              style={
                styles.topBarSpacer
              }
            />
          </View>

          <ScrollView
            contentContainerStyle={
              styles.scrollContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >
            {pickup ? (
              <>
                <Text
                  style={
                    styles.eyebrow
                  }
                >
                  PICKUP
                </Text>

                <PickupCard
                  location={pickup}
                />
              </>
            ) : (
              <View
                style={
                  styles.errorCard
                }
              >
                <View
                  style={
                    styles.errorIcon
                  }
                >
                  <Text
                    style={
                      styles.errorIconText
                    }
                  >
                    !
                  </Text>
                </View>

                <Text
                  style={
                    styles.errorText
                  }
                >
                  The pickup location is
                  invalid. Go back and
                  enter it again.
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.eyebrow,
                styles.destinationLabel,
              ]}
            >
              DESTINATION
            </Text>

            <DestinationSearch
              value={destination}
              onChangeText={(value) => {
                setDestination(value);
                setErrorMessage('');
              }}
              disabled={loading}
            />

            {errorMessage ? (
              <View
                style={
                  styles.errorCard
                }
              >
                <View
                  style={
                    styles.errorIcon
                  }
                >
                  <Text
                    style={
                      styles.errorIconText
                    }
                  >
                    !
                  </Text>
                </View>

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View
              style={styles.infoCard}
            >
              <Text
                style={
                  styles.infoIcon
                }
              >
                ℹ
              </Text>

              <Text
                style={
                  styles.infoText
                }
              >
                RideLink resolves the
                destination, then opens
                Uber with both locations
                ready. You review
                everything in Uber before
                confirming the ride.
              </Text>
            </View>
          </ScrollView>

          <View
            style={
              styles.bottomSection
            }
          >
            <Pressable
              disabled={!canContinue}
              onPress={
                handleContinue
              }
              style={({ pressed }) => [
                styles.continueButton,
                !canContinue &&
                  styles.continueButtonDisabled,
                pressed &&
                  canContinue &&
                  styles.pressed,
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={
                      COLORS.accentDark
                    }
                  />

                  <Text
                    style={
                      styles.loadingText
                    }
                  >
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
    backgroundColor:
      COLORS.background,
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
    justifyContent:
      'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    marginTop: -4,
    fontSize: 32,
    lineHeight: 36,
    color: COLORS.text,
  },

  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  topBarSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingTop: 24,
    paddingBottom: 20,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#68727D',
  },

  destinationLabel: {
    marginTop: 28,
    marginBottom: 10,
  },

  infoCard: {
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    backgroundColor:
      COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    fontSize: 17,
    lineHeight: 20,
    color: COLORS.accent,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#89939F',
  },

  errorCard: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    backgroundColor:
      COLORS.errorSurface,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
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
    color: COLORS.text,
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.errorText,
  },

  bottomSection: {
    paddingTop: 12,
  },

  continueButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor:
      COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  continueButtonDisabled: {
    backgroundColor: '#20252B',
  },

  continueText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accentDark,
  },

  continueTextDisabled: {
    color: '#555E68',
  },

  continueArrow: {
    marginLeft: 10,
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.accentDark,
  },

  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentDark,
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});