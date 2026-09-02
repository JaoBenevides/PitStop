import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "../utils/id";

/**
 * Camada de persistência do PitStop Auto.
 *
 * Escolha técnica: AsyncStorage (justificativa completa no README.md).
 * Resumo: os dados são uma única entidade "chata" (lista de registros de
 * manutenção), sem relacionamentos entre tabelas, sem necessidade de JOINs
 * e com volume baixo (dezenas/poucas centenas de registros por usuário ao
 * longo da vida útil de um veículo). Isso torna o modelo "ler tudo, filtrar
 * em memória, salvar tudo de novo" do AsyncStorage suficiente e mais simples
 * do que manter schema/migrations do SQLite.
 */

const STORAGE_KEY = "@pitstop_auto:maintenance_records";

/**
 * @typedef {Object} MaintenanceRecord
 * @property {string} id
 * @property {string} service - Tipo de serviço (ex: "Troca de Óleo")
 * @property {string} vehicle - Identificação do veículo (ex: "Honda CG 160 - ABC1D23")
 * @property {number} currentKm - KM registrado no momento do cadastro
 * @property {number} cost - Valor gasto (R$)
 * @property {number|null} limitKm - KM limite para a próxima manutenção (opcional)
 * @property {"pending"|"done"} status
 * @property {string} createdAt - ISO date do cadastro
 * @property {string|null} completedAt - ISO date de quando foi concluída
 * @property {string} notes - Observações livres
 */

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao ler registros do AsyncStorage:", error);
    return [];
  }
}

async function writeAll(records) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error("Erro ao salvar registros no AsyncStorage:", error);
    return false;
  }
}

/** LISTAR - retorna todos os registros, mais recentes primeiro. */
export async function getAllRecords() {
  const records = await readAll();
  return records.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/** CRIAR - adiciona um novo registro de manutenção. */
export async function createRecord(data) {
  const records = await readAll();
  const newRecord = {
    id: generateId(),
    service: data.service?.trim() || "Serviço",
    vehicle: data.vehicle?.trim() || "",
    currentKm: Number(data.currentKm) || 0,
    cost: Number(data.cost) || 0,
    limitKm: data.limitKm ? Number(data.limitKm) : null,
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null,
    notes: data.notes?.trim() || "",
  };
  records.push(newRecord);
  await writeAll(records);
  return newRecord;
}

/** ATUALIZAR - edita campos de um registro existente (id obrigatório). */
export async function updateRecord(id, changes) {
  const records = await readAll();
  const index = records.findIndex((item) => item.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...changes,
  };
  await writeAll(records);
  return records[index];
}

/** CONCLUIR - marca um registro como "done" e guarda a data de conclusão. */
export async function markAsDone(id) {
  return updateRecord(id, {
    status: "done",
    completedAt: new Date().toISOString(),
  });
}

/** REABRIR - volta um registro concluído para "pending" (desfazer). */
export async function markAsPending(id) {
  return updateRecord(id, {
    status: "pending",
    completedAt: null,
  });
}

/** EXCLUIR - remove um registro definitivamente. */
export async function deleteRecord(id) {
  const records = await readAll();
  const filtered = records.filter((item) => item.id !== id);
  await writeAll(filtered);
  return true;
}
