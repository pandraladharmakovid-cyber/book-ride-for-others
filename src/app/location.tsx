import React, { useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { resolveLocationInput } from '../services/locationParser';
import type { LocationData } from '../types/location';

import { COLORS } from '../utils/constants';

import { PrimaryButton } from '../components/PrimaryButton';
import { PickupCard } from '../components/PickupCard';

export default function LocationScreen() {
  const [input, setInput] = useState('');

  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const handleResolveLocation = async () => {
    const value = input.trim();

    if (!value || loading) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setLocation(null);

    try {
      const resolved =
        await resolveLocationInput(
          value,
          'manual',
        );

      setLocation(resolved);
    } catch (error) {
      setLocation(null);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not find that pickup location. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!location || loading) {
      return;
    }

    router.push({
      pathname: '/destination',
      params: {
        latitude: String(
          location.latitude,
        ),
        longitude: String(
          location.longitude,
        ),
        address: location.address,
      },
    });
  };

  const inputHasValue =
    input.trim().length > 0;

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
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
              onPress={() => router.back()}
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
              Pickup Location
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
            <View
              style={
                styles.locationIconContainer
              }
            >
              <Text
                style={
                  styles.locationIcon
                }
              >
                📍
              </Text>
            </View>

            <Text
              style={styles.title}
            >
              Where should the driver
              {'\n'}
              pick them up?
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Enter the pickup address,
              coordinates, Google Maps
              location, or Plus Code.
            </Text>

            <Text
              style={styles.label}
            >
              PICKUP LOCATION
            </Text>

            <View
              style={[
                styles.inputContainer,
                inputHasValue &&
                  styles.inputActive,
              ]}
            >
              <TextInput
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  setErrorMessage('');
                  setLocation(null);
                }}
                placeholder="Address, coordinates, Google Maps link, or Plus Code"
                placeholderTextColor="#69727D"
                style={styles.input}
                multiline
                numberOfLines={2}
                textAlignVertical="center"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={
                  handleResolveLocation
                }
              />
            </View>

            <Text
              style={styles.helperText}
            >
              Examples: Hyderabad,
              Telangana · 17.385044,
              78.486671 · 8P6P+V2H
            </Text>

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

            <Pressable
              disabled={
                !inputHasValue ||
                loading
              }
              onPress={
                handleResolveLocation
              }
              style={({ pressed }) => [
                styles.resolveButton,
                (!inputHasValue ||
                  loading) &&
                  styles.resolveButtonDisabled,
                pressed &&
                  inputHasValue &&
                  !loading &&
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
                      styles.resolveText
                    }
                  >
                    Finding pickup...
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.resolveText,
                    !inputHasValue &&
                      styles.resolveTextDisabled,
                  ]}
                >
                  Use This Pickup Location
                </Text>
              )}
            </Pressable>

            {location ? (
              <PickupCard
                location={location}
                title="Pickup location"
              />
            ) : (
              <View
                style={
                  styles.emptyCard
                }
              >
                <Text
                  style={
                    styles.emptyIcon
                  }
                >
                  📍
                </Text>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No pickup location yet
                </Text>

                <Text
                  style={
                    styles.emptyDescription
                  }
                >
                  Enter a location above
                  and RideLink will resolve
                  it before continuing.
                </Text>
              </View>
            )}
          </ScrollView>

          <View
            style={
              styles.bottomSection
            }
          >
            <PrimaryButton
              label="Continue"
              onPress={handleContinue}
              disabled={
                !location || loading
              }
            />
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

  locationIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor:
      COLORS.accentSurface,
    borderWidth: 1,
    borderColor:
      COLORS.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationIcon: {
    fontSize: 28,
  },

  title: {
    marginTop: 22,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.8,
  },

  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textMuted,
  },

  label: {
    marginTop: 28,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#68727D',
  },

  inputContainer: {
    marginTop: 10,
    minHeight: 62,
    borderRadius: 16,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.borderSoft,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  inputActive: {
    borderColor:
      COLORS.accentBorder,
  },

  input: {
    minHeight: 58,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.text,
    paddingVertical: 10,
  },

  helperText: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 17,
    color: '#66707B',
  },

  resolveButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor:
      COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  resolveButtonDisabled: {
    backgroundColor: '#20252B',
  },

  resolveText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.accentDark,
  },

  resolveTextDisabled: {
    color: '#555E68',
  },

  emptyCard: {
    marginTop: 18,
    padding: 22,
    borderRadius: 18,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#7F8995',
    textAlign: 'center',
  },

  errorCard: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    backgroundColor:
      COLORS.errorSurface,
    borderWidth: 1,
    borderColor:
      COLORS.errorBorder,
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

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});