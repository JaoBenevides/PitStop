import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import colors from "../constants/colors";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, formatKm } from "../utils/format";

export default function MaintenanceCard({
  item,
  onPress,
  onToggleStatus,
  onDelete,
}) {
  const isPending = item.status === "pending";
  const kmRemaining =
    isPending && item.limitKm ? item.limitKm - item.currentKm : null;

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.service} numberOfLines={1}>
          {item.service}
        </Text>
        <StatusBadge status={item.status} />
      </View>

      {!!item.vehicle && <Text style={styles.vehicle}>{item.vehicle}</Text>}

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{formatKm(item.currentKm)}</Text>
        <Text style={styles.infoDivider}>•</Text>
        <Text style={styles.infoText}>{formatCurrency(item.cost)}</Text>
        <Text style={styles.infoDivider}>•</Text>
        <Text style={styles.infoText}>
          {formatDate(item.status === "done" ? item.completedAt : item.createdAt)}
        </Text>
      </View>

      {item.limitKm ? (
        <Text style={styles.limitText}>
          Próxima troca em: {formatKm(item.limitKm)}
          {kmRemaining !== null ? `  (faltam ${formatKm(kmRemaining)})` : ""}
        </Text>
      ) : null}

      {!!item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}

      <View style={styles.actionsRow}>
        {isPending && (
          <Pressable
            onPress={() => onToggleStatus(item)}
            style={[styles.actionButton, styles.doneButton]}
          >
            <Text style={styles.doneButtonText}>Concluir</Text>
          </Pressable>
        )}
        {!isPending && (
          <Pressable
            onPress={() => onToggleStatus(item)}
            style={[styles.actionButton, styles.undoButton]}
          >
            <Text style={styles.undoButtonText}>Reabrir</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => onDelete(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  service: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  vehicle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  infoText: {
    color: colors.text,
    fontSize: 13,
  },
  infoDivider: {
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  limitText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  notes: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontStyle: "italic",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  doneButton: {
    backgroundColor: colors.successBg,
  },
  doneButtonText: {
    color: colors.success,
    fontWeight: "600",
    fontSize: 12,
  },
  undoButton: {
    backgroundColor: colors.surfaceAlt,
  },
  undoButtonText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.dangerBg,
    marginLeft: "auto",
  },
  deleteButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 12,
  },
});
