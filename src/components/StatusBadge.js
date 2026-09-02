import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function StatusBadge({ status }) {
  const isDone = status === "done";
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isDone ? colors.successBg : colors.warningBg },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: isDone ? colors.success : colors.warning },
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: isDone ? colors.success : colors.warning },
        ]}
      >
        {isDone ? "Realizada" : "Pendente"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
