# Plan: HbM RPG v3 - Comprehensive Lore Buildout

## TL;DR
Phased, multi-batch buildout to bring the vault to player- and GM-ready status. We migrate canon from `_books/` into the vault (which becomes the new source of truth), make `concepts/` the canonical short-form definitions while `lore/` essays become longform narrative, fill empty stubs (races, organizations, disciplines), and introduce missing structural elements (in-world calendar, magical education, religion frameworks, tech-level table, gazetteer). Each phase is a reviewable batch; you approve before the next starts. A final pass audits all wikilinks/backlinks vault-wide.

---

## Canon Decisions (locked in this plan)

These are now canon and must be reflected wherever relevant:

- **The Abyss / Otchłań** - both a cosmic force AND a fundamental law of reality. Originally a single being **named Abyss**; she split into Abyss + **Mundus**, then **Tempus** split off. The remaining part of Abyss became known as **Nil** - therefore Nil is the eldest of the three. Nil/Mundus/Tempus are not avatars - they are the **consciousness of the Abyss itself**.
- **Posłańcy (Harbingers)** - mortal vessels chosen by the Personifikacje. Once chosen, a Posłaniec is **transformed and quasi-immortal**; the slot only frees if the Personifikacja wills it. **Each Personifikacja has exactly 2 Posłańców**, so 6 slots total, each tied to a distinct domain:
  - **Nil** (Przeszłość i Przyszłość):
    - **Posłaniec Przeszłości** = Diana Koniecpolska
    - **Posłaniec Przyszłości** = open hook
  - **Mundus** (Życie i Teraźniejszość):
    - **Posłaniec Życia** = **Szaarael** (sukkubica; also the demonic VP controlling the USA; Harbinger of Love)
    - **Posłaniec Mutacji** = open hook (hinted form: naga/lamia)
  - **Tempus** (Czas - kierunek biegu):
    - **Posłaniec Cofnięcia** = **Yssariel** (elfka; Harbinger of Pain)
    - **Posłaniec Postępu** = open hook (hinted form: elf)
  Polish term throughout: **Posłaniec / Posłańcy**. English (internal/notes only): Harbinger.
