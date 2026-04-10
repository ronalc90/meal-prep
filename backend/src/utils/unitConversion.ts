/**
 * Unit conversion and normalization utilities for shopping list aggregation.
 * Converts quantities to a common base unit to enable proper ingredient combining.
 */

interface ConversionRule {
  readonly baseUnit: string;
  readonly factor: number;
}

const VOLUME_CONVERSIONS: Record<string, ConversionRule> = {
  ml: { baseUnit: 'ml', factor: 1 },
  milliliter: { baseUnit: 'ml', factor: 1 },
  milliliters: { baseUnit: 'ml', factor: 1 },
  l: { baseUnit: 'ml', factor: 1000 },
  liter: { baseUnit: 'ml', factor: 1000 },
  liters: { baseUnit: 'ml', factor: 1000 },
  tsp: { baseUnit: 'ml', factor: 4.929 },
  teaspoon: { baseUnit: 'ml', factor: 4.929 },
  teaspoons: { baseUnit: 'ml', factor: 4.929 },
  tbsp: { baseUnit: 'ml', factor: 14.787 },
  tablespoon: { baseUnit: 'ml', factor: 14.787 },
  tablespoons: { baseUnit: 'ml', factor: 14.787 },
  cup: { baseUnit: 'ml', factor: 236.588 },
  cups: { baseUnit: 'ml', factor: 236.588 },
  'fl oz': { baseUnit: 'ml', factor: 29.574 },
  'fluid ounce': { baseUnit: 'ml', factor: 29.574 },
  'fluid ounces': { baseUnit: 'ml', factor: 29.574 },
};

const WEIGHT_CONVERSIONS: Record<string, ConversionRule> = {
  g: { baseUnit: 'g', factor: 1 },
  gram: { baseUnit: 'g', factor: 1 },
  grams: { baseUnit: 'g', factor: 1 },
  kg: { baseUnit: 'g', factor: 1000 },
  kilogram: { baseUnit: 'g', factor: 1000 },
  kilograms: { baseUnit: 'g', factor: 1000 },
  oz: { baseUnit: 'g', factor: 28.3495 },
  ounce: { baseUnit: 'g', factor: 28.3495 },
  ounces: { baseUnit: 'g', factor: 28.3495 },
  lb: { baseUnit: 'g', factor: 453.592 },
  lbs: { baseUnit: 'g', factor: 453.592 },
  pound: { baseUnit: 'g', factor: 453.592 },
  pounds: { baseUnit: 'g', factor: 453.592 },
};

const ALL_CONVERSIONS: Record<string, ConversionRule> = {
  ...VOLUME_CONVERSIONS,
  ...WEIGHT_CONVERSIONS,
};

export interface NormalizedQuantity {
  readonly quantity: number;
  readonly unit: string;
}

/**
 * Converts a quantity from one unit to a base unit (ml for volume, g for weight).
 */
export function normalizeUnit(quantity: number, unit: string): NormalizedQuantity {
  const normalizedUnit = unit.toLowerCase().trim();
  const conversion = ALL_CONVERSIONS[normalizedUnit];

  if (!conversion) {
    return { quantity, unit: normalizedUnit };
  }

  return {
    quantity: quantity * conversion.factor,
    unit: conversion.baseUnit,
  };
}

/**
 * Checks if two units are in the same measurement system (both volume or both weight).
 */
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const u1 = unit1.toLowerCase().trim();
  const u2 = unit2.toLowerCase().trim();

  if (u1 === u2) return true;

  const u1IsVolume = u1 in VOLUME_CONVERSIONS;
  const u2IsVolume = u2 in VOLUME_CONVERSIONS;
  if (u1IsVolume && u2IsVolume) return true;

  const u1IsWeight = u1 in WEIGHT_CONVERSIONS;
  const u2IsWeight = u2 in WEIGHT_CONVERSIONS;
  if (u1IsWeight && u2IsWeight) return true;

  return false;
}

/**
 * Formats a quantity into a human-readable display unit.
 * Converts from base units (ml, g) to more practical units.
 */
export function formatForDisplay(quantity: number, baseUnit: string): NormalizedQuantity {
  if (baseUnit === 'ml') {
    if (quantity >= 1000) {
      return { quantity: Math.round((quantity / 1000) * 100) / 100, unit: 'L' };
    }
    if (quantity >= 236) {
      return { quantity: Math.round((quantity / 236.588) * 10) / 10, unit: 'cups' };
    }
    if (quantity >= 14.5) {
      return { quantity: Math.round((quantity / 14.787) * 10) / 10, unit: 'tbsp' };
    }
    return { quantity: Math.round((quantity / 4.929) * 10) / 10, unit: 'tsp' };
  }

  if (baseUnit === 'g') {
    if (quantity >= 1000) {
      return { quantity: Math.round((quantity / 1000) * 100) / 100, unit: 'kg' };
    }
    return { quantity: Math.round(quantity * 10) / 10, unit: 'g' };
  }

  return { quantity: Math.round(quantity * 100) / 100, unit: baseUnit };
}
