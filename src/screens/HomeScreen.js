import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../constants/colors";
import MaintenanceCard from "../components/MaintenanceCard";
import EmptyList from "../components/EmptyList";
import TabSelector from "../components/TabSelector";
import {
  getAllRecords,
  deleteRecord,
  markAsDone,
  markAsPending,
} from "../services/maintenanceStorage";

export default function HomeScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const data = await getAllRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  // Recarrega sempre que a tela volta a ficar em foco (ex: após criar/editar)
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  const pendingRecords = useMemo(
    () => records.filter((item) => item.status === "pending"),
    [records]
  );
  const doneRecords = useMemo(
    () => records.filter((item) => item.status === "done"),
    [records]
  );

  const listData = activeTab === "pending" ? pendingRecords : doneRecords;

  function handleOpenForm(item) {
    navigation.navigate("Form", { item: item ?? null });
  }

  function handleToggleStatus(item) {
    const goingToDone = item.status === "pending";
    Alert.alert(
      goingToDone ? "Concluir manutenção" : "Reabrir manutenção",
      goingToDone
        ? `Marcar "${item.service}" como realizada?`
        : `Voltar "${item.service}" para pendente?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            if (goingToDone) {
              await markAsDone(item.id);
            } else {
              await markAsPending(item.id);
            }
            loadRecords();
          },
        },
      ]
    );
  }

  function handleDelete(item) {
    Alert.alert(
      "Excluir registro",
      `Tem certeza que deseja excluir "${item.service}"? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteRecord(item.id);
            loadRecords();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <RNStatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PitStop Auto</Text>
          <Text style={styles.subtitle}>
            Seu caderninho digital de manutenções
          </Text>
        </View>
      </View>

      <TabSelector
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "pending", label: "Próximas", count: pendingRecords.length },
          { key: "done", label: "Histórico", count: doneRecords.length },
        ]}
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MaintenanceCard
            item={item}
            onPress={handleOpenForm}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadRecords}
        ListEmptyComponent={
          !loading ? (
            <EmptyList
              title={
                activeTab === "pending"
                  ? "Nenhuma manutenção pendente"
                  : "Nenhuma manutenção concluída ainda"
              }
              subtitle={
                activeTab === "pending"
                  ? "Toque no botão + para registrar a próxima troca de óleo, pneu ou revisão."
                  : "Quando você concluir uma manutenção, ela aparece aqui."
              }
            />
          ) : null
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => handleOpenForm(null)}
        accessibilityLabel="Cadastrar nova manutenção"
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabIcon: {
    color: "#0D1117",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
});
