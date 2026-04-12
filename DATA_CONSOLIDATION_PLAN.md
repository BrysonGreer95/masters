# Data Consolidation Plan

_Decision: Option A (merge) + remove manually-entered point fields_

---

## Goals
1. Improve readability
2. Simplify complexity — remove unnecessary functions, only do what's needed
3. Make it easy to start again next year

---

## Files Being Deleted

| File | Why |
|------|-----|
| `dates.json` | Empty, never imported |
| `team-pairings.json` | Never imported; has wrong player IDs vs `data.json` anyway |
| `scorecard_data.json` | Merged into `data.json` |

---

## Files Remaining After Changes

| File | Purpose |
|------|---------|
| `config.json` | Event settings — year, venues, dates, admin password. Updated once per year. |
| `data.json` | Single source of truth: players + scorecard. Updated once per year to reset. |

---

## New `data.json` Shape

```json
{
  "_version": 5,
  "actual_putts": null,
  "players": [
    {
      "id": 1,
      "user": { "first_name": "Bryson", "last_name": "Greer" },
      "list_designation": "B",
      "fantasy_picks": ["Scottie Scheffler", "..."],
      "total_putts": 9042,
      "team": 4
    }
  ],
  "scorecard": {
    "putt_putt": {
      "courses": { "1": "blue", "2": "blue", "3": "blue" },
      "scores":  { "1": [1, 2, 2, ...], "2": [...] }
    },
    "scramble": {
      "scores": { "1": [null, null, ...], "2": [...] }
    }
  }
}
```

**Removed from player objects:** `parTeeShack`, `scramble`, `fantasy`
_(Points are always calculated — never stored in the file)_

**Removed from scorecard (now just constants in `scoring.js`):**
- `putt_putt.par` — already `PUTT_PAR_YELLOW` / `PUTT_PAR_BLUE` in scoring.js
- `scramble.par` — already `SCRAMBLE_PAR` in scoring.js

---

## How Points Work After Changes

| Event | Source | How Points Are Derived |
|-------|--------|------------------------|
| ParTee Shack | Hole scores in `data.json` scorecard | `puttPuttRankings` getter — already exists, computes rank + points from hole totals vs. course par |
| Scramble | Hole scores in `data.json` scorecard | `scrambleRankings` getter — already exists, computes rank + points per team |
| Fantasy | Masters API (golf.js) | `applyFantasyPoints` mutation — already auto-computes from API response |

All three are already computed today. The only change is **removing the manual-entry layer** that sits in front of them.

---

## Store Changes (`store/index.js`)

### Imports
```js
// Before
import defaultData from '../assets/data.json';
import scorecardData from '../assets/scorecard_data.json';

// After
import defaultData from '../assets/data.json';
// scorecardData is gone — everything is in defaultData.scorecard
```

### `defaultPuttHoles()` / `defaultScrambleHoles()`
Replace `scorecardData.putt_putt.*` / `scorecardData.scramble.*` references with
`defaultData.scorecard.putt_putt.*` / `defaultData.scorecard.scramble.*`.

### `loadPuttCourse()`
```js
// Before: scorecardData.putt_putt.courses
// After:  defaultData.scorecard.putt_putt.courses
```

### `sortedByTotal` getter — must be updated
Currently reads `player.parTeeShack + player.scramble + player.fantasy` off the player object.
After the change, those fields are gone. The getter needs to pull from the rankings:

```js
sortedByTotal(state, getters) {
  return [...state.players]
    .map((player) => ({
      ...player,
      parTeeShack: getters.puttPuttRankings[player.id]?.points ?? 0,
      scramble:    getters.scrambleRankings[player.team]?.points ?? 0,
      fantasy:     state.fantasyPoints[player.id] ?? 0,
    }))
    .sort((a, b) => (b.parTeeShack + b.scramble + b.fantasy) - (a.parTeeShack + a.scramble + a.fantasy))
    .map((player, index) => ({ ...player, _rank: index + 1 }));
},
```

> Note: `fantasy` still needs somewhere to live at runtime since it comes from an external API call,
> not a scorecard. The cleanest place is a `fantasyPoints` map in the store state
> `{ [playerId]: points }`, persisted to localStorage — just like `puttPuttHoles` is today.

### `updateScore` mutation — remove entirely
No manual point entry. The "Points" tab that calls this is also removed.

### `applyFantasyPoints` mutation — stays, small update
Instead of writing `player.fantasy = ...`, write into a `fantasyPoints` map on state:
```js
state.fantasyPoints = Object.fromEntries(
  state.players.map((p) => [p.id, rankings[p.id]?.points ?? 0])
);
```

---

## Admin View Changes (`AdminView.vue`)

### Remove: "Points" tab
The entire `tab === 'points'` section goes away:
- The table with manual `parTeeShack` / `scramble` / `fantasy` inputs
- The `updateScore` / `update()` method calls
- The "Copy JSON" button that exports player scores (replaced by unified export)
- Event completion toggles can move to the Putt and Scramble tabs where they belong

### Keep: ParTee Shack tab + Scramble tab
These are unchanged — hole input, live rank/points columns.

### Update: Export button
`copyScorecardJson` currently exports the old `scorecard_data.json` shape.
After the merge, a single "Copy data.json" button exports the full unified file:
```js
{
  _version: defaultData._version,
  actual_putts: ...,
  players: [...],  // no points fields
  scorecard: {
    putt_putt: { courses: {...}, scores: {...} },
    scramble:  { scores: {...} }
  }
}
```

---

## LeaderBoard Component Changes

The leaderboard currently reads `player.parTeeShack`, `player.scramble`, `player.fantasy`
directly off the player object. After the change, `sortedByTotal` will inject those as computed
properties before returning, so **the LeaderBoard template itself does not change**.

---

## What Stays the Same

- `puttPuttRankings` getter — no changes needed
- `scrambleRankings` getter — no changes needed  
- `puttPuttHoles` / `scrambleHoles` / `puttCourse` state — no changes needed
- All hole input UI in Admin — no changes needed
- `scoring.js` constants — no changes needed
- `Masters.vue` / `golf.js` fantasy API flow — no changes needed
- All par arrays remain in `scoring.js` (not duplicated in JSON)

---

## Year-Over-Year Reset (After This Change)

Two files to update:

**`config.json`** — Event details:
- `year`, `edition`
- Dates, times, venues, tee times for each event
- Bump `admin_password` if desired

**`data.json`** — People + scores:
- Update player list (names, designations, team assignments, fantasy picks, total_putts)
- Zero out all scorecard scores: `"1": [null, null, ...]` for every player/team
- Reset course assignments to defaults
- Bump `_version` (triggers localStorage wipe for all returning users)

That's it. No point fields to reset. No separate scorecard file. No stale pairings file.

---

## Risk Assessment

| Change | Risk | Notes |
|--------|------|-------|
| Delete `dates.json` | None | Empty and unused |
| Delete `team-pairings.json` | None | Never imported |
| Merge `scorecard_data.json` → `data.json` | Low | ~5 reference changes in store |
| Remove `parTeeShack`/`scramble`/`fantasy` from player | Medium | Must update `sortedByTotal` getter and LeaderBoard data flow |
| Remove "Points" tab in Admin | Low | Pure deletion |
| Add `fantasyPoints` map to store state | Low | Same pattern as `puttPuttHoles` |

The trickiest part is ensuring `sortedByTotal` correctly pulls from rankings instead of player fields,
and that `LeaderBoard.vue` continues to display the injected values without template changes.
