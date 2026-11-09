import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parse } from 'csv-parse';

const RAW_DIR = path.resolve('data', 'raw');
const PROCESSED_DIR = path.resolve('data', 'processed');

if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

const validationReport = {
  timestamp: new Date().toISOString(),
  datasets: {},
};

/**
 * 1. Process All India PIN Code Directory
 */
async function processPincodes() {
  console.log('📌 Processing All India PIN Code Directory...');
  const filePath = path.join(RAW_DIR, 'geo', 'all_india_pincode_directory.csv');
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ Pincode directory not found at', filePath);
    return;
  }

  const parser = fs.createReadStream(filePath).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true })
  );

  let rawCount = 0;
  let missingCoords = 0;
  const pincodeMap = new Map();

  for await (const row of parser) {
    rawCount++;
    const pin = (row.pincode || '').trim();
    if (!pin || pin.length !== 6 || isNaN(Number(pin))) continue;

    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat > 5 && lat < 40 && lng > 65 && lng < 100;

    if (!hasValidCoords) {
      missingCoords++;
    }

    if (!pincodeMap.has(pin)) {
      pincodeMap.set(pin, {
        pincode: pin,
        district: (row.district || '').trim(),
        state: (row.statename || '').trim(),
        latitude: hasValidCoords ? lat : null,
        longitude: hasValidCoords ? lng : null,
        office_count: 1,
      });
    } else {
      const existing = pincodeMap.get(pin);
      existing.office_count++;
      // If existing had no coords but current row does, populate it
      if (existing.latitude === null && hasValidCoords) {
        existing.latitude = lat;
        existing.longitude = lng;
      }
    }
  }

  // Write clean pincodes CSV
  const outPath = path.join(PROCESSED_DIR, 'pincodes_clean.csv');
  const writeStream = fs.createWriteStream(outPath, { encoding: 'utf8' });
  writeStream.write('pincode,district,state,latitude,longitude,office_count\n');

  let processedCount = 0;
  let uniqueWithCoords = 0;
  const compactIndex = {};

  for (const item of pincodeMap.values()) {
    processedCount++;
    if (item.latitude !== null) uniqueWithCoords++;
    writeStream.write(
      `"${item.pincode}","${item.district.replace(/"/g, '""')}","${item.state.replace(/"/g, '""')}",${item.latitude || ''},${item.longitude || ''},${item.office_count}\n`
    );

    // Add to compact index for ultra-fast in-memory/backend search
    compactIndex[item.pincode] = {
      d: item.district,
      s: item.state,
      lat: item.latitude,
      lng: item.longitude,
    };
  }
  writeStream.end();

  // Save compact JSON index
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'pincodes_compact.json'),
    JSON.stringify(compactIndex)
  );

  validationReport.datasets.pincodes = {
    original_row_count: rawCount,
    unique_pincodes_count: processedCount,
    pincodes_with_coordinates: uniqueWithCoords,
    missing_or_invalid_coordinates_rows: missingCoords,
    output_file: 'data/processed/pincodes_clean.csv',
  };
  console.log(`✅ Processed ${rawCount} pincode records -> ${processedCount} unique pincodes.`);
}

/**
 * 2. Process RBI Banking Outlets (Filtered Partner Branches)
 */
