import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
};

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);

  const handleContinue = () => {
    if (!location) {
      return;
    }

    router.push({
      pathname: '/destination',
      params: {
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        address: location.address,
      },
    });
  };

  const handleUseTestLocation = () => {
    /*
     * Temporary development location.
     *
     * This is only here so we can test the complete UI flow
     * before implementing Android/WhatsApp location sharing.
     *
     * We will remove this test location once the real
     * location-sharing flow is connected.
     */
    setLocation({
      latitude: 17.385044,
      longitude: 78.486671,
      address: 'Hyderabad, Telangana',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>

          <Text style={styles.screenTitle}>Pickup Location</Text>

          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.locationIconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>

          <Text style={styles.title}>
            Where should the driver{'\n'}pick them up?
          </Text>

          <Text style={styles.description}>
            Share a location from WhatsApp with RideLink and we'll use it as
            the pickup point.
          </Text>

          {location ? (
            <View style={styles.locationCard}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>✓</Text>
              </View>

              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup location</Text>

                <Text style={styles.address} numberOfLines={2}>
                  {location.address}
                </Text>

                <Text style={styles.coordinates}>
                  {location.latitude.toFixed(6)},{' '}
                  {location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📍</Text>

              <Text style={styles.emptyTitle}>No location received</Text>

              <Text style={styles.emptyDescription}>
                Send or share the person's location to RideLink.
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleUseTestLocation}
            style={({ pressed }) => [
              styles.testButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.testButtonText}>
              Use Test Location
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomSection}>
          <Pressable
            disabled={!location}
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              !location && styles.continueButtonDisabled,
              pressed && location && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.continueButtonText,
                !location && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>

            <Text
              style={[
                styles.continueArrow,
                !location && styles.continueButtonTextDisabled,
              ]}
            >
              →
            </Text>
          </Pressable>
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
    marginTop: -4,
    fontSize: 32,
    lineHeight: 36,
    color: '#FFFFFF',
  },

  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  topBarSpacer: {
    width: 42,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  locationIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#17251F',
    borderWidth: 1,
    borderColor: '#315A4C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  locationIcon: {
    fontSize: 28,
  },

  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },

  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 23,
    color: '#929AA5',
    maxWidth: 440,
  },

  emptyCard: {
    marginTop: 28,
    padding: 22,
    borderRadius: 18,
    backgroundColor: '#12161B',
    borderWidth: 1,
    borderColor: '#282E36',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#7F8995',
    textAlign: 'center',
  },

  locationCard: {
    marginTop: 28,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#121B17',
    borderWidth: 1,
    borderColor: '#315A4C',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B3A30',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6EE7B7',
  },

  locationDetails: {
    flex: 1,
    marginLeft: 14,
  },

  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6EE7B7',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  address: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  coordinates: {
    marginTop: 5,
    fontSize: 11,
    color: '#7F8995',
    fontVariant: ['tabular-nums'],
  },

  testButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#15191E',
    borderWidth: 1,
    borderColor: '#282E36',
  },

  testButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#AAB2BD',
  },

  bottomSection: {
    paddingTop: 16,
  },

  continueButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#6EE7B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonDisabled: {
    backgroundColor: '#20252B',
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#07110D',
  },

  continueButtonTextDisabled: {
    color: '#626B75',
  },

  continueArrow: {
    marginLeft: 10,
    fontSize: 21,
    fontWeight: '700',
    color: '#07110D',
  },

  pressed: {
    opacity: 0.75,
  },
});