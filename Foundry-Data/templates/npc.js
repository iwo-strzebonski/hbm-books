/**
 * HbM: RPG v3 - NPC Template
 */

export const npcTemplate = {
  name: '',
  title: '',          // e.g., "The Blacksmith", "High Priest"
  race: '',
  gender: '',
  age: '',
  occupation: '',
  location: '',

  // Appearance
  appearance: {
    height: '',
    build: '',
    hair: '',
    eyes: '',
    distinguishing: '',  // Scars, tattoos, etc.
    clothing: '',
  },

  // Personality
  personality: {
    traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
    mannerisms: '',
    voice: '',          // How they speak
  },

  // Background
  background: {
    history: '',
    secrets: '',
    goals: '',
    fears: '',
  },

  // Relationships
  relationships: [],    // { name, relation, notes }

  // For combat NPCs
  statBlock: null,      // Reference to creature template if needed

  // Roleplay hooks
  hooks: [],            // Quest hooks, rumors, etc.

  notes: '',
};

export function formatNPCForBook(npc) {
  let output = `## ${npc.name}`;
  if (npc.title) output += `, ${npc.title}`;
  output += '\n\n';

  // Basic info
  const basicInfo = [npc.race, npc.gender, npc.age, npc.occupation].filter(Boolean);
  if (basicInfo.length) {
    output += `*${basicInfo.join(', ')}*\n`;
  }
  if (npc.location) {
    output += `**Lokacja:** ${npc.location}\n`;
  }
  output += '\n';

  // Appearance
  if (npc.appearance.distinguishing || npc.appearance.clothing) {
    output += '### Wygląd\n\n';
    const appearanceDetails = [];
    if (npc.appearance.height) appearanceDetails.push(npc.appearance.height);
    if (npc.appearance.build) appearanceDetails.push(npc.appearance.build);
    if (npc.appearance.hair) appearanceDetails.push(`włosy: ${npc.appearance.hair}`);
    if (npc.appearance.eyes) appearanceDetails.push(`oczy: ${npc.appearance.eyes}`);

    if (appearanceDetails.length) {
      output += appearanceDetails.join(', ') + '.\n\n';
    }
    if (npc.appearance.distinguishing) {
      output += `**Znaki szczególne:** ${npc.appearance.distinguishing}\n`;
    }
    if (npc.appearance.clothing) {
      output += `**Ubiór:** ${npc.appearance.clothing}\n`;
    }
    output += '\n';
  }

  // Personality
  output += '### Osobowość\n\n';
  if (npc.personality.traits.length) {
    output += `**Cechy:** ${npc.personality.traits.join(', ')}\n`;
  }
  if (npc.personality.ideals.length) {
    output += `**Ideały:** ${npc.personality.ideals.join(', ')}\n`;
  }
  if (npc.personality.bonds.length) {
    output += `**Więzi:** ${npc.personality.bonds.join(', ')}\n`;
  }
  if (npc.personality.flaws.length) {
    output += `**Wady:** ${npc.personality.flaws.join(', ')}\n`;
  }
  if (npc.personality.mannerisms) {
    output += `**Maniery:** ${npc.personality.mannerisms}\n`;
  }
  if (npc.personality.voice) {
    output += `**Głos:** ${npc.personality.voice}\n`;
  }
  output += '\n';

  // Background
  if (npc.background.history || npc.background.goals) {
    output += '### Historia\n\n';
    if (npc.background.history) {
      output += npc.background.history + '\n\n';
    }
    if (npc.background.goals) {
      output += `**Cele:** ${npc.background.goals}\n`;
    }
    if (npc.background.fears) {
      output += `**Lęki:** ${npc.background.fears}\n`;
    }
    output += '\n';
  }

  // Relationships
  if (npc.relationships.length) {
    output += '### Relacje\n\n';
    npc.relationships.forEach(rel => {
      output += `• **${rel.name}** (${rel.relation})`;
      if (rel.notes) output += ` - ${rel.notes}`;
      output += '\n';
    });
    output += '\n';
  }

  // Hooks
  if (npc.hooks.length) {
    output += '### Zaczepki Fabularne\n\n';
    npc.hooks.forEach(hook => {
      output += `• ${hook}\n`;
    });
    output += '\n';
  }

  // Secrets (for GM)
  if (npc.background.secrets) {
    output += '> **[DLA MG]** ' + npc.background.secrets + '\n';
  }

  return output.trim();
}

export default { npcTemplate, formatNPCForBook };
