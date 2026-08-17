# Module / System Content Split - HbM RPG v3

> **Status**: Draft / Planning Document
> **Audience**: Developer (next iteration of `hbm-rpg-v3` Foundry system + companion lore module)
> **Purpose**: Classify every chapter of every rulebook as **SYSTEM** (mechanics → Foundry system code/compendia), **MODULE** (lore → separate companion module), or **BOTH** (split content). Drives the package architecture for the v0.3+ release.

---

## Table of Contents

1. [Classification Legend](#1-classification-legend)
2. [Per-Book Classification](#2-per-book-classification)
   1. [Podręcznik Gry](#21-podrecznik-gry)
   2. [Księga Magii](#22-ksiega-magii)
   3. [Arcanum Sanguinis](#23-arcanum-sanguinis)
   4. [Chwała Szkarłatnemu Kultowi](#24-chwala-szkarlatnemu-kultowi)
   5. [Klątwa Otchłani](#25-klatwa-otchlani)
   6. [Przewodnik Ludzkości po Magicznym Świecie](#26-przewodnik-ludzkosci-po-magicznym-swiecie)
   7. [Bestiariusz](#27-bestiariusz)
   8. [Złoto Stal i Magia](#28-zloto-stal-i-magia)
3. [Aggregate Summary](#3-aggregate-summary)
4. [Proposed Package Architecture](#4-proposed-package-architecture)
5. [Compendium Pack Plan (System)](#5-compendium-pack-plan-system)
6. [Module Pack Plan (Lore)](#6-module-pack-plan-lore)
7. [Cross-References & Dependencies](#7-cross-references--dependencies)
8. [Migration & Build Pipeline](#8-migration--build-pipeline)

---

## 1. Classification Legend

| Tag | Meaning | Destination |
|---|---|---|
| **[SYSTEM]** | Pure mechanics: rules, tables, stat blocks, character options | `hbm-rpg-v3` system package + bundled compendium packs |
| **[MODULE]** | Pure lore/setting/fiction with no mechanical impact | `hbm-rpg-v3-lore` companion module (JournalEntry packs) |
| **[BOTH]** | Mixed content - split per section: stats stay in system, narrative moves to module, cross-linked | Both packages, with bidirectional `@UUID` links |

**Decision rule**:
> If removing the content would require renumbering rules, breaking character creation, or invalidating compendium entries → **SYSTEM**.
> If removing the content would only reduce flavor/setting depth → **MODULE**.
> If both apply → **BOTH** with explicit split points.

---

## 2. Per-Book Classification

### 2.1 Podręcznik Gry

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | Lore module → JournalEntry "Świat HbM - Wprowadzenie" | Narrative about the Awakening |
| I - Klasy (lata 1–5) | **SYSTEM** | Compendium: `classes` | Year-by-year unlocks |
| II - Tworzenie Postaci (rasy, dziedziny) | **SYSTEM** | Compendia: `races`, `disciplines` | Race traits, discipline picks |
| III - Atrybuty i Umiejętności | **SYSTEM** | Hard-coded in `actor-character.ts` + `constants.ts` | 4 attributes, 24 skills |
| IV - Talenty | **SYSTEM** | Compendium: `talents` | All baseline talents |
| V - Walka i Magia | **SYSTEM** | `logic/combat.ts`, `logic/spell-cast.ts` | Initiative, actions, tests |
| VI - Odpoczywanie i Leczenie | **SYSTEM** | New `logic/rest.ts` | Short/long rest mechanics |
| VII - Religia | **BOTH** | Stats → `disciplines/sacred`, deity entries; Lore → module | 7 deities |
| Aneks A - Stany Postaci | **SYSTEM** | `logic/conditions.ts` (already exists) | Status effects |
| Aneks B - Podstawowe Zaklęcia | **SYSTEM** | Compendium: `spells-general` | Superseded by Księga Magii - keep as reference variants |
| Aneks C - Podstawowe Eliksiry | **SYSTEM** | Compendium: `elixirs-baseline` | Eliksir Zdrowia + others |
| Aneks D - Cechy Broni | **SYSTEM** | `constants.ts` weapon traits | "Eksperymentalny" etc. |

**Verdict**: ~90% SYSTEM. Only the foreword and parts of Religia (deity narratives) move to MODULE.

---

### 2.2 Księga Magii

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry "Filozofia Magii" | Philosophical narrative |
| I - Dziedziny Magii | **SYSTEM** | Compendium: `disciplines` | Discipline definitions |
| II - Teoria Rzucania Zaklęć | **SYSTEM** | Hard-coded in `spell-cast.ts` + GM rules journal | Overcast, Symbolika, Variety |
| III - Warzenie Eliksirów | **SYSTEM** | Compendium: `elixirs` + new `logic/brewing.ts` | Tolerance, brewing checks |
| IV - Artefakty | **SYSTEM** | Compendium: `artifacts` | Stat blocks with upgrades |
| V - Lista Zaklęć | **SYSTEM** | Compendia: `spells-*` (multiple packs by discipline) | All ~85 spells |
| VI - Superzaklęcia | **SYSTEM** | Compendium: `spells-superspells` | 8 superspells |
| VII - Tworzenie Zaklęć | **SYSTEM** | GM journal + future macro tooling | Creation rules + tables |
| VIII - Dzika Magia Dzikich Wiedźm | **BOTH** | Sabaty/hierarchia → MODULE; chaos rules → SYSTEM | |

**Verdict**: ~95% SYSTEM. Only the foreword and witch coven lore are MODULE.

---

### 2.3 Arcanum Sanguinis

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry "Marginalia Magii Krwi" | Narrative about marginalization |
| I - Magia Krwi a Otchłań | **MODULE** | JournalEntry chapter | Worldview, Inquisition relations |
| II - Bóg Krwi / Robert Zaryn | **MODULE** | JournalEntries + Actor doc (Robert Zaryn) | NPC & deity lore |
| III - Teoria Magii Krwi | **SYSTEM** | New `logic/blood-magic.ts` + new actor field `attributes.blood` | Blood Points, Self-Harm, Life Steal |
| IV - Talenty | **SYSTEM** | Compendium: `talents-blood` | Szacunek do Życia → Rytualista / Pojedynkowicz trees |

**Verdict**: 50/50 split - clean separation between organisational/divine lore and Blood Magic mechanics.

---

### 2.4 Chwała Szkarłatnemu Kultowi

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry | Mysterious organisation tone |
| I - Pogłoski | **MODULE** | JournalEntry | In-world rumors |
| II - Struktura | **MODULE** | JournalEntry + Actor folder structure | Hierarchy: Rycerz→Pretor, Kultysta→Arcykapłan |
| III - Lokalizacje | **MODULE** | JournalEntries with embedded Scenes | Obeliski, Domena Szkarłatu, Twierdze |
| IV - Zaklęcia | **SYSTEM** | Compendium: `spells-crimson` | 5 + 1 superspell |
| V - Artefakty | **BOTH** | Stats → `artifacts-crimson`; History → MODULE | Cross-link via `@UUID` |

**Verdict**: 50/50.

---

### 2.5 Klątwa Otchłani

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry | Nature of the Abyss |
| I - Otchłań i Przebudzenie | **MODULE** | JournalEntry | History: pre-modern traces, 2023 |
| II - Potężniejsza Magia | **SYSTEM** | `logic/abyss-magic.ts` | Aspects vs Primal mechanics |
| III - Kara za nieudolność | **SYSTEM** | Roll table compendium: `roll-tables-abyss` | Failure penalty table |
| IV - Talenty | **SYSTEM** | Compendium: `talents-abyss` | Swobodny Przepływ, Dar Otchłani, Metamagia |
| V - Dary Otchłani | **SYSTEM** | Roll table d100 in `roll-tables-abyss` | Boons/banes |
| VI - Personifikacje Otchłani | **BOTH** | Stats → `actors-abyss`; Lore → MODULE | Nil/Mundus/Tempus |
| VII - Istoty Otchłani | **SYSTEM** | Compendium: `actors-abyss` | Mistrz Losu stat block |
| VIII - Choroby Psychiczne | **SYSTEM** | New `conditions-mental` set in `conditions.ts` | Insanity mechanics |
| IX - Zaklęcia | **SYSTEM** | Compendium: `spells-abyss` | 5 spells |
| X - Artefakty | **SYSTEM** | Compendium: `artifacts-abyss` | Miotacz Entropii |
| Aneks A - Kara Mistrza Losu | **SYSTEM** | Roll table | Penalty table |

**Verdict**: 60% SYSTEM / 40% MODULE.

---

### 2.6 Przewodnik Ludzkości po Magicznym Świecie

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry | |
| I - Teoria Jednego Wszechświata | **MODULE** | JournalEntry | Cosmology, philosophy |
| II - Planety i Frakcje | **MODULE** | JournalEntries + Scenes | Earth, Hiondirs, Xivell, Eldrakar, Malferian |
| III - Życie na Sol-3 | **MODULE** | JournalEntry | Magical education, Inquisition |
| IV - Cywilizacja Hiondirs-4 | **MODULE** | JournalEntry + Scene | |
| V - Cywilizacja Xivell | **MODULE** | JournalEntry | Royal lineage, Crimson Cult genesis |
| VI - Cywilizacja Eldrakar | **MODULE** | JournalEntry + Scene | |
| VII - Cywilizacja Malferian | **MODULE** | JournalEntry | Consortium houses, rituals |
| VIII - Federacja Sol-3 | **MODULE** | JournalEntry + Actor folder (Special Forces X, Gaja) | Syllia Orirel etc. |
| IX - Święta Inkwizycja | **MODULE** | JournalEntry + Actor folder | Genesis, structure, ops |
| X - Zaświaty | **MODULE** | JournalEntry | Hades, Niebo, Piekło hierarchies |
| Aneks A–D | **MODULE** | JournalEntries (in-world documents) | Federation reports, Narcyza interview, Inquisitor notes |

**Verdict**: ~98% MODULE. Race information is the only borderline - but actual race stats live in Podręcznik Gry, so this book stays purely lore.

---

### 2.7 Bestiariusz

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| I - Przeciwnicy | **SYSTEM** | Compendium: `actors-bestiary` | All hostile creature stat blocks |
| II - Inne Postacie (NPC) | **BOTH** | Stats → `actors-npcs`; personality → MODULE | Cross-link via `@UUID` |
| III - Talenty | **SYSTEM** | Compendium: `talents-special` | Wspomnienie Wspaniałego Świata, Pierwszy Patriarcha |

**Verdict**: ~80% SYSTEM. NPC personality blurbs and faction histories are the MODULE pieces.

---

### 2.8 Złoto Stal i Magia

| Chapter | Class | Destination | Notes |
|---|---|---|---|
| Wstęp | **MODULE** | JournalEntry | Post-Awakening economic revolution |
| I - Geopolityka | **MODULE** | JournalEntry | USA/Chiny/Rosja/Europa post-2023 |
| II - Ekonomia Magicznego Świata | **MODULE** | JournalEntry | Sectors, dwarf monopolies |
| III - Handel Międzyrasowy | **MODULE** | JournalEntry + Scene (trade routes) | |
| IV - Polityka na Ziemi | **MODULE** | JournalEntry | Dwarf lobby, Inquisition vs trade |
| V - Bank Krasnoludzki | **MODULE** | JournalEntry + Actor (org) | |
| VI - Waluty i Systemy Płatnicze | **BOTH** | Currency table → `roll-tables-economy`; cultural notes → MODULE | |
| VII - Czarny Rynek i Kontrabanda | **BOTH** | Risk/negotiation rules → SYSTEM; catalog → MODULE | |
| VIII - Krasnoludy | **BOTH** | Race traits → existing `races` compendium; culture → MODULE | |
| IX - Mechanika Handlu dla PG | **SYSTEM** | New `logic/trade.ts` + journal | Founding company, transactions, smuggling |
| Aneks A - Nowe Talenty | **SYSTEM** | Compendium: `talents-trade` | Zmysł Kamienia, Kupiecka Intuicja, Złoty Nos |
| Aneks B - Przedmioty i Towary | **SYSTEM** | Compendium: `gear-trade` + price tables | Dwarven items, price lists |

**Verdict**: 40% SYSTEM / 60% MODULE.

---

## 3. Aggregate Summary

| Book | SYSTEM % | MODULE % | Primary destination |
|---|---:|---:|---|
| Podręcznik Gry | ~90 | ~10 | System (core) |
| Księga Magii | ~95 | ~5 | System (core) |
| Arcanum Sanguinis | ~50 | ~50 | Both |
| Chwała Szkarłatnemu Kultowi | ~50 | ~50 | Both |
| Klątwa Otchłani | ~60 | ~40 | Both |
| Przewodnik Ludzkości | ~2 | ~98 | Module |
| Bestiariusz | ~80 | ~20 | System |
| Złoto Stal i Magia | ~40 | ~60 | Both |

---

## 4. Proposed Package Architecture

```
hbm-rpg-v3/                       (Foundry SYSTEM package)
├── system.json
├── src/                          (TypeScript)
│   ├── data/                     (TypeDataModel for actors/items)
│   ├── logic/                    (combat, spell-cast, brewing, blood-magic, abyss-magic, trade, rest, conditions)
│   ├── sheets/                   (character, npc, item sheets)
│   └── dice/                     (TS roll system)
├── packs/                        (LevelDB compendia - see §5)
└── data/                         (YAML source for pack generation)

hbm-rpg-v3-lore/                  (Foundry MODULE package - separate repo / sub-folder)
├── module.json                   (depends on hbm-rpg-v3 system)
├── packs/                        (JournalEntry packs - see §6)
├── data/                         (Markdown source for journal generation)
└── assets/                       (images, maps, scene backgrounds)
```

### Why split?

1. **System is mandatory**, module is optional → groups running custom settings can use the system without the canonical lore.
2. **Update cadence differs**: rules patches (system) vs. lore expansions (module).
3. **Distribution rights**: lore content may have separate licensing considerations.
4. **Clean dependency graph**: module can `@UUID` link into system compendia (talents, spells, actors), but system never depends on module.

---

## 5. Compendium Pack Plan (System)

### 5.1 Items

| Pack id | Item type | Source | Est. count |
|---|---|---|---|
| `hbm-rpg-v3.spells-general` | spell | Księga Magii I-V | 10 |
| `hbm-rpg-v3.spells-elements` | spell | Księga Magii V | 20 |
| `hbm-rpg-v3.spells-sacred` | spell | Księga Magii V | 35 |
| `hbm-rpg-v3.spells-academic` | spell | Transmutacja, Iluzja, Nekromancja | 15 |
| `hbm-rpg-v3.spells-superspells` | spell | Księga Magii VI | 8 |
| `hbm-rpg-v3.spells-crimson` | spell | Chwała Szkarłatnemu Kultowi | 6 |
| `hbm-rpg-v3.spells-abyss` | spell | Klątwa Otchłani | 5 |
| `hbm-rpg-v3.spells-blood` | spell | Arcanum Sanguinis | TBD |
| `hbm-rpg-v3.talents-core` | talent | Podręcznik Gry IV | TBD |
| `hbm-rpg-v3.talents-blood` | talent | Arcanum Sanguinis IV | TBD |
| `hbm-rpg-v3.talents-abyss` | talent | Klątwa Otchłani IV | TBD |
| `hbm-rpg-v3.talents-trade` | talent | Złoto Stal i Magia A | TBD |
| `hbm-rpg-v3.talents-special` | talent | Bestiariusz III | TBD |
| `hbm-rpg-v3.disciplines` | discipline | Księga Magii I | ~15 |
| `hbm-rpg-v3.classes` | class | Podręcznik Gry I | 5 |
| `hbm-rpg-v3.races` | race | Podręcznik Gry II + Złoto Stal i Magia VIII | 8 |
| `hbm-rpg-v3.gear-baseline` | gear | Podręcznik Gry | TBD |
| `hbm-rpg-v3.gear-trade` | gear | Złoto Stal i Magia B | TBD |
| `hbm-rpg-v3.elixirs-baseline` | gear | Podręcznik Gry C | TBD |
| `hbm-rpg-v3.elixirs` | gear | Księga Magii III | TBD |
| `hbm-rpg-v3.artifacts` | gear | Księga Magii IV | TBD |
| `hbm-rpg-v3.artifacts-crimson` | gear | Chwała Szkarłatnemu Kultowi V | TBD |
| `hbm-rpg-v3.artifacts-abyss` | gear | Klątwa Otchłani X | TBD |

### 5.2 Actors

| Pack id | Actor type | Source | Est. count |
|---|---|---|---|
| `hbm-rpg-v3.actors-bestiary` | npc | Bestiariusz I | TBD |
| `hbm-rpg-v3.actors-npcs` | npc | Bestiariusz II | TBD |
| `hbm-rpg-v3.actors-abyss` | npc | Klątwa Otchłani VI–VII | TBD |

### 5.3 Roll tables

| Pack id | Source |
|---|---|
| `hbm-rpg-v3.roll-tables-abyss` | Klątwa Otchłani III, V, Aneks A |
| `hbm-rpg-v3.roll-tables-economy` | Złoto Stal i Magia VI–VII |

---

## 6. Module Pack Plan (Lore)

### 6.1 JournalEntry packs

| Pack id | Source |
|---|---|
| `hbm-rpg-v3-lore.world-overview` | Podręcznik Gry Wstęp + Przewodnik I |
| `hbm-rpg-v3-lore.deities` | Podręcznik Gry VII (lore parts) + Klątwa Otchłani VI |
| `hbm-rpg-v3-lore.universe` | Przewodnik II–VII (planets & civilizations) |
| `hbm-rpg-v3-lore.sol3-society` | Przewodnik III, VIII, IX |
| `hbm-rpg-v3-lore.afterlife` | Przewodnik X |
| `hbm-rpg-v3-lore.documents` | Przewodnik Aneksy A–D |
| `hbm-rpg-v3-lore.blood-magic-history` | Arcanum Sanguinis Wstęp + I + II |
| `hbm-rpg-v3-lore.crimson-cult` | Chwała Szkarłatnemu Kultowi Wstęp, I, II, III, V (history) |
| `hbm-rpg-v3-lore.abyss` | Klątwa Otchłani Wstęp, I, VI (lore) |
| `hbm-rpg-v3-lore.witch-covens` | Księga Magii VIII (lore parts) |
| `hbm-rpg-v3-lore.economy` | Złoto Stal i Magia I–VIII (narrative parts) |
| `hbm-rpg-v3-lore.npc-personalities` | Bestiariusz II (personality parts) |

### 6.2 Scene packs (asset-bundled)

| Pack id | Source |
|---|---|
| `hbm-rpg-v3-lore.scenes-locations` | Locations folder + Chwała III + Przewodnik IV–VII |

### 6.3 Macro packs (optional)

- Quick-roll macros for common GM rolls
- Lore lookup macros (search across journal compendia)

---

## 7. Cross-References & Dependencies

### 7.1 Dependency direction

```
hbm-rpg-v3-lore  ──depends-on──▶  hbm-rpg-v3  (system)
                                       │
                                       └─▶ no upward dependency
```

`module.json` declaration:
```json
{
  "id": "hbm-rpg-v3-lore",
  "title": "HbM RPG v3 - Lore Companion",
  "system": "hbm-rpg-v3",
  "compatibility": { "minimum": "13", "verified": "13" },
  "relationships": {
    "systems": [{ "id": "hbm-rpg-v3", "type": "system", "compatibility": { "minimum": "0.3.0" } }]
  }
}
```

### 7.2 Cross-link patterns

- Lore JournalEntry references SYSTEM compendium item:
  `@UUID[Compendium.hbm-rpg-v3.spells-crimson.{id}]{Szkarłatny Pocisk}`
- SYSTEM item description references lore JournalEntry:
  `@UUID[Compendium.hbm-rpg-v3-lore.crimson-cult.JournalEntry.{id}.JournalEntryPage.{pageId}]{Szkarłatny Kult}`
- NPC actor (SYSTEM) → personality journal (MODULE) via biography `@UUID`

### 7.3 Stable IDs

All compendium documents must have **stable IDs** (slug-derived) to prevent cross-link breakage on rebuilds:
- Spells: `spell-{slug}` (e.g. `spell-magic-missile`)
- Talents: `talent-{slug}`
- NPCs: `npc-{slug}`
- Lore: `lore-{book}-{chapter}-{slug}`

---

## 8. Migration & Build Pipeline

### 8.1 Source-of-truth strategy

Each domain has a **machine-readable source file** under `.src/foundry-system/data/` (system) or `.src/foundry-lore/data/` (module). The Foundry pack files (`packs/*.db` or LevelDB folders) are **build artifacts**, not source.

| Source format | Domain |
|---|---|
| YAML | spells, talents, gear, races, classes, disciplines |
| YAML + Markdown | NPCs / actors (YAML stat block + Markdown description) |
| Markdown | JournalEntry pages |
| JSON | RollTables |

### 8.2 Build scripts

| Script | Output |
|---|---|
| `scripts/build-spell-packs.ts` | All `spells-*` LevelDB packs |
| `scripts/build-actor-packs.ts` | All `actors-*` LevelDB packs |
| `scripts/build-journal-packs.ts` | All `lore.*` packs (in module repo) |
| `scripts/build-roll-tables.ts` | All `roll-tables-*` packs |
| `scripts/build-all.ts` | Wraps all above; called by `bun run package` |

### 8.3 Migration scripts

When `SpellData` / `ActorData` schemas change, write a `src/migrations/{version}.ts` that runs on world load (Foundry `Hooks.once('ready')`).

### 8.4 Validation

- Zod (or Foundry's own DataModel) schema validation in build scripts → fail build on invalid spell/actor entry
- Cross-reference linter: ensures every `@UUID[...]` in lore points to a real system compendium entry

---

## Appendix A - Implementation Order

1. **v0.2.0 - System foundation**
   - Expand `SpellData` schema (per `foundry-spell-reference.md` §5)
   - Build `spells-*` packs from YAML sources
   - Migration 0.1 → 0.2 for existing world spells
2. **v0.3.0 - Compendium completeness**
   - All talent / discipline / race / class packs built
   - Bestiariusz actors imported
3. **v0.4.0 - Mechanics expansion**
   - `logic/blood-magic.ts`, `logic/abyss-magic.ts`, `logic/brewing.ts`, `logic/rest.ts`, `logic/trade.ts`
   - Status conditions expanded (mental illnesses)
4. **v0.5.0 - Lore module 1.0**
   - Companion module `hbm-rpg-v3-lore` first release
   - Przewodnik Ludzkości fully ported
   - Cross-links established
5. **v1.0.0 - Polish & full content**
   - All 8 books represented
   - English localization complete
   - Compendium browser metadata, icons, art

---

## Appendix B - Outstanding Questions

1. **Module repo location**: separate Git repo or sub-folder under `.src/`? Recommendation: separate folder `.src/foundry-lore/` for unified editing, separate `module.json` package output.
2. **Asset licensing**: scene images, NPC portraits - which assets can ship in the module vs. be GM-supplied?
3. **Polish-only vs bilingual**: should lore JournalEntries ship Polish-only initially, with English translation pack later?
4. **Adventure content** (`adventures/` folder): adventure scenarios are neither system nor module content - recommend a third package `hbm-rpg-v3-adventures` per published adventure.
5. **Foundry Module Marketplace listing**: needs cover art, description, screenshots before module submission.
