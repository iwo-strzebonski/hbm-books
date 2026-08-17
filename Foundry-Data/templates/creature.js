/**
 * HbM: RPG v3 - Creature/Monster Template
 */

export const creatureTemplate = {
  name: '',
  nameEN: '',
  type: '',        // Typ (np. Humanoid, Bestia, Nieumarły)
  size: '',        // Rozmiar
  alignment: '',   // Charakter
  
  // Stats
  stats: {
    hp: 0,
    hpFormula: '',
    ac: 0,
    acType: '',
    speed: '',
    
    // Attributes
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  
  // Combat
  combat: {
    attacks: [],
    specialAbilities: [],
    reactions: [],
    legendaryActions: [],
  },
  
  // Defenses
  defenses: {
    savingThrows: [],
    skills: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: '',
    languages: '',
  },
  
  // Challenge
  challenge: {
    cr: 0,
    xp: 0,
  },
  
  // Lore
  lore: {
    description: '',
    habitat: '',
    behavior: '',
    history: '',
  },
  
  notes: '',
};

function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function formatCreatureForBook(creature) {
  const stats = creature.stats;
  const mods = {
    str: formatModifier(getModifier(stats.str)),
    dex: formatModifier(getModifier(stats.dex)),
    con: formatModifier(getModifier(stats.con)),
    int: formatModifier(getModifier(stats.int)),
    wis: formatModifier(getModifier(stats.wis)),
    cha: formatModifier(getModifier(stats.cha)),
  };

  let output = `## ${creature.name}
*${creature.size} ${creature.type}, ${creature.alignment}*

---

**Klasa Pancerza:** ${stats.ac}${stats.acType ? ` (${stats.acType})` : ''}
**Punkty Wytrzymałości:** ${stats.hp}${stats.hpFormula ? ` (${stats.hpFormula})` : ''}
**Szybkość:** ${stats.speed}

---

| SIŁ | ZRE | KON | INT | MDR | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| ${stats.str} (${mods.str}) | ${stats.dex} (${mods.dex}) | ${stats.con} (${mods.con}) | ${stats.int} (${mods.int}) | ${stats.wis} (${mods.wis}) | ${stats.cha} (${mods.cha}) |

---
`;

  const def = creature.defenses;
  if (def.savingThrows.length) output += `**Rzuty Obronne:** ${def.savingThrows.join(', ')}\n`;
  if (def.skills.length) output += `**Umiejętności:** ${def.skills.join(', ')}\n`;
  if (def.damageResistances.length) output += `**Odporności na Obrażenia:** ${def.damageResistances.join(', ')}\n`;
  if (def.damageImmunities.length) output += `**Niewrażliwości na Obrażenia:** ${def.damageImmunities.join(', ')}\n`;
  if (def.conditionImmunities.length) output += `**Niewrażliwości na Stany:** ${def.conditionImmunities.join(', ')}\n`;
  if (def.senses) output += `**Zmysły:** ${def.senses}\n`;
  if (def.languages) output += `**Języki:** ${def.languages}\n`;
  output += `**Poziom Wyzwania:** ${creature.challenge.cr} (${creature.challenge.xp} PD)\n`;

  output += '\n---\n\n';

  // Special Abilities
  if (creature.combat.specialAbilities.length) {
    creature.combat.specialAbilities.forEach(ability => {
      output += `***${ability.name}.*** ${ability.description}\n\n`;
    });
  }

  // Actions
  if (creature.combat.attacks.length) {
    output += '### Akcje\n\n';
    creature.combat.attacks.forEach(attack => {
      output += `***${attack.name}.*** ${attack.description}\n\n`;
    });
  }

  // Reactions
  if (creature.combat.reactions.length) {
    output += '### Reakcje\n\n';
    creature.combat.reactions.forEach(reaction => {
      output += `***${reaction.name}.*** ${reaction.description}\n\n`;
    });
  }

  // Legendary Actions
  if (creature.combat.legendaryActions.length) {
    output += '### Akcje Legendarne\n\n';
    creature.combat.legendaryActions.forEach(action => {
      output += `***${action.name}.*** ${action.description}\n\n`;
    });
  }

  // Lore
  if (creature.lore.description) {
    output += '---\n\n';
    output += creature.lore.description + '\n';
  }

  return output.trim();
}

export default { creatureTemplate, formatCreatureForBook };
