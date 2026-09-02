import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function EmptyList({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔧</Text>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
});
