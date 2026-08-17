/**
 * HbM: RPG v3 - Spell Template
 */

export const spellTemplate = {
  name: '',
  nameEN: '',  // English translation
  school: '',  // Szkoła magii
  circle: 1,   // Krąg (1-9)
  castingTime: '',
  range: '',
  duration: '',
  components: {
    verbal: false,
    somatic: false,
    material: '',
  },
  description: '',
  higherCircles: '',  // Opis dla wyższych kręgów
  notes: '',
};

export function formatSpellForBook(spell) {
  const components = [];
  if (spell.components.verbal) components.push('W');
  if (spell.components.somatic) components.push('S');
  if (spell.components.material) components.push(`M (${spell.components.material})`);

  return `### ${spell.name}
*${spell.school}, ${spell.circle}. krąg*

**Czas rzucania:** ${spell.castingTime}
**Zasięg:** ${spell.range}
**Komponenty:** ${components.join(', ')}
**Czas trwania:** ${spell.duration}

${spell.description}

${spell.higherCircles ? `**Na wyższych kręgach:** ${spell.higherCircles}` : ''}
`.trim();
}

export function parseSpellFromText(text) {
  // Basic parser for spell text - customize based on your format
  const spell = { ...spellTemplate };
  
  const nameMatch = text.match(/^###?\s*(.+)/m);
  if (nameMatch) spell.name = nameMatch[1].trim();
  
  const schoolMatch = text.match(/\*([^,]+),\s*(\d+)\.\s*krąg\*/);
  if (schoolMatch) {
    spell.school = schoolMatch[1].trim();
    spell.circle = parseInt(schoolMatch[2]);
  }
  
  const castingMatch = text.match(/Czas rzucania:\*?\*?\s*(.+)/i);
  if (castingMatch) spell.castingTime = castingMatch[1].trim();
  
  const rangeMatch = text.match(/Zasięg:\*?\*?\s*(.+)/i);
  if (rangeMatch) spell.range = rangeMatch[1].trim();
  
  const durationMatch = text.match(/Czas trwania:\*?\*?\s*(.+)/i);
  if (durationMatch) spell.duration = durationMatch[1].trim();
  
  return spell;
}

export default { spellTemplate, formatSpellForBook, parseSpellFromText };
