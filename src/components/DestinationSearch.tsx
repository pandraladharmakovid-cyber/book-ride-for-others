import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '../utils/constants';

type DestinationSearchProps = {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
};

export function DestinationSearch({
  value,
  onChangeText,
  disabled = false,
}: DestinationSearchProps) {
  return (
    <View
      style={[
        styles.container,
        value.length > 0 && styles.active,
      ]}
    >
      <Text style={styles.searchIcon}>
        ⌕
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Where are they going?"
        placeholderTextColor="#69727D"
        style={styles.input}
        returnKeyType="done"
        autoCapitalize="words"
        autoCorrect
        editable={!disabled}
      />

      {value.length > 0 && !disabled ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear destination"
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>
            ×
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  active: {
    borderColor: COLORS.accentBorder,
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
    color: COLORS.text,
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
});