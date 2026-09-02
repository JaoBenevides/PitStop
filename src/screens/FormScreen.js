import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../constants/colors";
import { SERVICE_TYPES } from "../constants/serviceTypes";
import PrimaryButton from "../components/PrimaryButton";
import { createRecord, updateRecord } from "../services/maintenanceStorage";
import { parseNumberInput } from "../utils/format";

export default function FormScreen({ route, navigation }) {
  const editingItem = route.params?.item ?? null;
  const isEditing = !!editingItem;

  const [service, setService] = useState(editingItem?.service ?? "");
  const [customService, setCustomService] = useState(
    editingItem && !SERVICE_TYPES.includes(editingItem.service)
      ? editingItem.service
      : ""
  );
  const [vehicle, setVehicle] = useState(editingItem?.vehicle ?? "");
  const [currentKm, setCurrentKm] = useState(
    editingItem ? String(editingItem.currentKm) : ""
  );
  const [cost, setCost] = useState(
    editingItem ? String(editingItem.cost) : ""
  );
  const [limitKm, setLimitKm] = useState(
    editingItem?.limitKm ? String(editingItem.limitKm) : ""
  );
  const [notes, setNotes] = useState(editingItem?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const resolvedService =
    service === "Outro" ? customService.trim() : service;

  function validate() {
    if (!resolvedService) {
      Alert.alert("Campo obrigatório", "Selecione ou digite o tipo de serviço.");
      return false;
    }
    if (!currentKm || Number.isNaN(Number(currentKm))) {
      Alert.alert("Campo obrigatório", "Informe a quilometragem atual (KM).");
      return false;
    }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;

    setSaving(true);
    const payload = {
      service: resolvedService,
      vehicle,
      currentKm: parseNumberInput(currentKm),
      cost: parseNumberInput(cost),
      limitKm: limitKm ? parseNumberInput(limitKm) : null,
      notes,
    };

    try {
      if (isEditing) {
        await updateRecord(editingItem.id, payload);
      } else {
        await createRecord(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Cancelar</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar Manutenção" : "Nova Manutenção"}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Tipo de serviço *</Text>
          <View style={styles.chipsWrap}>
            {SERVICE_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setService(type)}
                style={[styles.chip, service === type && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    service === type && styles.chipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>

          {service === "Outro" && (
            <TextInput
              style={styles.input}
              placeholder="Descreva o serviço"
              placeholderTextColor={colors.textMuted}
              value={customService}
              onChangeText={setCustomService}
            />
          )}

          <Text style={styles.label}>Veículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Honda CG 160 - ABC1D23"
            placeholderTextColor={colors.textMuted}
            value={vehicle}
            onChangeText={setVehicle}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>KM atual *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 32500"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={currentKm}
                onChangeText={setCurrentKm}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor gasto (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 180,00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={cost}
                onChangeText={setCost}
              />
            </View>
          </View>

          <Text style={styles.label}>KM limite p/ próxima manutenção</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 37500 (opcional)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={limitKm}
            onChangeText={setLimitKm}
          />

          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Anotações extras sobre o serviço"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <View style={{ height: 12 }} />
          <PrimaryButton
            label={isEditing ? "Salvar alterações" : "Cadastrar manutenção"}
            onPress={handleSave}
            loading={saving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 14,
    width: 60,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#0D1117",
  },
});
