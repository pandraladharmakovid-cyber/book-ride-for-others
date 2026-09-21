import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { LocationData } from '../types/location';
import { COLORS } from '../utils/constants';

type PickupCardProps = {
  location: LocationData;
  title?: string;
};

export function PickupCard({
  location,
  title = "Friend's location",
}: PickupCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>📍</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text
          style={styles.address}
          numberOfLines={2}
        >
          {location.address}
        </Text>

        <Text style={styles.coordinates}>
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      </View>

      <View style={styles.checkCircle}>
        <Text style={styles.checkText}>
          ✓
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    minHeight: 82,
    padding: 15,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1B2C27',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 19,
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AEB6BF',
  },

  address: {
    marginTop: 3,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.text,
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
    color: COLORS.accent,
  },
});