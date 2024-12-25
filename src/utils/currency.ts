import { settingsStore } from '../stores/settingsStore';

export const formatCurrency = (amount: number): string => {
  const settings = settingsStore.getCurrentSettings();
  return `₹${amount.toFixed(2)}`;
};

export const calculateCost = (kwh: number): number => {
  const { ratePerKwh } = settingsStore.getCurrentSettings();
  return kwh * ratePerKwh;
};