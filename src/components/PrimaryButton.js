import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../constants/colors";

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
}) {
  const isOutline = variant === "outline";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outlineButton,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : "#0D1117"} />
      ) : (
        <Text style={[styles.label, isOutline && styles.outlineLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#0D1117",
    fontWeight: "700",
    fontSize: 15,
  },
  outlineLabel: {
    color: colors.text,
  },
});
