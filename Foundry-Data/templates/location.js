/**
 * HbM: RPG v3 - Location Template
 */

export const locationTemplate = {
  name: '',
  nameEN: '',
  type: '',           // City, Village, Dungeon, Forest, etc.
  region: '',

  // Basic info
  population: '',
  government: '',
  economy: '',

  // Description
  description: {
    overview: '',
    atmosphere: '',   // Mood, feeling, sounds, smells
    history: '',
    secrets: '',      // Hidden info for GM
  },

  // Points of Interest
  landmarks: [],      // { name, description }

  // Inhabitants
  notableNPCs: [],    // References or brief descriptions
  factions: [],       // { name, description, goals }

  // For adventures
  encounters: [],     // Possible random encounters
  hooks: [],          // Adventure hooks
  rumors: [],         // Things NPCs might say

  // For dungeons/adventure sites
  rooms: [],          // { number, name, description, contents }

  // Maps
  mapDescription: '', // Text description if no map available

  notes: '',
};

export function formatLocationForBook(location) {
  let output = `## ${location.name}\n`;
  if (location.type || location.region) {
    output += `*${[location.type, location.region].filter(Boolean).join(', ')}*\n`;
  }
  output += '\n';

  // Overview
  if (location.description.overview) {
    output += location.description.overview + '\n\n';
  }

  // Basic info
  const info = [];
  if (location.population) info.push(`**Populacja:** ${location.population}`);
  if (location.government) info.push(`**Władza:** ${location.government}`);
  if (location.economy) info.push(`**Gospodarka:** ${location.economy}`);
  if (info.length) {
    output += info.join(' | ') + '\n\n';
  }

  // Atmosphere
  if (location.description.atmosphere) {
    output += '### Atmosfera\n\n';
    output += location.description.atmosphere + '\n\n';
  }

  // Landmarks
  if (location.landmarks.length) {
    output += '### Ważne Miejsca\n\n';
    location.landmarks.forEach(landmark => {
      output += `#### ${landmark.name}\n`;
      output += landmark.description + '\n\n';
    });
  }

  // Notable NPCs
  if (location.notableNPCs.length) {
    output += '### Ważne Postacie\n\n';
    location.notableNPCs.forEach(npc => {
      if (typeof npc === 'string') {
        output += `• ${npc}\n`;
      } else {
        output += `• **${npc.name}** - ${npc.description}\n`;
      }
    });
    output += '\n';
  }

  // Factions
  if (location.factions.length) {
    output += '### Frakcje\n\n';
    location.factions.forEach(faction => {
      output += `#### ${faction.name}\n`;
      output += faction.description + '\n';
      if (faction.goals) output += `*Cele: ${faction.goals}*\n`;
      output += '\n';
    });
  }

  // History
  if (location.description.history) {
    output += '### Historia\n\n';
    output += location.description.history + '\n\n';
  }

  // Rumors
  if (location.rumors.length) {
    output += '### Plotki\n\n';
    location.rumors.forEach((rumor, i) => {
      output += `${i + 1}. ${rumor}\n`;
    });
    output += '\n';
  }

  // Adventure Hooks
  if (location.hooks.length) {
    output += '### Zaczepki Przygodowe\n\n';
    location.hooks.forEach(hook => {
      output += `• ${hook}\n`;
    });
    output += '\n';
  }

  // Encounters
  if (location.encounters.length) {
    output += '### Możliwe Spotkania\n\n';
    output += '| k20 | Spotkanie |\n';
    output += '|:---:|:----------|\n';
    location.encounters.forEach((enc, i) => {
      output += `| ${i + 1} | ${enc} |\n`;
    });
    output += '\n';
  }

  // Dungeon Rooms
  if (location.rooms.length) {
    output += '---\n\n## Pomieszczenia\n\n';
    location.rooms.forEach(room => {
      output += `### ${room.number}. ${room.name}\n\n`;
      output += room.description + '\n';
      if (room.contents) {
        output += `\n**Zawartość:** ${room.contents}\n`;
      }
      output += '\n';
    });
  }

  // GM Secrets
  if (location.description.secrets) {
    output += '---\n\n';
    output += '> **[DLA MG]** ' + location.description.secrets + '\n';
  }

  return output.trim();
}

export default { locationTemplate, formatLocationForBook };
