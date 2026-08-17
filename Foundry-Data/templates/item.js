/**
 * HbM: RPG v3 - Item Template
 */

export const itemTemplate = {
  name: '',
  nameEN: '',
  type: '',           // Weapon, Armor, Potion, Wondrous, etc.
  rarity: '',         // Common, Uncommon, Rare, Very Rare, Legendary, Artifact
  attunement: false,
  attunementReq: '',  // e.g., "by a spellcaster"
  
  // For weapons
  weapon: {
    damage: '',
    damageType: '',
    properties: [],   // e.g., ["Finesse", "Light", "Thrown (20/60)"]
  },
  
  // For armor
  armor: {
    ac: 0,
    acBonus: 0,
    type: '',         // Light, Medium, Heavy, Shield
    stealthDisadv: false,
    strRequirement: 0,
  },
  
  description: '',
  properties: [],     // Special properties/abilities
  history: '',        // Item lore/backstory
  
  // Pricing
  value: '',
  weight: '',
  
  notes: '',
};

const rarityPL = {
  'Common': 'Pospolity',
  'Uncommon': 'Niepospolity', 
  'Rare': 'Rzadki',
  'Very Rare': 'Bardzo Rzadki',
  'Legendary': 'Legendarny',
  'Artifact': 'Artefakt',
};

export function formatItemForBook(item) {
  const rarity = rarityPL[item.rarity] || item.rarity;
  let typeStr = item.type;
  
  if (item.weapon.damage) {
    typeStr = `Broń (${item.weapon.properties.join(', ')})`;
  } else if (item.armor.type) {
    typeStr = `Zbroja (${item.armor.type})`;
  }
  
  let attunement = '';
  if (item.attunement) {
    attunement = item.attunementReq 
      ? ` (wymaga dostrojenia ${item.attunementReq})`
      : ' (wymaga dostrojenia)';
  }

  let output = `### ${item.name}
*${typeStr}, ${rarity}${attunement}*

`;

  // Weapon stats
  if (item.weapon.damage) {
    output += `**Obrażenia:** ${item.weapon.damage} ${item.weapon.damageType}\n`;
    if (item.weapon.properties.length) {
      output += `**Właściwości:** ${item.weapon.properties.join(', ')}\n`;
    }
    output += '\n';
  }

  // Armor stats
  if (item.armor.type) {
    if (item.armor.ac) {
      output += `**KP:** ${item.armor.ac}`;
    } else if (item.armor.acBonus) {
      output += `**Bonus KP:** +${item.armor.acBonus}`;
    }
    if (item.armor.stealthDisadv) output += ` (utrudnia skradanie)`;
    if (item.armor.strRequirement) output += ` (wymaga SIŁ ${item.armor.strRequirement})`;
    output += '\n\n';
  }

  output += item.description + '\n';

  // Special properties
  if (item.properties.length) {
    output += '\n';
    item.properties.forEach(prop => {
      output += `• **${prop.name}:** ${prop.description}\n`;
    });
  }

  // Value and weight
  if (item.value || item.weight) {
    output += '\n---\n';
    if (item.value) output += `*Wartość: ${item.value}* `;
    if (item.weight) output += `*Waga: ${item.weight}*`;
    output += '\n';
  }

  // Lore/History
  if (item.history) {
    output += `\n*${item.history}*\n`;
  }

  return output.trim();
}

export default { itemTemplate, formatItemForBook };
