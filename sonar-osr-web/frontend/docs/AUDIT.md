# SonarOSR Frontend Audit (Phase 0)

## 1. Backup & Safety
- Legacy frontend backed up to `sonar-osr-web/frontend_legacy/`.
- Backend (`sonar-osr-web/backend/`), `src/`, `configs/`, `scripts/`, `outputs/`, and root files are untouched.

## 2. Routes Inventory (`src/App.jsx`)
- `/` → `Home`
- `/demo` → `LiveDemo`
- `/dashboard` → `Dashboard`
- `/lab`, `/pipeline`, `/mission` → `PipelineLab`
- `/methods` → `Methods`
- `/dataset` → `Dataset`
- `/about` → `About`
- `*` → `<Navigate to="/" replace />`

## 3. API & Static Data Dependencies (`src/lib/api.js`)
- `GET /api/health` (2s timeout; returns `{ status: 'offline', error }` on failure)
- `GET /api/meta` (falls back to cached known/unknown class lists + ARIS Explorer 3000 specs)
- `POST /api/predict` (multipart: `file`, `threshold`, `custom_tau`, `method='all'`)
- `POST /api/physics` (multipart: `file`)
- `POST /api/simulate-noise` (multipart: `file`, `noise_variance`, `speckle_intensity`, `turbidity`)
- `GET /data/results.json` (static benchmark results)
- `GET /samples/manifest.json` (7 sample presets: bottle, can, tire, propeller, chain, valve, shampoo-bottle)
- `public/figures/*.png` (22 publication figures)

## 4. Feature Parity & Data Integrity Findings
1. **Hard-coded metrics in `Dashboard.jsx`**:
   - Legacy `benchmarkTable` hard-codes AP (`0.9120/0.8740/0.7930`), UDR (`92.1%/88.7%/77.4%`), Closed-set Acc (`94.2%/91.8%/89.4%`), ECE (`0.042/0.068/0.148`), and Latency (`18.4/16.2/14.1 ms`). These conflict with `results.json` (real AP: `0.8448/0.8275/0.5782`; real UDR: `0.7475/0.8829/0.6823`). ECE and per-method latency have no exported source.
   - Legacy `perUnknownData` hard-codes values (e.g., chain DML `94.8%`) that conflict with `results.json` `per_class_unknown_detection` (chain DML `71%`, SVDD `76%`, MSP `60%`).
   - Legacy `turntableData` (5 azimuth sectors) has no source file in `public/data/results.json` or `outputs/results/`.
2. **Chart data in `RocCurve.jsx`, `ConfusionMatrix.jsx`, `ThresholdExplorer.jsx`**:
   - Legacy charts generated synthetic curves/histograms or hard-coded matrices instead of reading `curves.*`, `confusion_matrix_dml`, and `score_distributions.dml` from `results.json`.
3. **Dataset counts mismatch**:
   - `results.json`: `1,820` known / `544` unknown (`2,364` total).
   - Legacy `Dataset.jsx`: `1,766` known / `598` unknown (`2,364` total).
4. **Fabricated predictions in `LiveDemo.jsx`, `NoiseLab.jsx`, `PhysicsInspector.jsx`**:
   - Legacy `LiveDemo.jsx` fell back to filename-based fake predictions when `/api/predict` failed. New frontend will remove fabricated predictions and show an honest offline state + `mode` badge (`live_pytorch` vs `calibrated_demonstration`).
   - `AuvPatrol.jsx` uses scripted waypoint scores; will be explicitly badged **"Scripted simulation"**.
5. **LocalStorage safety**:
   - `Navigation.jsx` accessed `localStorage` without `try/catch`; new stores will wrap all `localStorage` access in `try/catch` and support both `light` (default) and `dark`/`slate`.
