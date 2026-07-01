// src/utils/formatters.ts
export function formatFollowers(count: number): string {
  if (!count && count !== 0) return "0";
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export function formatNumber(num: number): string {
  if (!num && num !== 0) return "0";
  return num.toLocaleString();
}