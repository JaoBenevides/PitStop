export function formatCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatKm(value) {
  const number = Number(value) || 0;
  return `${number.toLocaleString("pt-BR")} km`;
}

export function formatDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
}

/** Converte texto de input (com vírgula ou ponto) para number seguro. */
export function parseNumberInput(text) {
  if (!text) return 0;
  const normalized = String(text).replace(/\./g, "").replace(",", ".");
  const value = parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
}
