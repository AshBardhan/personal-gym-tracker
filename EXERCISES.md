# Exercise Catalog

Shared reference for **client** and **server**: taxonomy enums and the predefined exercise seed list. Use this when implementing the exercise collection, admin UI, MSW fixtures, and workout logging (variant + sets on the workout exercise, not on the catalog).

Related: [MVP Roadmap](MVP_ROADMAP.md), [client constants](client/src/constants/exercises.ts), [server domain plan](server/plans/WORKOUT_DOMAIN_REDESIGN.md).

---

## Categories

Closed list for the exercise catalog `category` field.

| Slug | Label | Description |
| ---- | ----- | ----------- |
| `chest` | Chest | Pressing and fly movements for the pecs |
| `back` | Back | Rows, pulldowns, and hinge/pull patterns for the back |
| `shoulders` | Shoulders | Presses and raises for the deltoids and traps |
| `arms` | Arms | Isolation for biceps, triceps, and forearms |
| `legs` | Legs | Squats, hinges, and lower-body machines |
| `core` | Core | Abs, obliques, and trunk stability |
| `cardio` | Cardio | Conditioning and machine cardio |
| `full_body` | Full Body | Multi-region compounds and conditioning complexes |

---

## Target muscles

Closed list for `primaryMuscle` (exactly one) and `secondaryMuscles` (zero or more). Do not use category names (`Full Body`, `Cardio`, `Legs`) as muscles.

| Slug | Label |
| ---- | ----- |
| `chest` | Chest |
| `upper_chest` | Upper Chest |
| `lower_chest` | Lower Chest |
| `lats` | Lats |
| `upper_back` | Upper Back |
| `lower_back` | Lower Back |
| `traps` | Traps |
| `front_delts` | Front Delts |
| `side_delts` | Side Delts |
| `rear_delts` | Rear Delts |
| `biceps` | Biceps |
| `triceps` | Triceps |
| `forearms` | Forearms |
| `quads` | Quads |
| `hamstrings` | Hamstrings |
| `glutes` | Glutes |
| `calves` | Calves |
| `abs` | Abs |
| `obliques` | Obliques |
| `hip_flexors` | Hip Flexors |

**Rules**

- Volume charts attribute load to the **primary** muscle only (secondary does not double-count).
- Primary must not also appear in secondary.
- Prefer anatomical targets over broad labels (`lats` / `upper_back` instead of “Back”).

---

## Variants (equipment / modality)

Closed list for the equipment selector. Stored on the **workout exercise** when logging (catalog may optionally list `allowedVariants` later). If `custom` is selected, collect free-text from the user.

| Slug | Label |
| ---- | ----- |
| `barbell` | Barbell |
| `dumbbell` | Dumbbell |
| `machine` | Machine |
| `cable` | Cable |
| `bodyweight` | Bodyweight |
| `kettlebell` | Kettlebell |
| `band` | Resistance Band |
| `smith` | Smith Machine |
| `custom` | Custom |

---

## Entity split (catalog vs workout)

| Field | Catalog `Exercise` | Workout exercise (logged) |
| ----- | ------------------ | ------------------------- |
| name | yes | snapshot |
| category | yes | snapshot |
| primary muscle | yes | snapshot |
| secondary muscles | yes | snapshot |
| default / allowed variants | optional on catalog | — |
| chosen variant | — | yes (`custom` + optional text) |
| sets (`reps` × `weight`) | — | yes |

---

## Predefined exercises

Movement names only — **do not** encode equipment in the exercise name. Choose Barbell, Dumbbell, Cable, Machine, etc. via the **variant** selector when logging.

**Total:** 68

