import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function TabSelector({ tabs, activeKey, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 13,
  },
  activeTabText: {
    color: "#0D1117",
  },
});
