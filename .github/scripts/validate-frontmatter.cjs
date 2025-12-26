#!/usr/bin/env node
const fs = require('fs');

const RULES = {
  title: { required: true, minLength: 20, maxLength: 70 },
  description: { required: true, minLength: 140, maxLength: 170 },
  publishedDate: { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
  category: { required: true },
  tags: { required: true, isArray: true, minItems: 2 },
  image: { required: true },
  draft: { required: true }
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter found');
  const fm = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) {
      let val = m[2].trim().replace(/^["']|["']$/g, '');
      if (val.startsWith('[')) {
        fm[m[1]] = val.slice(1,-1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      } else if (val === 'true' || val === 'false') {
        fm[m[1]] = val === 'true';
      } else {
        fm[m[1]] = val;
      }
    }
  }
  return fm;
}

function validate(fm) {
  const errors = [];
  for (const [field, rules] of Object.entries(RULES)) {
    const val = fm[field];
    if (rules.required && val === undefined) errors.push(`${field}: required`);
    if (rules.minLength && val?.length < rules.minLength) errors.push(`${field}: min ${rules.minLength} chars`);
    if (rules.maxLength && val?.length > rules.maxLength) errors.push(`${field}: max ${rules.maxLength} chars`);
    if (rules.pattern && !rules.pattern.test(val)) errors.push(`${field}: invalid format`);
    if (rules.isArray && !Array.isArray(val)) errors.push(`${field}: must be array`);
    if (rules.minItems && val?.length < rules.minItems) errors.push(`${field}: min ${rules.minItems} items`);
  }
  return errors;
}

const file = process.argv[2];
if (!file) { console.error('Usage: validate-frontmatter.js <file>'); process.exit(1); }
const content = fs.readFileSync(file, 'utf8');
const fm = parseFrontmatter(content);
const errors = validate(fm);

if (errors.length > 0) {
  console.log('❌ Validation errors:');
  errors.forEach(e => console.log(`  - ${e}`));
  process.exit(1);
}
console.log('✅ Frontmatter valid');
console.log(`  Title: ${fm.title}`);
console.log(`  Description: ${fm.description?.length} chars`);
