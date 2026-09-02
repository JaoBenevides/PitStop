/**
 * Gera um ID único simples, sem depender de bibliotecas externas (uuid).
 * Combina timestamp em base36 com um sufixo aleatório.
 */
export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
