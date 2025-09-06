// utils/eco.js
// Simple hardcoded eco impact table per category.
// Numbers are illustrative — adjust if you like.
const ECO_TABLE = {
  Clothes: { co2Kg: 2, waterL: 1000 },
  Books: { co2Kg: 0.5, waterL: 50 },
  Electronics: { co2Kg: 50, waterL: 20000 },
  Furniture: { co2Kg: 30, waterL: 5000 },
  Accessories: { co2Kg: 1, waterL: 200 },
  Other: { co2Kg: 2, waterL: 200 }
};

function getEcoScore(category = 'Other', multiplier = 1) {
  const base = ECO_TABLE[category] || ECO_TABLE['Other'];
  return {
    co2Saved: Math.round(base.co2Kg * multiplier),
    waterSaved: Math.round(base.waterL * multiplier)
  };
}

module.exports = { getEcoScore };
