# Data Integrity & Export TODO (`results.json`)

During the frontend audit, the following metrics in the legacy UI had no exported source or conflicted with `public/data/results.json`:

1. **Expected Calibration Error (ECE) & Per-Method Latency**
   - Legacy `Dashboard.jsx` hard-coded ECE (`0.042 / 0.068 / 0.148`) and Latency (`18.4 / 16.2 / 14.1 ms`), which are not exported in `results.json`.
   - **Frontend behavior**: Shown as `—` with a `"No exported data in results.json"` tooltip.
   - **Action needed**: Export `ece` and `latency_ms` per method from `scripts/evaluate_all.py`.

2. **Turntable Azimuth Sector AUROC**
   - Legacy `Dashboard.jsx` hard-coded 5 azimuth sectors (`0°–45°`, `45°–135°`, `135°–225°`, `225°–315°`, `315°–360°`) with no source file.
   - **Frontend behavior**: Badged `Illustrative / placeholder — no exported data` and values shown as `—`.
   - **Action needed**: Export per-sector AUROC from `scripts/evaluate_turntable.py` into `results.json`.

3. **Dataset Known/Unknown Frame Counts**
   - `results.json` reports `1,820` known / `544` unknown (`2,364` total).
   - Legacy `Dataset.jsx` reported `1,766` known / `598` unknown (`2,364` total).
   - **Frontend behavior**: Uses `results.json` (`1,820` / `544`) everywhere. Confirm exact split counts against the training notebook.

4. **Resampled Curves / Confusion Matrix / Score Distributions / PCA Scatter**
   - `curves.*`, `confusion_matrix_dml`, `score_distributions.dml`, and `latent_scatter_pca` in `results.json` are compact/rounded summaries (6–10 points).
   - **Frontend behavior**: Footnoted *"Curve resampled for display"* on those charts. Export full evaluation arrays if raw curves are desired.

5. **Dataset Splits (Watertank vs Turntable)**
   - Separate `watertank` and `turntable` splits are not exported in `results.json`.
   - **Frontend behavior**: Disabled in the Dataset Split dropdown with tooltip `"No data exported yet"`.