- **USA Blackout** - officially unknown. Truth: the demonic VP is **Szaarael**, Posłaniec Życia Mundusa (Harbinger of Love). A sukkubica who assumed the VP role to extend Mundus's influence over the USA's magical and social development. "Harbinger of Love" reflects her domain over human connection, desire, and societal bonds.
- **Diana Koniecpolska** - ambition + research-induced madness; Nil began teaching her in dreams; she has now become Posłaniec Nil (Posłaniec Przeszłości).
- **Robert Zaryn** - technically the only mage truly worthy of "Blood God"; his body was destroyed and mind shattered centuries ago. Other powerful blood mages have since adopted the title. His sole living enemy is **Xillith / First Patriarch / Bezimienny**. Current goal: regain power and manipulate Federation Sol-3 into cleansing Xivell.
- **Xillith / First Patriarch / Bezimienny** (the elder) - Nadworny Taumaturg of Królestwo Xivell. Created the parasite that caused the Upadek. Struck down by Nil; only **partially** erased from reality - thanks to his artifacts he persists as a voice in his Avatars' minds and can take physical control of their bodies. After his death, taumaturgia splintered into the modern magic schools; his students founded the Szkarłatny Kult. **Current goal:** seize control of the Szkarłatny Kult. *Disambiguation: do **not** confuse with the modern student-NPC of the same name.*
- **Xillith (the student)** - separate, modern character. Member of the Szkarłatny Kult and student at Wschodnioeuropejska Szkoła Magii. Distinct file from the elder Xillith. Both pages must cross-link with a clear "Nie mylić z…" disambiguation note.
- **Xivell parasite** - magical bioweapon engineered by **the elder Xillith** to destroy Królestwo Zaryn during the inter-Xivell war; spiraled out of control and consumed the entire planet (the Upadek). Lore inspiration: Blightfall (Minecraft modpack).
- **Karolina Fey** - philosophical schism with her mother (unnamed). Mother *harmonized* (stabilize reality by appeasing the Abyss). Karolina *commands* (bends the Abyss to the mage's will). Karolina destroyed her mother **body and soul**. Abyss Sabat now follows her **out of fear** - you don't disobey someone proven capable of destroying planets.
- **Inkwizycja** - historically affiliated with the Church; separated thanks to a cardinal (canonical event documented in books). Now operates as a largely secular **world-wide magic police**, retaining religious aesthetics and some institutional ties.
- **Zakon Taumaturgów** - *not* a serious order. Full name: **Koło Wzajemnej Pomocy dla Uczniów Słabiej Utalentowanych Magicznie**. A student club at Wschodnioeuropejska Szkoła Magii for magically weak students whose discipline is treated as a sub-branch of taumaturgia. Tone: comedic / mundane. Not a power-broker faction - earlier assumptions were wrong.
- **Bill Cipher and Co.** - explicit *Gravity Falls* reference; tone is light/parodic relative to the rest of the lore.
- **Wielka Trzynastka** - the 13 founding magic schools. The core book specifies their **physical locations** but not in-universe names. **Wschodnioeuropejska Szkoła Magii** is one of them, anchored in a sub-dimension moored south of Kraków on the city's edge; divided into language-based sections. Other 12 schools' names = open hooks (location-only canon).
- **First War with Malferian Consortium (2022–2023)** - Federation Sol-3 actually struck first; official narrative blames Malferian aggression. Real motive: prevent anyone from slowing Sol-3 expansion.
- **Xivell colonization** - true reasons: secret magical knowledge buried on the planet + strategic position. The parasite plague is acceptable cost.
- **Calendar:** **Era Przebudzenia (EP)**, **EP 0 = 2023** (16.IV.2023 Awakening). Current = **EP 3 (2026)**. Convention: Polish "Era Przebudzenia" / abbrev "EP".
- **Federation Sol-3 / Malferian War truth visibility:** known to (a) top Federation leadership and Malferian Houses, and (b) leaked into conspiracy circles as deniable rumor. Plant subtle hints in conspiracy-adjacent NPC/org notes; keep mainstream lore on the official narrative.
- **Race source policy:** for races without rich vault content (Demon, Anioł, Feles, Lamia, Malferianin), **synthesize from `_books/`** during Phase 3 - no freestyle invention.
- **Named NPC canonicity:** Syllia Orirel, Serioża Żukow, Pelagius Caudex, Aurora Nylabelle, Thingrim Magnarson, Princess Zayis, Prince Arkthar, and the four Malferian Houses (Tyrris, Veyran, Kael, Serath) are all canonical names - keep verbatim.
- **Robert Zaryn alias** - "Ten, Który jest Mroczny" is an alias/title, same NPC. Canonical file: `npcs/Magowie Krwi/Ten, Który jest Mroczny.md` (aliases: Robert Zaryn, Bóg Krwi, Król Królestwa Zaryn). Do not create a separate file - the existing NPC file already uses the Zaryn aliases.
- **Aurora Nylabelle** - full canonical name. NPC file `npcs/Uczniowie/Aurora.md` carries `aliases: [Aurora Nylabelle, Księżniczka Aurora]`. The surname is canon and must be used in all cross-references.
- **Szaarael** - Posłaniec Życia (Mundus), sukkubica, demonic VP of USA. NPC file: `npcs/Kult Otchłani/Szaarael.md`.
- **Yssariel** - Posłaniec Cofnięcia (Tempus), elfka, Harbinger of Pain. NPC file: `npcs/Kult Otchłani/Yssariel.md`.
- **Plan file canonical location** - `.github/plans/lore-update-2026-05-06.md` (working copy may also exist at `_plans/` during editing).

---

## Structural Decisions (locked)

- **`concepts/` = canonical short definitions.** In-world encyclopedia voice. Each concept page = crisp definition + summary + links to longform.
- **`lore/` = longform narrative essays.** Mixed voice (in-world body + GM callouts). Numbered files are author/GM-facing deep dives.
- **Voice:** mixed - in-world body text with `> [!gm]` (or equivalent) callouts for spoilers, secret truths, and Harbinger reveals.
- **Books → vault migration:** lift-and-restructure. Copy from `_books/`, rewrite for vault structure, stay close to source.
- **Wikilinks:** fix-as-you-go is allowed but a **dedicated final phase** does the vault-wide audit.
- **New structures to introduce:** in-world calendar, magical education system, per-race religion/spirituality, tech-level comparison table, city/geography gazetteer.

---

## Phases

Each phase ends with a review checkpoint. You approve before the next starts.

### Phase 0 - Templates & Conventions (foundation, 1 batch)

Establish the patterns everything else uses.

- Create `_templates/Rasa.template.md` (race) - sections: krótki opis, biologia/morfologia, kultura, religia/duchowość, język, historia, relacje z innymi rasami, magia/wrażliwość na Otchłań, znani przedstawiciele, hooks dla MG.
- Create `_templates/Dyscyplina.template.md` (magic discipline) - sections: definicja (in-world), historia szkoły, filozofia/założenia, poddyscypliny, znani praktycy, status prawny (Inkwizycja), mechanika (krótko + link), GM callout.
- Create `_templates/Koncept.template.md` (concept) - sections: definicja, etymologia/pochodzenie nazwy, znaczenie w grze, powiązania, dalsze lektury (linki do `lore/`).
- Define the GM callout convention (Obsidian admonition / `> [!gm]` block). Document in `README.md` or a small `_templates/_styleguide.md`.
- Define the in-world calendar: e.g. **Era Przebudzenia** (EP) - Year 0 = 16.IV.2023; current = EP 3 (2026). Document conversion in calendar concept page.

**Verification:** templates exist; styleguide exists; calendar concept page exists; one example race file (e.g. Człowiek) drafted using the new template as proof.

### Phase 1 - Concepts (the canonical layer)

Make `concepts/` the source of truth that wikilinks resolve to.

- Fill `concepts/Otchłań.md` with the new canon (Abyss-as-being → split into Nil/Mundus/Tempus; cosmic force + fundamental law). Link to `lore/02. Otchłań i Magia.md` for the longform.
- Fill `concepts/Szkoły Magii.md` as an index of all 13+ disciplines with one-line summaries and links.
- Fill `concepts/Teoria Jednego Wszechświata.md` - extract from `lore/10.`, summarize, link.
- New concepts to create:
  - `concepts/Posłańcy.md` (the six Posłańcy - 2 per Personifikacja; Past, Życie, Tempus pairs; what they are; named slots vs open hooks)
  - `concepts/Personifikacje Otchłani.md` (Nil, Mundus, Tempus as consciousness fragments)
  - `concepts/Era Przebudzenia.md` (calendar)
  - `concepts/Magiczna Edukacja.md` (Wielka Trzynastka academies, durations, certification, Inquisition licensing)
  - `concepts/Równowaga.md` (Equilibrium - what breaks it, consequences)
- Refactor `lore/02.` and `lore/10.` to **link to** the concept pages rather than re-defining inline.

**Verification:** every empty concept file now has content; `[[Otchłań]]` and `[[Teoria Jednego Wszechświata]]` resolve to real definitions; new concept files exist; longform `lore/` essays still read coherently after links inserted.

### Phase 2 - Disciplines (parity pass)

Bring all magic schools to comparable depth using the discipline template + `_books/Księga Magii.md` as source.

- **Empty → fill:** Nekromancja, Magia Runiczna, Taumaturgia, Golemancja, Magia Szkarłatu, Magia Otchłani.
- **Thin → expand:** Botanika, Alchemia, Magia Iluzji, Magia Żywiołów, Magia Sakralna.
- **Already strong (use as templates):** Dzika Wiedźmia Magia, Wiedźmia Magia, Magia Krwi, Rzemiosło Artefaktów. Light pass to add GM callouts and align format.
- For each: history, philosophy, famous practitioners (link to NPC file even if NPC stub), legal status (Inkwizycja stance), mechanics summary + cross-link to book.
- Special canon insertions:
  - **Magia Krwi**: encode Zaryn canon (body destroyed, mind shattered, "Blood God" title diluted, enemy = First Patriarch).
  - **Magia Otchłani**: encode the harmonize-vs-command schism; reference Karolina Fey vs her mother as case study.
  - **Rzemiosło Artefaktów**: Diana subplot - her temple-generator tech, her descent, her becoming Harbinger of Past (GM callout).

**Verification:** every discipline page has the same section skeleton; word-count variance reduced (target: 600–1500 words each); every discipline references at least one named practitioner; GM callouts present where canon reveals exist.

### Phase 3 - Races (player-facing essentials)

Use `_templates/Rasa.template.md` and source from `lore/10. Przewodnik Ludzkości…` plus `_books/`.

- Fill: Człowiek, Elf (split notes for Wysokie/Leśne in subsections), Krasnolud, Demon, Anioł, Feles, Lamia, Malferianin.
- For each: biology, culture, religion (per phase decision), language notes, history with the Federation, magical affinities, notable NPCs, GM hooks.
- Cross-link from race pages to relevant locations (Elves ↔ Hiondirs-4, Lamiae ↔ Eldrakar, Malferianie ↔ Konsorcjum) and disciplines (Krasnoludy ↔ Magia Runiczna).

**Verification:** all 8 race files have full template completion; each links to its home location, primary discipline, and at least one organization.

### Phase 4 - Organizations (faction depth)

Fill the four critical stubs and lightly polish the strong ones.

- **Szkarłatny Kult** - full structure (13 Pretorów, Knights/Priests duality, Obsidian Obelisks, Crimson Domain). **Origin canon:** founded by Xillith's surviving students after the Upadek to preserve taumaturgical knowledge, though the cult has since lost most of its original purpose. **Current threat:** Xillith himself is trying to seize control via his Avatars. First Matriarch ambiguity preserved. Source: `lore/05.` + `_books/Chwała Szkarłatnemu Kultowi.md`.
- **Kult Otchłani** (Zakon Otwartego Oka) - theology of Personifikacje, Diana as Posłaniec Przeszłości (GM callout), Nil/Mundus/Tempus worship distinctions, Diana subplot.
- **Inkwizycja** - historical Church affiliation, cardinal-led separation, current role as world-wide magic police; selective enforcement doctrine; relationship to all magic schools; jurisdictional limits. Lift the Church-separation event from `_books/`.
- **Zakon Taumaturgów** - *recategorize as a minor / comedic entity*, not a major faction. Document as the school club at Wschodnioeuropejska Szkoła Magii ("Koło Wzajemnej Pomocy…"). Move the file to a more appropriate location if needed (e.g. as a sub-page of the school) - flag this for review during the phase.
- **Federacja Sol-3** - append GM callout encoding the truth about who started the Malferian War + Xivell's true purpose.
- **Konsorcjum Gwiezdne Malferian** - append the "they didn't start it" reveal as GM callout; document remaining 5 systems, House dynamics, war-II potential as in-world tension.
- **Bill Cipher and Co.** - light expansion; document imprisonment & residual threat.

**Verification:** every organization file has stat-block + body + GM callout; all reference their key NPCs; the Malferian War narrative is coherent across `Federacja`, `Konsorcjum`, and `conflicts/Pierwsza Wojna…` pages.

### Phase 5 - NPCs, Locations, Gazetteer

Connect the world.

- **Named NPCs** to create or expand: Diana Koniecpolska (Posłaniec Przeszłości reveal), Karolina Fey (command/harmonize doctrine), Robert Zaryn, **Xillith the Elder / First Patriarch / Bezimienny** (with Avatar control mechanic), **Xillith the Student** (separate file, Szkarłatny Kult member, Wschodnioeuropejska Szkoła Magii student - must include disambiguation note), Syllia Orirel, Serioża Żukow, Pelagius Caudex, Aurora Nylabelle, Thingrim Magnarson, the demonic VP / Posłaniec Życia (unnamed), Princess Zayis, Prince Arkthar.
- **Locations to add:** Eldrakar (mentioned but no file), Khazad-Morul (dwarven homeworld), Kraków (gateway to Hiondirs), Zürich (magical stock exchange), the Wielka Trzynastka academies as a gazetteer page or per-school stubs.
- **Tech-level comparison table** - single page comparing Earth / Federation / Krasnoludy / Elfy / Malferianie across categories (energy, transport, weapons, communication, magic-tech fusion).
- **Sub-conflicts** - short pages or sections for Kashmir / Nile / Taiwan crises mentioned in `lore/03.`.

**Verification:** every NPC referenced in disciplines/organizations resolves to a file; new locations exist with infobox + body; tech table exists and is referenced from at least 3 race/org pages.

### Phase 6 - Wikilink & Backlink Audit

Vault-wide cleanup.

- Scan all `[[wikilinks]]` for unresolved targets; create stubs or fix targets.
- Verify each major concept has reasonable backlinks (Dataview-style or manual).
- Verify Obsidian aliases are set where folder-paths might create ambiguity.
- Update `HBM_BOOKS_REFERENCE.md` and the root index files (`classes.md`, `concepts.md`, `disciplines.md`, etc.) to reflect new content.

**Verification:** zero red wikilinks vault-wide; root index files list everything; spot-check 10 random pages - all internal links work and lead to relevant content.

---

## Relevant files (high-traffic)

- `_templates/` - new templates land here (Rasa, Dyscyplina, Koncept) plus styleguide.
- `concepts/` - becomes the canonical layer; all 3 existing files filled, 5 new ones added.
- `lore/02.` and `lore/10.` - refactored to link to concepts instead of duplicating definitions.
- `disciplines/` - 6 empty files filled, 5 thin files expanded, 4 strong files polished.
- `races/` - all 8 files written from scratch using the template.
- `organizations/Szkarłatny Kult.md`, `organizations/Kult Otchłani.md`, `organizations/Inkwizycja.md`, `organizations/Zakon Taumaturgów.md` - full rewrites.
- `organizations/Federacja Sol-3.md`, `organizations/Konsorcjum Gwiezdne Malferian.md` - append GM-callout reveals.
- `npcs/` - multiple new NPC files; Diana, Karolina, Zaryn, First Patriarch are highest priority.
- `locations/` - Eldrakar, Khazad-Morul, Kraków, Zürich added.
- Root index files (`concepts.md`, `disciplines.md`, `races.md`, `organizations.md`, `locations.md`, `npcs.md`, `classes.md`) - refreshed in Phase 6.
- `_books/` - read-only reference; content lifted-and-restructured into vault.

---

## Scope boundaries

**In scope:** lore content, in-world voice, GM callouts, structural pages (calendar, education, gazetteer), wikilink hygiene, templates.

**Out of scope (separate plans if you want them):**
- Mechanics/crunch rewriting (the `rules/` and Foundry system in `.src/foundry-system/`).
- Adventure module writing (`adventures/`).
- Tabletop card layouts (`tabletop-cards/`).
- Translation of any content to English.
- Re-canonizing material against the books beyond what's needed to fill stubs (no second-guessing existing canon unless you flag it).

---

## Further considerations (resolved)

1. **Open Posłaniec slots** - 3 slots remain unfilled: Posłaniec Przyszłości (Nil), Posłaniec Mutacji (Mundus), Posłaniec Postępu (Tempus). Szaarael (Życia) and Yssariel (Cofnięcia) are now named canon alongside Diana (Przeszłości). Left as adventure hooks; the 2-per-Personifikacja rule is canon. Documented in `concepts/Posłańcy.md`.
2. **Calendar adoption depth** - keep Gregorian dates, append EP in parentheses (e.g. "16.IV.2023 (EP 0)"). Backwards-compatible.
3. **GM callout syntax** - `> [!gm]+ Tylko dla MG` (collapsible Obsidian callout).
4. **Tempus Posłańcy names** - **Posłaniec Cofnięcia / Posłaniec Postępu**.
5. **Templates** - include YAML frontmatter (tags, aliases, status) matching existing strong pages.

---

## Task Checklist

- [x] **Krok 1 - Uzgodnienie planu** - plan skonsolidowany, decyzje kanoniczne zatwierdzone, lista zadań ustalona.
- [x] **Krok 2 - Głęboki pass dyscyplin** - Magia Krwi, Magia Otchłani, Taumaturgia, Rzemiosło Artefaktów zaktualizowane zgodnie z kanonem.
- [x] **Krok 3 - Organizacje** - Federacja Sol-3, Konsorcjum, Inkwizycja, Szkarłatny Kult, Kult Otchłani, Bill Cipher and Co. zaktualizowane.
- [x] **Krok 4 - Głęboki pass ras** - Krasnolud, Lamia, Malferianin rozbudowane; błąd Feles Aurora naprawiony.
- [x] **Krok 5 - Zaległości NPC** - Diana Koniecpolska, Ten Który jest Mroczny, Karolina Fey, Bezimienny Pierwszy Patriarcha, Xillith Isherwood, Szaarael, Yssariel, Thingrim Magnarson, Princess Zayis, Prince Arkthar ukończone.
- [x] **Krok 6 - Odniesienia do tabeli tech** - dodane do Krasnolud, Malferianin, Konsorcjum.
- [ ] **Krok 7 - Audyt Fazy 6** - odświeżenie indeksu, poprawki YAML frontmatter, audyt wikilinków.

---

## Stan na 2026-05-22

Sesja zakończyła się sukcesem. Ukończono kroki 1–6:

- **Plan** (krok 1) uzgodniony i skonsolidowany na początku sesji.
- **Dyscypliny** (krok 2): Magia Krwi, Magia Otchłani, Taumaturgia i Rzemiosło Artefaktów wzbogacone o sekcje historii, filozofii, znanych praktyków oraz callout-y GM z kanonem (Zaryn, Karolina Fey, Diana).
- **Organizacje** (krok 3): Federacja Sol-3 i Konsorcjum Gwiezdne Malferian uzupełnione o GM-callout z prawdą o wojnie; Inkwizycja, Szkarłatny Kult i Kult Otchłani przebudowane strukturalnie; Bill Cipher and Co. rozbudowane o kontekst więzienia i szczątkowego zagrożenia.
- **Rasy** (krok 4): Krasnolud i Malferianin mocno rozbudowane (biologia, kultura, historia, linki do lokacji i dyscyplin); Lamia uzupełniona; błąd Aurora Nylabelle w pliku Feles naprawiony.
- **NPC** (krok 5): stworzone lub zaktualizowane pliki dla wszystkich 10 priorytetowych postaci (Diana Koniecpolska, Ten Który jest Mroczny/Robert Zaryn, Karolina Fey, Bezimienny Pierwszy Patriarcha, Xillith Isherwood, Szaarael, Yssariel, Thingrim Magnarson, Princess Zayis, Prince Arkthar).
- **Cross-referencje do tabeli tech** (krok 6): wstawione do plików Krasnolud, Malferianin i Konsorcjum.

**Pozostałe:** krok 7 - vault-wide audyt wikilinków, poprawki YAML frontmatter, odświeżenie plików indeksowych (`disciplines.md`, `races.md`, `organizations.md`, `npcs.md` itp.).