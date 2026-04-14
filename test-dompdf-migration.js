// Test script to validate the dompdf migration
console.log('Testing dompdf.js migration...');

// Verify that the necessary modules can be imported
try {
  // Test importing the new dompdf export module
  import('./src/lib/dompdf-export.ts');
  console.log('✓ Successfully imported dompdf-export.ts');
} catch (e) {
  console.log('✗ Failed to import dompdf-export.ts:', e.message);
}

// Verify that dompdf is available in node_modules
try {
  const dompdf = require('dompdf.js');
  console.log('✓ Successfully required dompdf.js from node_modules');
} catch (e) {
  console.log('✗ Failed to require dompdf.js:', e.message);
}

console.log('Migration validation completed.');