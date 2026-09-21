import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../utils/constants';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  arrow?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  loadingLabel = 'Loading...',
  arrow = true,
  style,
}: PrimaryButtonProps) {
  const active = !disabled && !loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: !active,
        busy: loading,
      }}
      disabled={!active}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        !active && styles.disabled,
        pressed && active && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <>
          <ActivityIndicator
            size="small"
            color={COLORS.accentDark}
          />

          <Text style={styles.text}>
            {loadingLabel}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.text,
              !active && styles.disabledText,
            ]}
          >
            {label}
          </Text>

          {arrow ? (
            <Text
              style={[
                styles.arrow,
                !active && styles.disabledText,
              ]}
            >
              →
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  disabled: {
    backgroundColor: '#20252B',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  text: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accentDark,
  },

  disabledText: {
    color: '#555E68',
  },

  arrow: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
});