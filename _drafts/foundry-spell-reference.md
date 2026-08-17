# FoundryVTT Spell Reference - HbM RPG v3

> **Status**: Draft / Planning Document
> **Audience**: Developer (next iteration of `hbm-rpg-v3` Foundry system)
> **Purpose**: Single source of truth for all spells across all books + gap analysis for `SpellData` model and casting logic.

---

## Table of Contents

1. [Schools & Disciplines Inventory](#1-schools--disciplines-inventory)
2. [Witch Magic Symbols Inventory](#2-witch-magic-symbols-inventory)
3. [Sacred Magic Deities Inventory](#3-sacred-magic-deities-inventory)
4. [Unified Spell Catalog](#4-unified-spell-catalog)
5. [SpellData Model - Gap Analysis](#5-spelldata-model--gap-analysis)
6. [Casting Logic - Gap Analysis](#6-casting-logic--gap-analysis)
7. [Constants Module - Required Additions](#7-constants-module--required-additions)
8. [Character Sheet Spell Tab - Enhancement Spec](#8-character-sheet-spell-tab--enhancement-spec)
9. [Spell Item Sheet - Enhancement Spec](#9-spell-item-sheet--enhancement-spec)
10. [Compendium Pack Plan](#10-compendium-pack-plan)
11. [Implementation Phases](#11-implementation-phases)

---

## 1. Schools & Disciplines Inventory

### 1.1 Academic disciplines (Eastern European School of Magic)

| Discipline ID (en) | Polish name | Color | Notes |
|---|---|---|---|
| `transmutation` | Alchemia Transmutacji | Brązowy + fioletowy | Subset of legacy Taumaturgia |
| `brewing` | Warzenie Eliksirów | Brązowy + zielony | Subset of legacy Taumaturgia |
| `botany` | Botanika | Zielony | - |
| `elementsAir` | Magia Żywiołów - Powietrze | Żółty | - |
| `elementsWater` | Magia Żywiołów - Woda | Niebieski | - |
| `elementsFire` | Magia Żywiołów - Ogień | Pomarańczowy | - |
| `elementsEarth` | Magia Żywiołów - Ziemia | Jasnozielony | - |
| `artifacts` | Rzemiosło Artefaktów | Fioletowy | Subset of legacy Taumaturgia |
| `golemancy` | Golemancja | - | Subset of legacy Taumaturgia, no spells in books |
| `runes` | Magia Runiczna | - | Subset of legacy Taumaturgia, no spells in books |
| `sources` | Źródła Mocy | Tęcza | - |
| `illusion` | Magia Iluzji | Bladoniebieski | - |
| `sacred` | Magia Sakralna | Biały (egzorcyści: czarny) | Sub-divided by deity |
| `witch` | Wiedźmia Magia | - | Symbol-based casting |
| `necromancy` | Nekromancja | (kanon) | - |

### 1.2 Forbidden / extra-academic disciplines

| Discipline ID (en) | Polish name | Source book |
|---|---|---|
| `blood` | Magia Krwi | *Arcanum Sanguinis* |
| `crimson` | Magia Szkarłatu | *Chwała Szkarłatnemu Kultowi* |
| `abyssAspects` | Magia Otchłani - Magia Aspektów | *Klątwa Otchłani* |
| `abyssPrimal` | Magia Otchłani - Pierwotna Magia | *Klątwa Otchłani* |
| `wildWitch` | Dzika Wiedźmia Magia | *Klątwa Otchłani* / *Księga Magii* |

---

## 2. Witch Magic Symbols Inventory

> **Note**: List is **extensible** - more symbols may be added in future content. Stored as `string[]` in `constants.ts`, used for autocomplete only; spell data accepts arbitrary strings.

| Symbol | Domain meaning |
|---|---|
| `Potentia` | Power / damage |
| `Tutamen` | Protection / shield |
| `Lux` | Light |
| `Motus` | Movement |
| `Iter` | Travel / path |
| `Vacuos` | Void / displacement |
| `Vitium` | Decay / corruption |
| `Praecantatio` | Magic itself |
| `Aer` | Air |
| `Aqua` | Water |
| `Gelum` | Cold / ice |
| `Ignis` | Fire |
| `Terra` | Earth |
| `Cognitio` | Knowledge / mind |
| `Alienis` | Alien / foreign |
| `Illusio` | Illusion |
| `Somnium` | Dream |
| `Tenebrae` | Shadow / darkness |
| `Auram` | Aura |
| `Vinculum` | Binding |
| `Telum` | Weapon / projectile |
| `Sensus` | Sense / perception |
| `Perditio` | Destruction |
| `Perfodio` | Piercing / digging |
| `Sano` | Healing |
| `Volatus` | Flight |
| `Tempestas` | Storm |

---

## 3. Sacred Magic Deities Inventory

| Deity ID | Polish label | Notes |
|---|---|---|
| `common` | Modlitwy Powszechne | Available to all sacred casters |
| `jahwe` | Bóg-Jahwe-Jedyny | Some spells race-gated (Anioł, Człowiek) |
| `zeus` | Zeus-Jowisz | Storm domain |
| `demeter` | Demeter-Ceres | Agriculture / nature |
| `artemis` | Artemida-Diana | Hunt / beasts |
| `hekate` | Hekate | **Hybrid sacred/witch** - symbols + zeal |
| `aphrodite` | Afrodyta-Wenus | Charm / persuasion |
| `eros` | Amor-Eros | Bonds / desire |

> **Hekate is special**: her spells have witch-magic symbols and complexity, allowing them to be cast either as sacred (zeal) or witch (mana + symbols) prayers.

---

## 4. Unified Spell Catalog

> Format per spell:
> - **Name** (Polish), `id` (slug for compendium)
> - `school` / `discipline` / `deity` / `castingMode`
> - `circle` (T:Y) → `difficulty.threshold:difficulty.successes`
> - `manaCost` / `bloodCost` (where applicable)
> - `castingTime` / `range` / `areaOfEffect` / `targets` / `duration`
> - `components` (verbal / somatic / material / symbols)
> - `requirements` (race / talent / discipline mastery)
> - `flags` (`isSuperspell`, `nonCombatOnly`, `requiresGroupCast`)
> - `damageBase` (formula reference)
> - `statusEffects[]` (conditions applied)
> - `overcastOptions[]`
> - `sourceBook`

### 4.1 Magia Ogólna (Księga Magii)

| # | id | Name | T:Y | Mana | Range | Duration | Symbols | Damage | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `magic-missile` | Magiczny Pocisk | 4:1 | 1 | 15 m | inst. | `Potentia` | `½ magicalAbilities` | - | Overcast: +1 dmg |
| 2 | `magic-shield` | Magiczna Tarcza | 5:1 | 2 | 5 m | 2 r | `Tutamen` | - | - | HP = ½ MA + 1; OC: +1d2 HP / +1 r |
| 3 | `gleam` | Poblask | 3:1 | 1 | self | 1 h | `Lux` | - | - | Item glows; OC: +1 h |
| 4 | `telekinesis` | Telekineza | 4:1 | 1 | 20 m | 10 r | `Motus` | - | - | ≤1 kg; OC: +10 r / +1 kg |
| 5 | `blink` | Przeskok | 5:2 | 3 | 20 m | inst. | `Iter, Praecantatio` | - | - | No AoO; OC: +5 m |
| 6 | `teleport` | Teleportacja | 6:3 | 5 | known location | inst. (cast 10 min) | `Iter, Praecantatio, Vacuos` | - | - | OC: +1 person (3 mana) |
| 7 | `ether-pierce` | Przebicie Eteru | 5:3 | 4 | 10 m | inst. | `Tutamen, Vitium` | `½ MA, ignores armor` | - | 2 dmg = 1 Rune Shield; OC: +1d2 dmg |
| 8 | `energy-wave` | Fala Energii | 5:2 | 4 | 10 m | inst. | `Praecantatio, Potentia` | `½ MA AoE` | Oszołomiony (Reflex save) | Rect 3×8 m; OC: +1d3 dmg / +2 Y |
| 9 | `truth-glimpse` | Przebłysk Prawdy | 4:1 | 1 | touch | 1 r | `Cognitio` | - | - | +1 die lie/behavior; OC: +1 r / +1 die |
| 10 | `quick-thought` | Szybka Myśl | 5:1 | 1 | self | 1 r | `Cognitio` | - | - | +1 init, +1 die; OC stacking |

### 4.2 Magia Żywiołów - Powietrze

| # | id | Name | T:Y | Mana | Range | Duration | Symbols | Damage | Status |
|---|---|---|---|---|---|---|---|---|---|
| 11 | `flight` | Latanie | 5:2 | 3 | self | 10 r | `Volatus` | - | - |
| 12 | `air-wave` | Powietrzna Fala | 5:1 | 3 | 10 m | inst. | `Aer, Potentia` | `½ MA AoE` | Powalony (Strength save) |
| 13 | `danger-sense` | Wyczucie Zagrożenia | 6:1 | 4 | self | 2 r | `Aer, Sensus` | - | - |
| 14 | `accuracy` | Celność | 6:1 | 2 | self | 2 r | `Sensus, Telum` | - | - |
| 15 | `wind-swift` | Szybki jak Wiatr | 5:1 | 1 | self | 1 r | `Motus` | - | Immune Powalony |

### 4.3 Magia Żywiołów - Woda

| # | id | Name | T:Y | Mana | Range | Duration | Symbols | Damage | Status |
|---|---|---|---|---|---|---|---|---|---|
| 16 | `water-create` | Tworzenie i Kontrolowanie Wody | 5:1 | 1 | 5 m | 10 min | `Aqua` | - | - |
| 17 | `ice-floor` | Lodowa Podłoga | 6:1 | 3 | 10 m | 2 r | `Gelum, Vinculum` | - | Powalony (Athletics save) |
| 18 | `solace` | Ukojenie | 5:1 | 2 | self | 1 r | `Sano` | `heal ½ MA` | - |
| 19 | `hailstorm` | Gradobicie | 5:4 | 5 | 10 m | 2 r | `Gelum, Praecantatio, Tempestas` | `MA dmg` | Trudny Teren; Reflex save |
| 20 | `mystic-fog` | Mistyczna Mgła | 5:3 | 4 | self | 1 r | `Aqua, Tenebrae` | - | Oślepiony (enemies) |

### 4.4 Magia Żywiołów - Ogień

| # | id | Name | T:Y | Mana | Range | Duration | Symbols | Damage | Status |
|---|---|---|---|---|---|---|---|---|---|
| 21 | `ignition` | Podpalenie | 5:2 | 3 | 15 m | 1 r | `Ignis, Vinculum` | `3 + 3/turn` | Podpalony |
| 22 | `kindle` | Wzniecanie Ognia | 3:1 | 1 | touch | inst. | `Ignis` | - | - |
| 23 | `fire-cloak` | Ognista Powłoka | 5:2 | 4 | self | 3 r | `Ignis, Telum` | weapon +2 magical | - |
| 24 | `fireball` | Kula Ognia | 6:1 | 2 | 15 m | inst. | `Ignis, Potentia` | `MA` | Podpalony 3 r (Reflex save) |
| 25 | `burning-skin` | Gorejąca Skóra | 4:3 | 5 | self | 1 r | `Ignis, Tutamen` | `½ MA reactive` | - |

### 4.5 Magia Żywiołów - Ziemia

| # | id | Name | T:Y | Mana | Range | Duration | Symbols | Damage | Status |
|---|---|---|---|---|---|---|---|---|---|
| 26 | `stone-shield` | Skalista Tarcza | 5:1 | 2 | 5 m | 1 r | `Terra` | wall HP = MA | blocks LoS |
| 27 | `quicksand` | Ruchome Piaski | 5:3 | 3 | 10 m | 2 r | `Terra, Perfodio, Vinculum` | - | half movement |
| 28 | `earthquake` | Trzęsienie Ziemi | 4:6 | 5 | 10 m | 3 r | `Terra, Potentia, Perditio` | - | Unieruchomiony+Powalony, Nieprzytomny on 3 fails |
| 29 | `gravel-armor` | Żwirowa Zbroja | 4:1 | 2 | self | 2 r | `Tutamen, Terra` | - | +1 armor, –½ speed |
| 30 | `stone-trap` | Skalista Pułapka | 5:4 | 4 | 15 m | 1 min | `Terra, Vinculum, Telum` | `MA` (trigger) | - |

### 4.6 Magia Sakralna - Modlitwy Powszechne

| # | id | Name | T:Y | Mana | Range | Duration | Damage | Notes |
|---|---|---|---|---|---|---|---|---|
| 31 | `sanctify` | Uświęcenie | 4:1 | 2 | self | 1 r | weapon → magical | - |
| 32 | `holy-steel` | Święta Stal | 5:1 | 3 | self | 1 r | weapon +1 magical | –1 die Reflex on hit |
| 33 | `healing-touch` | Leczący Dotyk | 3:1 | 1 | touch | inst. | `heal MA or Devotion` | - |
| 34 | `protection-prayer` | Modlitwa o Opiekę | 5:1 | 1 | self | 1 r | - | +1 die vs spells/curses |
| 35 | `divine-justice` | Boska Sprawiedliwość | 6:1 | 2 | 10 m | inst. | `½ MA/Dev (+1d6 vs heretic)` | - |

### 4.7 Magia Sakralna - Bóg-Jahwe-Jedyny

| # | id | Name | T:Y | Mana | Race req | Damage | Notes |
|---|---|---|---|---|---|---|---|
| 36 | `david-blade` | Ostrze Dawida | 5:1 | 3 | **Anioł** | weapon S+1 magical slash | - |
| 37 | `last-judgement` | Sąd Ostateczny | 6:3 | 6 | - | `3× MA/Dev` | Instant death heretic/demon/undead if Devotion ≥ Soul |
| 38 | `solomon-wisdom` | Mądrość Salomona | 5:1 | 2 | - | - | +1 die all Mind tests, 1 h |
| 39 | `fanatic-sacrifice` | Fanatyczne Poświęcenie | 6:2 | 5 | **Człowiek** | reciprocal ×2 | Przerażenie aura |
| 40 | `cure-disease` | Uzdrowienie Chorych | 5:2 | 4 | - | - | Removes 1 disease/poison |

### 4.8 Magia Sakralna - Zeus-Jowisz

| # | id | Name | T:Y | Mana | Damage | Status |
|---|---|---|---|---|---|---|
| 41 | `thunderbolt` | Grom z Nieba | 5:4 | 4 | `2× MA/Dev AoE` | Ogłuszony |
| 42 | `chain-lightning` | Błyskawice Łańcuchowe | 5:3 | 3 | `MA/Dev per chain` | - |
| 43 | `aegis` | Egida | 6:1 | 2 | - | +1 armor, attacks –1 step |
| 44 | `static-discharge` | Wyładowanie Elektrostatyczne | 4:4 | 4 | `½ MA/Dev` | Przewrócony |
| 45 | `king-presence` | Obecność Króla Bogów | 6:3 | 6 | - | Authority aura |

### 4.9 Magia Sakralna - Demeter-Ceres

| # | id | Name | T:Y | Mana | Notes | nonCombatOnly |
|---|---|---|---|---|---|---|
| 46 | `harvest-blessing` | Błogosławieństwo Zasiewów | 6:2 | 3 | +20% yields | ✓ |
| 47 | `earth-power` | Moc Ziemi | 5:2 | 4 | regen on natural soil | - |
| 48 | `accelerated-harvest` | Przyspieszone Żniwa | 6:4 | 5 | rzucanie 1 h | ✓ |
| 49 | `season-cycle` | Cykl Pór Roku | 6:6 | 6 | microclimate | - |
| 50 | `mother-wrath` | Gniew Matki Ziemi | 4:4 | 4 | `½ MA/Dev` per move | - |

### 4.10 Magia Sakralna - Artemida-Diana

| # | id | Name | T:Y | Mana | Damage | Notes |
|---|---|---|---|---|---|---|
| 51 | `bridge` | Pomost | 6:1 | 4 | - | partial beast morph |
| 52 | `awakening` | Przebudzenie | 5:3 | 5 | - | full beast morph |
| 53 | `insect-swarm` | Chmara Insektów | 4:5 | 4 | - | –1 armor, –50% speed |
| 54 | `divine-aim` | Boska Celność | 4:3 | 2 | - | +3 dice ranged |
| 55 | `divine-spear` | Boska Włócznia | 5:2 | 3 | `MA/Dev ignore armor` | +1d3/extra success |

### 4.11 Magia Sakralna - Hekate (hybrid sacred/witch)

> **Special**: cast as either sacred (zeal cost) or witch (mana + symbols).

| # | id | Name | T:Y | Mana | Symbols | Notes |
|---|---|---|---|---|---|---|
| 56 | `magic-amplify` | Wzmocnienie Magii | 4:3 | 4 | `Praecantatio, Auram` | +4 dice Magical Abilities |
| 57 | `mana-theft` | Kradzież Many | 6:3 | 5 | `Praecantatio, Telum, Auram` | +2 mana / +1 max cost |
| 58 | `magic-acceleration` | Magiczne Przyspieszenie | 5:2 | 3 | `Praecantatio, Potentia` | +1 Zapał |
| 59 | `hekate-curse` | Klątwa Hekate | 6:2 | 6 | `Praecantatio, Vitium, Vinculum` | –1 die MA + Przerażony |
| 60 | `arcane-knowledge` | Tajemne Poznanie | 5:1 | 2 | `Cognitio` | +1 die magic/theology lore |

### 4.12 Magia Sakralna - Afrodyta-Wenus

| # | id | Name | T:Y | Mana | Notes | nonCombatOnly |
|---|---|---|---|---|---|---|
| 61 | `innocence-charm` | Urok Niewinności | 5:1 | 2 | +2 Y to attack | - |
| 62 | `heart-bond` | Więź Serc | 6:3 | 4 | empathic link | ✓ |
| 63 | `passion-flame` | Płomień Namiętności | 6:1 | 5 | +2 die empathy/persuasion | - |
| 64 | `goddess-beauty` | Piękno Bogini | 5:5 | 6 | +3 die persuasion | - |
| 65 | `harmony-ray` | Promień Harmonii | 5:4 | 5 | suppress conflict | - |

### 4.13 Magia Sakralna - Amor-Eros

| # | id | Name | T:Y | Mana | Status | nonCombatOnly |
|---|---|---|---|---|---|---|
| 66 | `cupid-arrow` | Strzała Kupidyna | 4:3 | 3 | Zauroczony | - |
| 67 | `heart-longing` | Tęsknota Serca | 5:1 | 2 | obsession | ✓ |
| 68 | `senses-desire` | Pożądanie Zmysłów | 3:5 | 5 | +5 die romantic | - |
| 69 | `destiny-thread` | Nić Przeznaczenia | (none) | 6 | bond (Soul save) | ✓ |
| 70 | `desire-arrow` | Strzała Pożądania | 5:2 | 4 | Zauroczony if dmg > Soul | - |

### 4.14 Magia Alchemii Transmutacji

| # | id | Name | T:Y | Mana | Notes |
|---|---|---|---|---|---|
| 71 | `fools-gold` | Złoto Głupców | 6:2 | 3 | item appears as gold |
| 72 | `detect-changes` | Wykrycie Zmian | `5:S` | 1 | GM-set difficulty; **no overcast** |
| 73 | `magic-resistance` | Magiczna Odporność | 5:1 | 2 | immunity to chosen status |
| 74 | `lead-transmute` | Przemiana w Ołów | 5:2 | 3 | –2 dice melee/ranged AoE |
| 75 | `magnetism` | Magnetyzm | 5:1 | 5 | metal items expelled |

### 4.15 Magia Iluzji

| # | id | Name | T:Y | Mana | Symbols | Notes |
|---|---|---|---|---|---|---|
| 76 | `invisibility` | Niewidzialność | 5:2 | 5 | `Aer, Tenebrae` | - |
| 77 | `mirror-image` | Zwierciadlany Wizerunek | 5:1 | 3 | `Sensus, Vitium, Illusio` | duplicate ≤20 m |
| 78 | `mind-maze` | Labirynt Umysłu | 4:2 | 2 | `Cognitio, Alienis` | concentration check or lose action |
| 79 | `magic-shackles` | Magiczne Kajdany | 4:2 | 3 | `Vinculum, Cognitio` | Unieruchomiony + no casting |
| 80 | `dream-veil` | Woal Snów | 6:3 | 4 | `Somnium, Illusio, Cognitio` | `½ MA ignore armor` + Przerażony |

### 4.16 Nekromancja

| # | id | Name | T:Y | Mana | Notes |
|---|---|---|---|---|---|
| 81 | `ethereal-guide` | Eteryczny Przewodnik | 6:1 | 2 | summons mindless ghost |
| 82 | `negation` | Negacja | 5:3 | 5 | anti-magic fog AoE |
| 83 | `animate-skeleton` | Ożywienie Szkieletu | 6:2 | 3 | mindless skeleton |
| 84 | `dispersal` | Rozsypanie | 5:1 | 4 | `2× MA`, destroy weak undead |
| 85 | `speak-with-dead` | Rozmawianie ze Zmarłymi | 5:1 | 3 | 1 question / soul |

### 4.17 Superzaklęcia (Księga Magii VI)

> **All flagged**: `isSuperspell: true`, requires Mistrzostwo talent.

| # | id | Name | T:Y | Mana | Mastery | Cast time | Group? | Notes |
|---|---|---|---|---|---|---|---|---|
| 86 | `super-destruction` | Destrukcja | 6:20 | 20 | any | 1 h | - | 50 m blast, 5 yr taint |
| 87 | `super-disintegration` | Prawdziwa Dezintegracja | 6:15 | 15 | any | 10 min | - | irreversible |
| 88 | `super-doom` | Zagłada | 6:30 | 30 | any | 3 h | **≥3 mages** | co-casters die |
| 89 | `super-magical-plague` | Magiczna Plaga | 6:25 | 25 | botany/witch/brewing/abyss | 30 min | - | 2d3 years |
| 90 | `super-aegis` | Aegis | 6:30 | 30 | any | 1 h | - | 24 h dome |
| 91 | `super-landscape` | Transmutacja Krajobrazu | 6:20 | 20 | transmutation/earth/botany | 30 min | - | 5 km² permanent |
| 92 | `super-portal` | Bramy Wymiarów | 6:25 | 25 | botany/witch/brewing/abyss | 2 h | - | 2d6 years |
| 93 | `super-reanimation` | Reanimacja | 6:15 | 15 | sacred | 3 h | - | participants age 1d6 |

### 4.18 Magia Szkarłatu (Chwała Szkarłatnemu Kultowi)

| # | id | Name | T:Y | Mana | Range | Damage | Notes |
|---|---|---|---|---|---|---|---|
| C1 | `crimson-bolt` | Szkarłatny Pocisk | 6:1 | 1 | 15 m | `MA, ignore armor` | - |
| C2 | `crimson-flames` | Szkarłatne Płomienie | 6:1 | 4 | 10 m | shield-eater | - |
| C3 | `crimson-justice` | Szkarłatna Sprawiedliwość | 5:3 | 5 | 10 m | `2× MA` + AoE | Ogłuszony+Oślepiony |
| C4 | `crimson-curse` | Klątwa Szkarłatu | 5:2 | 4 | 10 m | reactive | Nieprzytomny on cast |
| C5 | `crimson-dagger` | Szkarłatny Sztylet | 5:2 | 3 | self | weapon +2 magical | **trigger**: free spell after kill (1/round) |
| CS | `crimson-requiem` | Requiem | 6:25 | 25 | 100 m | `3d6 ignore all` | Superspell; 7 days "crimson dreams" |

### 4.19 Magia Otchłani (Klątwa Otchłani)

| # | id | Name | T:Y | Mana | Range | Damage | Notes |
|---|---|---|---|---|---|---|---|
| A1 | `primal-orb` | Pierwotna Kula | 5:2 | 2 | 15 m | `MA + 1d6` | chaotic targeting |
| A2 | `mysterious-stream` | Tajemniczy Strumień | 6:2 | 3 | 10 m | `MA` | +1d3 Insanity |
| A3 | `forbidden-ward` | Zakazana Osłona | 5:3 | 4 | self | reflect | reactive, 1 use |
| A4 | `neutralization` | Neutralizacja | 6:3 | 5 | 20 m | `Mind/turn` | blocks casting |
| A5 | `summon-abyss` | Przywołanie Istoty z Otchłani | `6:n` | 6 | 5 m | - | **variable Y per creature**: 2/4/6/10 |

### 4.20 Magia Krwi (Arcanum Sanguinis) - TBD

> **Status**: Per user clarification, Magia Krwi will get its own spell list in a future content release. Reserve `castingMode: 'blood'` and `bloodCost: number` field on `SpellData`. No spells to catalog yet.

---

## 5. SpellData Model - Gap Analysis

> Reference: [.src/foundry-system/src/data/item-spell.ts](../.src/foundry-system/src/data/item-spell.ts)

### 5.1 Current schema (v0.1.2)

```ts
{
  circle, school, discipline,
  castingMode: 'standard' | 'sacred' | 'witch',
  difficulty: { threshold, successes },
  components: { verbal, somatic, material },
  castingTime, range, targets, duration,
  manaCost, overcasting,
  complexityLevel, // witch only
  description, higherCircles
}
```

### 5.2 Missing fields → required additions

| New field | Type | Default | Why |
|---|---|---|---|
| `deity` | `string` | `''` | Sacred spells gated by deity (8 entries; `''` = common) |
| `castingMode` (extend) | add `'blood'` to enum | - | Magia Krwi gets its own mode |
| `bloodCost` | `number` | `0` | Magia Krwi resource cost |
| `components.symbols` | `string[]` | `[]` | Witch / Hekate spell symbol list (replaces only-counting `complexityLevel`) |
| `requirements.race` | `string[]` | `[]` | e.g. `['angel']`, `['human']` |
| `requirements.talent` | `string[]` | `[]` | e.g. `['mastery']` for superspells |
| `requirements.discipline` | `string[]` | `[]` | e.g. `['transmutation', 'botany']` for Magiczna Plaga |
| `isSuperspell` | `boolean` | `false` | Distinguishes superzaklęcia |
| `requiresGroupCast` | `boolean` | `false` | True for Zagłada |
| `minCasters` | `number` | `1` | 3 for Zagłada |
| `nonCombatOnly` | `boolean` | `false` | Tęsknota Serca, Więź Serc, Demeter rituals, etc. |
| `areaOfEffect` | `SchemaField` | - | `{ shape: 'point'\|'square'\|'rectangle'\|'cone'\|'sphere'\|'line', x: number, y: number, unit: 'm' }` |
| `damageBase` | `string` | `''` | Formula reference: `'magicalAbilities'`, `'magicalAbilities/2'`, `'magicalAbilities*2'`, `'1d6+magicalAbilities'`, etc. Parsed at cast time. |
| `damageType` | `string` | `'magical'` | `'magical' \| 'physical-magical' \| 'pure'` (ignores armor) |
| `ignoresArmor` | `boolean` | `false` | Crimson, Ether Pierce, Divine Spear |
| `statusEffects` | `string[]` | `[]` | Conditions a spell may apply (`'stunned'`, `'prone'`, `'frightened'`, `'charmed'`, etc.) |
| `saveAttribute` | `string` | `''` | If non-empty, target rolls `<attribute>+<saveSkill>` to resist |
| `saveSkill` | `string` | `''` | e.g. `'reflex'`, `'determination'` |
| `overcastOptions` | `array of {description, manaPerStep}` | `[]` | Replace free-text `overcasting` with structured list (legacy field kept for migration) |
| `sourceBook` | `string` | `''` | `'kg-magii'` / `'crimson-cult'` / `'abyss-curse'` / `'arcanum-sanguinis'` / `'core-rules'` |
| `castingTimeRounds` | `number` | `0` | 0 = action; >0 = rounds (used for combat enforcement of long casts) |
| `castingTimeMinutes` | `number` | `0` | For non-combat scaling (rituals, superspells) |
| `triggers` | `array of {event, effect}` | `[]` | Reactive effects: `{event:'killWithWeapon', effect:'freeCrimsonSpell'}`, `{event:'targetCastsSpell', effect:'forceUnconscious'}` |
| `variableSuccesses` | `array of {label, successes}` | `[]` | For Przywołanie Istoty z Otchłani: `[{label:'Tajemny Krab', successes:2}, ...]` |

### 5.3 Backward compatibility / migration

- Keep legacy fields (`overcasting`, `complexityLevel`, `targets`) populated for one minor version.
- Migration script in `src/migrations/0.2.0.ts`:
  - Move `complexityLevel` count → ensure `components.symbols.length` matches; if symbols empty, leave count.
  - Best-effort parse of `targets` string → `areaOfEffect` (regex: `/(\d+)\s*[×x]\s*(\d+)/`, `/promień\s+(\d+)/`).
  - `overcasting` text → seed first entry of `overcastOptions[0].description`.

---

## 6. Casting Logic - Gap Analysis

> Reference: [.src/foundry-system/src/logic/spell-cast.ts](../.src/foundry-system/src/logic/spell-cast.ts)

### 6.1 Pre-cast validation gates (new)

```
function validateCast(actor, spell, opts) -> ValidationResult
  - resourceCheck (mana / zeal / blood / mana+zeal for Hekate)
  - raceCheck (spell.requirements.race)
  - talentCheck (spell.requirements.talent - items on actor)
  - disciplineCheck (spell.requirements.discipline - at least one match)
  - deityCheck (sacred + non-empty deity → actor must be devoted to that deity)
  - groupCastCheck (warn if requiresGroupCast and only 1 caster targeted)
  - inCombatCheck for nonCombatOnly → block (warn-only override flag in opts)
  - inCombatCheck for isSuperspell → WARN (do not block); bypass via opts.bypassSuperspellWarning
  - witchSymbolCheck (count <= ceil(magic/2)) - already exists
```

### 6.2 New CastOptions

```ts
interface CastOptions {
  manaSpent?: number;
  zealSpent?: number;            // for Hekate when cast as sacred
  bloodSpent?: number;           // for blood mode
  hekateMode?: 'sacred' | 'witch'; // Hekate spell dispatch
  bypassSuperspellWarning?: boolean;  // Downcasting talent, NPC quick-cast abilities
  bypassNonCombatBlock?: boolean;     // GM override
  groupCasters?: string[];       // actor IDs of co-casters
  speaker?: ChatMessage.SpeakerData;
}
```

### 6.3 New casting modes

#### `castBlood(actor, spell, opts)`
- Resource: deduct `spell.bloodCost` from `actor.system.attributes.blood.value` (new attribute on character data - or HP if blood pool not added)
- Pool: `magic + magicalAbilities` (placeholder; final formula TBD when Blood Magic spells released)
- No overcast for v1; revisit when content lands

#### `castSacred` extension
- If spell has `complexityLevel > 0` (Hekate), allow `opts.hekateMode === 'witch'` to dispatch to `castWitch` instead

### 6.4 Damage rolling integration

Currently `castSpell` only rolls the TS test - no damage application. Add:

```
function rollSpellDamage(actor, spell): Roll
  - parse spell.damageBase formula
  - resolve tokens: 'magicalAbilities', 'devotion', 'soul', '1d6', etc.
  - return Roll for chat output
```

Display side-by-side in chat card: TS result | Damage formula result | Status effects to apply | Save target attribute+skill.

### 6.5 Status effect auto-apply

When TS test succeeds AND target has lower successes on save:
- For each entry in `spell.statusEffects[]`, apply ActiveEffect via Foundry condition system
- Hook into `conditions.ts` (already exists for combat status tracking)

### 6.6 Trigger registration

For reactive spells (Szkarłatny Sztylet, Klątwa Szkarłatu):
- On successful cast → register a hook on actor (`flag.hbm-rpg-v3.triggers[]`)
- Hook fires on matching combat event (`'killWithWeapon'` → free spell prompt; `'targetCastsSpell'` → opposed Determination test)
- Triggers expire on duration end or single use

### 6.7 Variable success summons

For Przywołanie Istoty z Otchłani:
- Cast UI prompts user to pick which entity (Tajemny Krab / Strażnik / Czempion / Simulacrum)
- Required successes loaded from `spell.variableSuccesses[selected].successes`
- Pass into TS test as `required` override

### 6.8 Group cast orchestration

For Zagłada:
- Cast UI lists co-casters from `opts.groupCasters[]`
- Each contributes their dice pool (sum)
- On success, all participants take "death" status (per spell description)
- Pre-cast warning chat card requires GM confirm

---

## 7. Constants Module - Required Additions

> Reference: [.src/foundry-system/src/constants.ts](../.src/foundry-system/src/constants.ts)

```ts
export const CASTING_MODES = ['standard', 'sacred', 'witch', 'blood'] as const;

export const SPELL_SCHOOLS = [
  'general', 'elements', 'sacred', 'illusion', 'necromancy',
  'transmutation', 'brewing', 'botany', 'artifacts', 'golemancy',
  'runes', 'sources', 'witch',
  'blood', 'crimson', 'abyssAspects', 'abyssPrimal', 'wildWitch',
] as const;

export const SACRED_DEITIES = [
  'common', 'jahwe', 'zeus', 'demeter', 'artemis',
  'hekate', 'aphrodite', 'eros',
] as const;

/**
 * Witch magic symbols. EXTENSIBLE - new content may add more.
 * Used for autocomplete only; spell.components.symbols accepts arbitrary strings.
 */
export const WITCH_SYMBOLS: readonly string[] = Object.freeze([
  'Potentia', 'Tutamen', 'Lux', 'Motus', 'Iter', 'Vacuos', 'Vitium',
  'Praecantatio', 'Aer', 'Aqua', 'Gelum', 'Ignis', 'Terra',
  'Cognitio', 'Alienis', 'Illusio', 'Somnium', 'Tenebrae', 'Auram',
  'Vinculum', 'Telum', 'Sensus', 'Perditio', 'Perfodio', 'Sano',
  'Volatus', 'Tempestas',
]);

export const SOURCE_BOOKS = [
  'core-rules', 'magic-book', 'arcanum-sanguinis',
  'crimson-cult', 'abyss-curse', 'humanity-guide',
  'bestiary', 'gold-steel-magic',
] as const;

export const AOE_SHAPES = ['point', 'square', 'rectangle', 'cone', 'sphere', 'line'] as const;

export const CONDITIONS = [
  'stunned', 'prone', 'frightened', 'charmed', 'unconscious',
  'restrained', 'blinded', 'poisoned', 'burning',
  'authority', 'dominated', 'concentrating',
] as const;
```

---

## 8. Character Sheet Spell Tab - Enhancement Spec

> Reference: [.src/foundry-system/src/sheets/character-sheet.ts](../.src/foundry-system/src/sheets/character-sheet.ts)

### 8.1 Grouping & filtering

- Replace flat `spells` list with grouped structure in `_prepareContext`:
  ```ts
  spellsByDiscipline: Record<DisciplineId, Item[]>
  spellsBySchool: Record<School, Item[]>
  superspells: Item[]  // separate list pulled out
  ```
- Sidebar filter UI: by `school`, `castingMode`, `deity`, `circle`, search-by-name
- Persist filter in `tabGroups['spellsFilter']`

### 8.2 Per-row badges

| Badge | Source field |
|---|---|
| Casting mode icon | `system.castingMode` (4 icons: ✦ standard, ✟ sacred, ✶ witch, ❤ blood) |
| Source book pip | `system.sourceBook` (color-coded) |
| Deity label | `system.deity` (only for sacred) |
| Superspell star | `system.isSuperspell === true` |
| Race-locked badge | `system.requirements.race.length > 0` |

### 8.3 Cast button enhancements

- Greyed out + tooltip when `validateCast()` fails (race/talent/discipline missing)
- Yellow warning icon when superspell + actor in combat
- Click → opens enhanced cast dialog with mana/zeal/blood field, hekate-mode toggle, group-caster picker, bypass-warning checkbox (GM only)

### 8.4 Resource displays

Add to stats tab header:
- Mana / max-per-spell / per-round (existing)
- **Blood pool** (new, only if any spell with `castingMode: 'blood'` is owned)
- Zeal (existing)

---

## 9. Spell Item Sheet - Enhancement Spec

> Reference: [.src/foundry-system/templates/item/spell.hbs](../.src/foundry-system/templates/item/spell.hbs)

### 9.1 Add fieldsets (in order)

1. **Identyfikacja** - name, sourceBook (select), school (select), discipline (select), deity (conditional select if school=sacred), circle
2. **Tryb rzucania** - castingMode (select), bloodCost (if blood), components.symbols (tag picker against `WITCH_SYMBOLS`, free-text allowed)
3. **Trudność** - threshold, successes, manaCost, castingTimeRounds, castingTimeMinutes
4. **Zasięg & Obszar** - range, areaOfEffect (shape select + x/y inputs), targets (kept as freetext fallback)
5. **Czas trwania** - duration, nonCombatOnly (checkbox)
6. **Obrażenia** - damageBase (text), damageType (select), ignoresArmor (checkbox)
7. **Efekty statusu** - statusEffects (multi-select against `CONDITIONS`), saveAttribute + saveSkill
8. **Wymagania** - requirements.race (multi-select), .talent (multi-select), .discipline (multi-select)
9. **Flagi** - isSuperspell, requiresGroupCast, minCasters
10. **Nadczarowanie** - repeatable list of `overcastOptions[]` (description + manaPerStep)
11. **Wyzwalacze (Triggery)** - repeatable list of `triggers[]` (event select + effect text)
12. **Warianty sukcesu** - repeatable list of `variableSuccesses[]` (label + successes)
13. **Opis & komponenty fabularne** - description (HTML), higherCircles (HTML, deprecated → migrated to overcastOptions)

### 9.2 Conditional rendering (Handlebars)

- Deity select: only if `system.school === 'sacred'`
- Blood cost: only if `system.castingMode === 'blood'`
- Witch complexity / symbols: if `castingMode === 'witch'` OR Hekate sacred spell
- Variable successes: only if non-empty (collapsible)
- Triggers: only if non-empty (collapsible)

---

## 10. Compendium Pack Plan

### 10.1 System-bundled packs

| Pack id | Type | Contents | Estimated count |
|---|---|---|---|
| `hbm-rpg-v3.spells-general` | Item | Magia Ogólna | 10 |
| `hbm-rpg-v3.spells-elements` | Item | Żywioły × 4 | 20 |
| `hbm-rpg-v3.spells-sacred` | Item | Sacred + 7 deities | 35 |
| `hbm-rpg-v3.spells-academic` | Item | Transmutacja, Iluzja, Nekromancja | 15 |
| `hbm-rpg-v3.spells-superspells` | Item | Superzaklęcia | 8 |
| `hbm-rpg-v3.spells-crimson` | Item | Magia Szkarłatu | 6 |
| `hbm-rpg-v3.spells-abyss` | Item | Magia Otchłani | 5 |
| `hbm-rpg-v3.spells-blood` | Item | Magia Krwi (placeholder) | 0 (TBD) |
| `hbm-rpg-v3.talents` | Item | All talents | TBD |
| `hbm-rpg-v3.disciplines` | Item | All discipline definitions | ~15 |
| `hbm-rpg-v3.classes` | Item | Class progression items | 5 |
| `hbm-rpg-v3.races` | Item | Race definitions | 8 |
| `hbm-rpg-v3.gear-baseline` | Item | Core weapons/armor/equipment | TBD |
| `hbm-rpg-v3.elixirs-baseline` | Item | Aneks C eliksiry | TBD |
| `hbm-rpg-v3.actors-bestiary` | Actor | Bestiariusz creatures | TBD |
| `hbm-rpg-v3.actors-npcs` | Actor | Bestiariusz NPCs | TBD |

### 10.2 Generation pipeline

- Source: structured YAML/JSON in `.src/foundry-system/data/spells/*.yaml` (one file per discipline)
- Build script (`scripts/build-packs.ts`) reads YAML, validates against Zod schema mirroring `SpellData`, writes LevelDB pack files into `packs/`
- Run as part of `bun run package`

---

## 11. Implementation Phases

### Phase A - Data model expansion (no UI changes)
1. Extend `SpellData` schema with all fields from §5.2
2. Add constants from §7
3. Write migration `0.2.0` for existing world data
4. Bump version → 0.2.0

### Phase B - Compendium seeding
1. Build YAML source files for all ~93 spells (§4) under `.src/foundry-system/data/spells/`
2. Implement `scripts/build-packs.ts`
3. Wire `bun run package` to generate packs

### Phase C - Casting logic upgrade
1. `validateCast()` pre-cast gates (§6.1)
2. New `castBlood()` mode + extend `CastOptions` (§6.2-6.3)
3. `rollSpellDamage()` + chat card overhaul (§6.4)
4. Status effect auto-apply hook (§6.5)
5. Trigger registration system (§6.6)
6. Variable success / group cast UI (§6.7-6.8)

### Phase D - Sheet UX
1. Spell item sheet enhancements (§9)
2. Character sheet spell tab grouping/filtering (§8)
3. Cast dialog overhaul

### Phase E - Quality & polish
1. Localization keys (Polish + English) for all new fields
2. CSS for badges, condition icons, source book pips
3. Foundry compendium browser metadata (image, system tags)

---

## Appendix A - Spell Field Naming Convention

- IDs: `kebab-case` matching slug-of-name (English-translated where idiomatic, Polish-derived otherwise)
- All UI labels: localized via `lang/pl.json` & `lang/en.json` keys under `HBM.spell.*`
- Damage formulas: lowercase camelCase tokens (`magicalAbilities`, `devotion`, `soul`, `mind`, `body`, `magic`)
- Conditions: lowercase singular (`stunned`, `prone`, `frightened`)

## Appendix B - Outstanding Questions

1. **Blood Pool resource**: should `actor.system.attributes.blood` be a new dedicated pool, or does Magia Krwi simply consume HP? Pending Arcanum Sanguinis spell list.
2. **Hekate "hybrid" persistence**: when cast as witch, should the spell consume zeal *or* mana? Currently planned: choose one per cast via `opts.hekateMode`.
3. **Detect Changes (`detect-changes`)**: spell explicitly says "no overcast"; need a `noOvercast: boolean` flag, OR encode in `overcastOptions: []` (empty = no overcast).
4. **Status effect saves**: which spells require an opposed Magia/Zdolności Magiczne test vs target's `saveAttribute + saveSkill`, and which auto-apply on TS success? Each spell needs explicit annotation in compendium YAML.
5. **Dzika Wiedźmia Magia** spells: not enumerated separately in books; mostly variants of standard witch magic with chaos overlay. Defer to dedicated content drop.
