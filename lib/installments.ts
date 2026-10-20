/** Helpers de datas civis, independentes do fuso do navegador. */
export function addMonths(date: string, months: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return target.toISOString().slice(0, 10);
}

function onMonth(date: string, day: number): string {
  const [year, month] = date.split('-').map(Number);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(Math.min(day, last)).padStart(2, '0')}`;
}

/** Primeira fatura cujo fechamento ainda não ocorreu na data da compra. */
export function firstCardDueDate(purchaseDate: string, closingDay: number, dueDay: number): string {
  if (!Number.isInteger(closingDay) || closingDay < 1 || closingDay > 31 ||
      !Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
    throw new Error('Dias de fechamento e vencimento devem estar entre 1 e 31.');
  }
  const closingMonth = purchaseDate <= onMonth(purchaseDate, closingDay)
    ? purchaseDate : addMonths(purchaseDate.slice(0, 7) + '-01', 1);
  const closing = onMonth(closingMonth, closingDay);
  let due = onMonth(closingMonth, dueDay);
  if (due <= closing) due = onMonth(addMonths(closingMonth.slice(0, 7) + '-01', 1), dueDay);
  return due;
}

/** Centavos exatos, com eventual resto na última parcela. */
export function splitInstallments(total: number, count: number): number[] {
  if (!Number.isFinite(total) || total <= 0 || !Number.isInteger(count) || count < 1 || count > 120) {
    throw new Error('Informe um valor positivo e de 1 a 120 parcelas.');
  }
  const cents = Math.round(total * 100);
  if (cents < count) throw new Error('O valor total precisa ser de pelo menos R$ 0,01 por parcela.');
  const base = Math.floor(cents / count);
  return Array.from({length: count}, (_, i) => (base + (i === count - 1 ? cents - base * count : 0)) / 100);
}