async function processRbiBankOutlets() {
  console.log('🏦 Processing RBI Bank Outlets (Filtering relevant domestic branches)...');
  const filePath = path.join(RAW_DIR, 'rbi', 'rbi_bank_outlets.csv');
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ RBI bank outlets not found at', filePath);
    return;
  }

  // Stream readline to avoid memory issues with 516MB CSV
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const outPath = path.join(PROCESSED_DIR, 'partner_branches.csv');
  const outStream = fs.createWriteStream(outPath, { encoding: 'utf8' });
  outStream.write('id,bank,branch,address,bank_group,state_name,district_name,latitude,longitude,is_channel_partner_eligible\n');

  let lineIndex = 0;
  let matchedCount = 0;
  let invalidCoords = 0;

  // Relevant public / rural banking groups that can disburse NSFDC / government loans
  const relevantGroups = [
    'public sector banks',
    'regional rural banks',
    'small finance banks',
    'state co-operative banks',
  ];

  for await (const line of rl) {
    lineIndex++;
    if (lineIndex === 1) continue; // Skip header

    // Quick parse line
    // Regex or split taking quotes into account
    // For performance on 516MB, simple CSV match:
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 13) continue;

    // Clean quotes
    const clean = (val) => (val ? val.replace(/^"|"$/g, '').trim() : '');
    const id = clean(matches[0]);
    const branch = clean(matches[3]);
    const address = clean(matches[4]);
    const lngStr = clean(matches[5]);
    const latStr = clean(matches[6]);
    const bankGroup = clean(matches[7]).toLowerCase();
    const statusType = clean(matches[11]).toLowerCase();
    const bankName = clean(matches[12]);
    const stateName = clean(matches[21]);
    const districtName = clean(matches[23]);

    if (statusType !== 'opened') continue;

    const isGroupMatch = relevantGroups.some((g) => bankGroup.includes(g));
    if (!isGroupMatch) continue;

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const validCoords = !isNaN(lat) && !isNaN(lng) && lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98;

    if (!validCoords) {
      invalidCoords++;
      continue;
    }

    matchedCount++;
    // Write branch
    outStream.write(
      `"${id}","${bankName.replace(/"/g, '""')}","${branch.replace(/"/g, '""')}","${address.replace(/"/g, '""')}","${bankGroup}","${stateName}","${districtName}",${lat},${lng},1\n`
    );

    // Limit to reasonable sample size if needed (e.g. 15,000 top relevant branches for demonstrability)
    if (matchedCount >= 15000) break;
  }

  outStream.end();

  validationReport.datasets.rbi_branches = {
    lines_scanned: lineIndex,
    branches_filtered_and_saved: matchedCount,
    invalid_coordinates_skipped: invalidCoords,
    disclaimer: 'RBI banking branches filtered by bank category; inclusion does not constitute official NSFDC accreditation.',
    output_file: 'data/processed/partner_branches.csv',
  };
  console.log(`✅ Filtered ${matchedCount} relevant RBI banking branches with valid coordinates.`);
}

/**
 * 3. Process GeoJSON Pincode Boundary Centroids
 */
async function processPincodeCentroids() {
  console.log('🗺️ Processing Pincode Boundary Centroids from GeoJSON...');
  const filePath = path.join(RAW_DIR, 'geo', 'pincode_boundary.geojson');
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ Pincode boundary GeoJSON not found at', filePath);
    return;
  }

  const outPath = path.join(PROCESSED_DIR, 'pincode_centroids.csv');
  const outStream = fs.createWriteStream(outPath, { encoding: 'utf8' });
  outStream.write('pincode,office_name,region,circle,centroid_lat,centroid_lng\n');

  let featureCount = 0;

  // Stream read to handle 90MB JSON without crashing memory
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const geojson = JSON.parse(fileContent);
    if (geojson.features && Array.isArray(geojson.features)) {
      for (const feat of geojson.features) {
        featureCount++;
        const p = feat.properties || {};
        const pin = (p.Pincode || '').trim();
        const office = (p.Office_Name || '').trim();
        const region = (p.Region || '').trim();
        const circle = (p.Circle || '').trim();

        // Compute simple bounding box centroid from polygon coordinates
        let sumLat = 0;
        let sumLng = 0;
        let coordCount = 0;

        function traverseCoords(coords) {
          if (!Array.isArray(coords)) return;
          if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            sumLng += coords[0];
            sumLat += coords[1];
            coordCount++;
          } else {
            for (const c of coords) traverseCoords(c);
          }
        }

        if (feat.geometry && feat.geometry.coordinates) {
          traverseCoords(feat.geometry.coordinates);
        }

        const centLat = coordCount > 0 ? (sumLat / coordCount).toFixed(6) : '';
        const centLng = coordCount > 0 ? (sumLng / coordCount).toFixed(6) : '';

        outStream.write(
          `"${pin}","${office.replace(/"/g, '""')}","${region.replace(/"/g, '""')}","${circle.replace(/"/g, '""')}",${centLat},${centLng}\n`
        );
      }
    }
  } catch (err) {
    console.error('Error parsing pincode GeoJSON:', err);
  }

  outStream.end();

  validationReport.datasets.pincode_centroids = {
    features_processed: featureCount,
    output_file: 'data/processed/pincode_centroids.csv',
  };
  console.log(`✅ Extracted centroids for ${featureCount} pincode boundaries.`);
}

async function main() {
  await processPincodes();
  await processRbiBankOutlets();
  await processPincodeCentroids();

  // Save validation report
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'validation_report.json'),
    JSON.stringify(validationReport, null, 2)
  );
  console.log('🎉 Data processing complete. Validation report saved.');
}

main().catch(console.error);
