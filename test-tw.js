const fs = require('fs');
const path = require('path');

try {
  const twNode = require('@tailwindcss/node');
  console.log('twNode keys:', Object.keys(twNode));
} catch (e) {
  console.error('Error requiring @tailwindcss/node:', e);
}