| Exercise name | Category | Primary target muscle | Secondary target muscles | Default variant |
| ------------- | -------- | --------------------- | ------------------------ | --------------- |
| Bench Press | Chest | Chest | Triceps, Front Delts | Barbell |
| Incline Bench Press | Chest | Upper Chest | Triceps, Front Delts | Barbell |
| Decline Bench Press | Chest | Lower Chest | Triceps | Barbell |
| Chest Fly | Chest | Chest | — | Dumbbell |
| Push-ups | Chest | Chest | Triceps, Abs | Bodyweight |
| Pec Deck | Chest | Chest | — | Machine |
| Deadlift | Back | Upper Back | Glutes, Hamstrings, Lower Back, Abs | Barbell |
| Bent Over Row | Back | Upper Back | Lats, Biceps | Barbell |
| T-Bar Row | Back | Upper Back | Lats, Biceps | Barbell |
| Lat Pulldown | Back | Lats | Biceps, Upper Back | Cable |
| Pull-ups | Back | Lats | Biceps, Abs | Bodyweight |
| Chin-ups | Back | Lats | Biceps | Bodyweight |
| Seated Row | Back | Upper Back | Lats, Biceps | Cable |
| Face Pulls | Back | Rear Delts | Upper Back | Cable |
| Hyperextensions | Back | Lower Back | Glutes | Bodyweight |
| Shoulder Press | Shoulders | Front Delts | Triceps, Side Delts | Barbell |
| Arnold Press | Shoulders | Front Delts | Side Delts, Triceps | Dumbbell |
| Lateral Raises | Shoulders | Side Delts | — | Dumbbell |
| Front Raises | Shoulders | Front Delts | — | Dumbbell |
| Rear Delt Fly | Shoulders | Rear Delts | — | Dumbbell |
| Upright Row | Shoulders | Side Delts | Traps | Barbell |
| Shrugs | Shoulders | Traps | — | Barbell |
| Bicep Curls | Arms | Biceps | — | Dumbbell |
| Hammer Curls | Arms | Biceps | Forearms | Dumbbell |
| Preacher Curls | Arms | Biceps | — | Dumbbell |
| Concentration Curls | Arms | Biceps | — | Dumbbell |
| Tricep Dips | Arms | Triceps | — | Bodyweight |
| Tricep Pushdown | Arms | Triceps | — | Cable |
| Overhead Tricep Extension | Arms | Triceps | — | Dumbbell |
| Skull Crushers | Arms | Triceps | — | Barbell |
| Close Grip Bench Press | Arms | Triceps | Chest | Barbell |
| Wrist Curls | Arms | Forearms | — | Barbell |
| Squats | Legs | Quads | Glutes, Abs | Barbell |
| Front Squats | Legs | Quads | Abs | Barbell |
| Leg Press | Legs | Quads | Glutes | Machine |
| Leg Extension | Legs | Quads | — | Machine |
| Leg Curl | Legs | Hamstrings | — | Machine |
| Romanian Deadlift | Legs | Hamstrings | Glutes, Lower Back | Barbell |
| Lunges | Legs | Quads | Glutes | Dumbbell |
| Bulgarian Split Squats | Legs | Quads | Glutes | Dumbbell |
| Calf Raises | Legs | Calves | — | Machine |
| Seated Calf Raises | Legs | Calves | — | Machine |
| Hack Squats | Legs | Quads | Glutes | Machine |
| Glute Bridges | Legs | Glutes | Hamstrings | Bodyweight |
| Hip Thrusts | Legs | Glutes | Hamstrings | Barbell |
| Planks | Core | Abs | — | Bodyweight |
| Side Planks | Core | Obliques | Abs | Bodyweight |
| Crunches | Core | Abs | — | Bodyweight |
| Bicycle Crunches | Core | Abs | Obliques | Bodyweight |
| Russian Twists | Core | Obliques | Abs | Bodyweight |
| Leg Raises | Core | Abs | Hip Flexors | Bodyweight |
| Hanging Leg Raises | Core | Abs | Hip Flexors | Bodyweight |
| Ab Wheel Rollout | Core | Abs | — | Bodyweight |
| Mountain Climbers | Core | Abs | Hip Flexors | Bodyweight |
| Running | Cardio | Quads | Calves | Bodyweight |
| Treadmill | Cardio | Quads | Calves | Machine |
| Cycling | Cardio | Quads | Calves | Machine |
| Elliptical | Cardio | Quads | Glutes, Calves | Machine |
| Rowing | Cardio | Lats | Quads, Upper Back | Machine |
| Stair Climber | Cardio | Quads | Glutes, Calves | Machine |
| Jump Rope | Cardio | Calves | Quads | Bodyweight |
| Burpees | Cardio | Quads | Chest, Abs | Bodyweight |
| Clean and Press | Full Body | Quads | Front Delts, Upper Back, Abs | Barbell |
| Thrusters | Full Body | Quads | Front Delts, Abs | Barbell |
| Turkish Get-ups | Full Body | Abs | Front Delts, Glutes | Kettlebell |
| Swings | Full Body | Glutes | Hamstrings, Abs | Kettlebell |
| Battle Ropes | Full Body | Front Delts | Abs, Forearms | Custom |
| Box Jumps | Full Body | Quads | Glutes, Calves | Bodyweight |

### Counts by category

| Category | Count |
| -------- | ----- |
| Chest | 6 |
| Back | 9 |
| Shoulders | 7 |
| Arms | 10 |
| Legs | 13 |
| Core | 9 |
| Cardio | 8 |
| Full Body | 6 |
| **Total** | **68** |

### Removed / renamed (avoid variant-in-name)

Equipment belongs in **variant**, not in the exercise title. These legacy names were dropped or cleaned:

| Former name | Action |
| ----------- | ------ |
| Dumbbell Press | Removed — use Bench Press + Dumbbell |
| Incline Dumbbell Press | Removed — use Incline Bench Press + Dumbbell |
| Cable Fly | Removed — use Chest Fly + Cable |
| Dips (Chest) | Removed — use Tricep Dips + Bodyweight (lean forward as form cue) |
| Seated Cable Row | Renamed to **Seated Row** (default Cable) |
| Single Arm Dumbbell Row | Removed — use Bent Over Row / Seated Row + Dumbbell |
| Cable Lateral Raises | Removed — use Lateral Raises + Cable |
| Cable Curls | Removed — use Bicep Curls + Cable |
| Cable Crunches | Removed — use Crunches + Cable |
| Rowing Machine | Renamed to **Rowing** (default Machine) |
| Kettlebell Swings | Renamed to **Swings** (default Kettlebell) |

---

## Seed notes

- Persist catalog fields with stable IDs (ObjectId) plus optional `normalizedName` uniqueness; do not rely on display name alone long-term.
- Store taxonomy as slugs in the database; show labels in the UI.
- Archive catalog entries instead of hard-deleting identities referenced by workout history.
- Default variant is a seed hint for the form selector; users may change variant (including Custom) when logging a workout.
- Never add catalog names that include Barbell, Dumbbell, Cable, Machine, Kettlebell, or parenthetical equipment/focus suffixes.
- Keep this document in sync when adding or renaming exercises in code, seed scripts, or the admin UI.
- Legacy client `muscleGroup` arrays are superseded by primary + secondary columns in this document.
