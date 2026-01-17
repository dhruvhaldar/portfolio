import { describe, it, expect } from 'vitest';
import { parseDimension, generateFlexClass, generateGridClass, getVariantClasses } from './layout';

describe('layout utils', () => {
  describe('parseDimension', () => {
    it('returns undefined for undefined value', () => {
      expect(parseDimension(undefined, 'width')).toBeUndefined();
    });

    it('returns rem string for number', () => {
      expect(parseDimension(10, 'width')).toBe('10rem');
    });

    it('returns static variable for static spacing', () => {
      expect(parseDimension('16', 'width')).toBe('var(--static-space-16)');
    });

    it('returns responsive variable for responsive sizes', () => {
      expect(parseDimension('m', 'width')).toBe('var(--responsive-width-m)');
      expect(parseDimension('m', 'height')).toBe('var(--responsive-height-m)');
    });

    it('returns undefined for unknown values', () => {
      expect(parseDimension('unknown' as any, 'width')).toBeUndefined();
    });
  });

  describe('generateFlexClass', () => {
    it('returns undefined for undefined value', () => {
      expect(generateFlexClass('background', undefined)).toBeUndefined();
    });

    it('handles transparent', () => {
      expect(generateFlexClass('border', 'transparent')).toBe('transparent-border');
    });

    it('handles surface values', () => {
      expect(generateFlexClass('background', 'surface')).toBe('surface-background');
      expect(generateFlexClass('background', 'page')).toBe('page-background');
      expect(generateFlexClass('background', 'overlay')).toBe('overlay-background');
    });

    it('handles scheme-weight format', () => {
      expect(generateFlexClass('background', 'neutral-medium')).toBe('neutral-background-medium');
    });

    it('handles scheme-alpha-weight format', () => {
      expect(generateFlexClass('background', 'neutral-alpha-medium')).toBe('neutral-background-alpha-medium');
    });
  });

  describe('generateGridClass', () => {
    it('returns undefined for undefined value', () => {
      expect(generateGridClass('background', undefined)).toBeUndefined();
    });

    it('handles special values', () => {
      expect(generateGridClass('background', 'surface')).toBe('surface-background');
      expect(generateGridClass('background', 'page')).toBe('page-background');
      expect(generateGridClass('background', 'transparent')).toBe('transparent-background');
    });

    it('handles scheme-weight format', () => {
      expect(generateGridClass('background', 'neutral-medium')).toBe('neutral-background-medium');
    });
  });

  describe('getVariantClasses', () => {
      it('returns correct classes', () => {
          expect(getVariantClasses('display-default-m')).toEqual(['font-display', 'font-default', 'font-m']);
      });

      it('uses cache', () => {
          const result1 = getVariantClasses('body-strong-s');
          const result2 = getVariantClasses('body-strong-s');
          expect(result1).toBe(result2); // Reference equality check
      });
  });
});
