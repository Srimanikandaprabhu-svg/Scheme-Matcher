import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Dataset Integrity and Protection Tests', () => {
  it('ensures raw datasets exist and are intact', () => {
    const rawFiles = [
      'data/raw/schemes.csv',
      'data/raw/nsfdc_partners.csv',
      'data/raw/partner_geo.csv',
      'data/raw/lgd_districts.csv',
      'data/raw/geo/all_india_pincode_directory.csv',
      'data/simulated/partner_status.csv',
    ];

    rawFiles.forEach((f) => {
      expect(fs.existsSync(path.resolve(f))).toBe(true);
      const stat = fs.statSync(path.resolve(f));
      expect(stat.size).toBeGreaterThan(0);
    });
  });

  it('ensures processed datasets exist in data/processed/', () => {
    const processedFiles = [
      'data/processed/pincodes_clean.csv',
      'data/processed/partner_branches.csv',
      'data/processed/pincode_centroids.csv',
      'data/processed/validation_report.json',
    ];

    processedFiles.forEach((f) => {
      expect(fs.existsSync(path.resolve(f))).toBe(true);
    });
  });

  it('validates validation report structure', () => {
    const reportPath = path.resolve('data/processed/validation_report.json');
    const content = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    expect(content.datasets).toBeDefined();
    expect(content.datasets.pincodes.unique_pincodes_count).toBeGreaterThan(15000);
    expect(content.datasets.rbi_branches.branches_filtered_and_saved).toBeGreaterThan(1000);
  });
});
