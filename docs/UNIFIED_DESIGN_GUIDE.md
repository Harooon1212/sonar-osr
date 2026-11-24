# SonarOSR: unified full-stack architecture and design guide

**Glassmorphism edition**

Open-set recognition for underwater forward-looking sonar (FLS) imagery
Department of Computer Science, Bahria University, Islamabad

**Authors:** Mohammad Khizar Hayat Cheema (01-134231-039), Muhammad Haroon (01-134231-052)
**Supervisor:** Dr. Arif Ur Rahman
**Date:** November 2026

---

## 1. Executive summary and architecture

SonarOSR is a full-stack platform for evaluating and demonstrating the three open-set recognition (OSR) methods built in this project: maximum softmax probability (MSP), one-class SVDD with nearest-centroid scoring, and deep metric learning (DML). Around them sit the lab tools: a noise simulator, a highlight and shadow inspector, an AUV patrol simulator and an unknown-discovery workflow.

The frontend is Vite + React with D3 SVG charts and plain CSS tokens. The backend is FastAPI + PyTorch on CPU. The visual language is a dark navy sonar console seen through layered glass: translucent panels for structure, near-opaque plates for data.

```text
CLIENT · Vite + React · D3 SVG charts · plain CSS tokens
│   1 Home        2 Live demo     3 Dashboard      4 Pipeline lab
│   5 Mission     6 Methods       7 Dataset        8 Discovery (v2)
│   9 About
│   Layers: backdrop canvas → glass panels → data plates (D3 / SVG)
│
▼  HTTP / JSON

SERVER · FastAPI + PyTorch (CPU)
│   GET  /api/health     GET  /api/meta       POST /api/predict
│   GET  /api/samples    POST /api/physics    POST /api/simulate-noise
│   v2:  GET /api/unknowns    POST /api/unknowns/cluster
│
│   Engine:    OSRPredictor (app/inference.py) + app/preprocessing.py
│   Artifacts: resnet50_baseline.pth, embedding_model.pth,
│              centroids.npz, config.json
```

---

## 2. Design system: glassmorphism on a sonar console

### 2.1 Concept

Three layers, bottom to top:

1. **Backdrop:** a dark, static, low-contrast sonar scene. Glass needs something behind it to blur, so this layer is deliberate.
2. **Glass:** translucent, blurred panels that hold structure (navigation, section shells, floating layers).
3. **Data:** charts, tables, gauges and scores sit on near-opaque plates. Data is never read through blur.

The governing rule: **glass is for structure, solid is for data.**

### 2.2 Colour tokens

```css
:root {
  /* Base */
  --bg-base:      #0A0F1E;   /* abyss navy */
  --bg-surface:   #0D1829;   /* submerged panel */
  --bg-elevated:  #132238;   /* solid fallback and inset cards */
  --border-subtle:#1E2E48;

  /* Ink */
  --text-main:    #E2E8F0;
  --text-muted:   #94A3B8;   /* about 6.9:1 on --bg-surface; replaces #64748B */
  --text-faint:   #64748B;   /* decoration and disabled states only (about 3.7:1) */

  /* Accents */
  --accent-blue:      #1B3A6B;  /* sonar primary, solid fills */
  --glow-cyan:        #38BDF8;  /* active beams, operating points, focus ring */
  --glow-cyan-soft:   #60A5FA;
  --highlight-green:  #10B981;  /* direct backscatter, known region */
  --shadow-purple:    #A855F7;  /* beam occlusion zone */
  --alert-red:        #EF4444;  /* out-of-distribution alert */
}
```

### 2.3 Glass tokens

```css
:root {
  /* Glass tiers: background alpha and blur radius */
  --glass-1-bg: rgba(13, 24, 41, 0.55);  --glass-1-blur: 14px;  /* shells, nav */
  --glass-2-bg: rgba(19, 34, 56, 0.62);  --glass-2-blur: 18px;  /* primary cards */
  --glass-3-bg: rgba(19, 34, 56, 0.80);  --glass-3-blur: 24px;  /* floating layers */

  /* Data plate: near-opaque, no blur */
  --glass-data-bg: rgba(10, 15, 30, 0.88);

  /* Edges and depth */
  --glass-border:        rgba(148, 197, 255, 0.16);
  --glass-border-strong: rgba(148, 197, 255, 0.30);
  --glass-edge:   inset 0 1px 0 rgba(255, 255, 255, 0.07);  /* top highlight */
  --glass-shadow: 0 8px 32px rgba(2, 6, 16, 0.45);

  /* Shape: vary by role, do not use one radius everywhere */
  --radius-panel: 16px;
  --radius-card: 12px;
  --radius-control: 10px;
  --radius-pill: 999px;
}
```

| Tier | Use | Blur | Notes |
| --- | --- | --- | --- |
| Glass 1 | Navigation bar, section shells, tab bars | 14 px | Raise background alpha to about 0.75 once the page scrolls under the nav |
| Glass 2 | Primary cards sitting directly on the backdrop (method cards, dataset cards) | 18 px | Never place a Glass 2 card inside a Glass 1 panel |
| Glass 3 | Modals, popovers, dropdowns, tooltips | 24 px | Highest alpha so text stays readable |
| Data plate | Chart, table and gauge containers | none | Alpha 0.88 so grid lines and numbers stay crisp |
| Inset | Anything inside a glass panel (KPI tiles, showdown cards) | none | Fill `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.06)` |

### 2.4 Backdrop layer

A fixed, full-viewport layer, drawn once and never animated:

1. `--bg-base` solid fill.
2. A real FLS frame (grayscale, darkened, slightly blurred) at 6 to 10% opacity as texture.
3. Faint range rings in SVG, stroke `rgba(56, 189, 248, 0.06)`.
4. Two light pools: radial `--glow-cyan` at 10% opacity or less, roughly 600 px across, one behind the hero and one behind the dashboard header. They give the glass something to refract.

Keep the brightest backdrop region at or below about 12% lightness so text contrast holds on every panel.

### 2.5 Component recipes

```css
/* Tier 1: shells, navigation */
.glass {
  background: var(--glass-1-bg);
  -webkit-backdrop-filter: blur(var(--glass-1-blur)) saturate(140%);
  backdrop-filter: blur(var(--glass-1-blur)) saturate(140%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-panel);
  box-shadow: var(--glass-edge), var(--glass-shadow);
}

/* Tier 2: primary cards on the backdrop */
.glass--card {
  background: var(--glass-2-bg);
  -webkit-backdrop-filter: blur(var(--glass-2-blur)) saturate(140%);
  backdrop-filter: blur(var(--glass-2-blur)) saturate(140%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  box-shadow: var(--glass-edge), var(--glass-shadow);
}

/* Tier 3: floating layers */
.glass--float {
  background: var(--glass-3-bg);
  -webkit-backdrop-filter: blur(var(--glass-3-blur)) saturate(140%);
  backdrop-filter: blur(var(--glass-3-blur)) saturate(140%);
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-card);
  box-shadow: var(--glass-edge), 0 16px 48px rgba(2, 6, 16, 0.6);
}

/* Data plate: charts, tables, gauges (no blur) */
.plate {
  background: var(--glass-data-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
}

/* Inset: inside any glass panel (no blur) */
.inset {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-control);
}

/* Fallback: browsers without backdrop-filter */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass, .glass--card { background: rgba(13, 24, 41, 0.96); }
  .glass--float        { background: var(--bg-elevated); }
}

/* Accessibility: users who ask for less transparency or more contrast */
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glass, .glass--card, .glass--float {
    background: var(--bg-elevated);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: var(--glass-border-strong);
  }
}

/* Small screens: lighter blur */
@media (max-width: 640px) {
  :root { --glass-1-blur: 10px; --glass-2-blur: 12px; --glass-3-blur: 16px; }
}
```

**Controls**

| Control | Style |
| --- | --- |
| Primary button | Solid `--accent-blue` fill, 1px border `--glow-cyan` at 40% alpha, no gradient |
| Secondary button | `.inset` style with `--text-main` label |
| Text input and slider track | `.inset` style, 2px `--glow-cyan` focus ring with 2px offset |
| Badge | Pill radius, 1px border, tinted fill at 12% alpha, sentence-case label |
| Tab bar | Glass 1 strip; active tab marked by a 2px `--glow-cyan` underline and full-contrast text |

### 2.6 Typography

| Role | Font | Use |
| --- | --- | --- |
| Headings | Space Grotesk | Technical, crisp, architectural |
| Body and UI | Inter | Readable at all sizes |
| Data | JetBrains Mono | Scores, matrices, thresholds, coordinates only |

### 2.7 Rules

**Do**

- Use sentence case throughout: "Known marine debris", not "KNOWN MARINE DEBRIS".
- Use exactly one animation: the radar sweep in the hero.
- Group related tiles inside one glass panel as inset tiles, instead of giving each tile its own blur.
- Define depth with border brightness and alpha, not with stacked shadows.
- Pair every red/green meaning with an icon or a label.

**Do not**

- Nest blurred elements (a blurred card inside a blurred panel).
- Put gradient fills on text, buttons or panels. The only gradients allowed are the two backdrop light pools at 10% opacity or less.
- Colour a single word differently in a heading.
- Animate an element that has `backdrop-filter`, or anything moving underneath one. The sweep lives inside a solid viewport, never under glass.
- Apply blur to table rows, list items or chart elements.

### 2.8 Accessibility

- Check contrast on the composite, meaning the panel over the brightest backdrop region, not on the token alone. Targets: body text 4.5:1, large text and UI components 3:1.
- Muted text uses `--text-muted` (`#94A3B8`). The original `#64748B` is only about 3.7:1 on `--bg-surface` and fails AA for body text.
- The margin gauge shows its side with a label and an icon as well as colour.
- Honour `prefers-reduced-motion`: the radar sweep becomes a static frame with a fixed scan line.
- Honour `prefers-reduced-transparency` and `prefers-contrast` through the media query in 2.5.
- Layouts are responsive down to 360 px width.

### 2.9 Performance budget

- At most three blurred elements visible at once (for example nav, one shell and one floating layer).
- Blur radius at most 24 px on desktop and 16 px on small screens.
- No blur on scrolling lists. Use `.plate` or `.inset` there.
- Safari needs the `-webkit-backdrop-filter` prefix.
- Test scrolling on a mid-range phone before sign-off. If it stutters, switch that tier to the solid fallback on small screens.

---

## 3. Information architecture and page specifications

Nine routes:

```text
/            Home and overview
/demo        Live OSR classifier and 3-method showdown
/dashboard   Research benchmark, ROC and PR curves, threshold explorer
/pipeline    Preprocessing, ocean noise and physics lab
/mission     AUV patrol simulator
/methods     Theoretical foundations and equations
/dataset     Marine Debris FLS and ARIS Explorer 3000 specifications
/discovery   Unknown discovery and incremental clustering (v2)
/about       Team, supervisor, citations
```

### Page 1: Home (`/`)

- **Acoustic hero:** a real FLS image inside a circular or sector radar viewport with a continuous 360° sweep line. The viewport is a solid black inset framed by a glass border. The headline and call-to-action sit in a Glass 1 panel.
- **Status badge:** reports `/api/health` ("Model online" or "Waking up the model") with the sub-label "Trained on ARIS Explorer 3000 data". No sensor is live, so the badge must not claim one.
- **Problem narrative:** conventional classifiers assign high-confidence known labels to unmapped underwater targets, which is a serious risk for autonomous vehicles.
- **KPI strip:** one Glass 1 panel holding four inset tiles, read from `results.json`:
  - Best AUROC: 0.9255 (deep metric learning)
  - Lowest FPR: 11.71% (one-class SVDD, nearest centroid)
  - Known-class recall (TPR): 94.10% (deep metric learning)
  - Dataset images: 2,364 (test set: 271 known and 598 unknown)
- **Pipeline strip:** raw sonar frame → median + CLAHE → ResNet-50 features (2048-D) → open-set boundary → decision.

### Page 2: Live demo and method showdown (`/demo`)

- **Input zone:** drag-and-drop uploader (PNG, JPG, BMP; RGBA is converted to RGB) and a bundled gallery of 6 known samples (propeller, bottle, tire, can, drink-carton, hook) and 4 unknown samples (chain, valve, shampoo-bottle, standing-bottle).
- **Strictness control:** three presets (Defense, Balanced, High-recall) and a draggable slider. The three methods score on different scales (MSP is a probability, SVDD a distance in 2048-D, DML a distance in 128-D), so one raw τ cannot drive all three. The slider therefore sets a **strictness level** that is mapped to each method's own τ through a lookup table exported to `results.json` (`strictness_table`). A custom τ can be sent per method.
  - Balanced: the Youden's J threshold.
  - Defense: the threshold at a lower known-class recall target (proposal: 85%).
  - High-recall: the threshold at a higher recall target (proposal: 98%).
  - Compute recall targets on validation known-class scores, and adjust the proposals after seeing the curves.
- **Showdown:** three inset cards inside one Glass 1 shell.
  - MSP card: predicted class, probability bar, and a note when the image is an unknown that was confidently accepted.
  - One-class SVDD card: nearest-centroid distance, margin to threshold, verdict.
  - Deep metric learning card: embedding distance, margin gauge, verdict.
- **Margin gauge:** diverging, centred at 0, on a data plate. Right side is known (`score ≥ τ`) with a check icon and the label "Known"; left side is out of distribution (`score < τ`) with a warning icon and the label "Unknown". Colour supports the label, never replaces it.
- **Centroid distances:** D3 bars on a data plate showing the distance to each of the 6 known centroids for the selected method, with a dashed line for the active τ.
- **Mission log export:** a button that downloads the result as `.txt` or `.json`.
- **States:** loading, wrong file type, file too large, server error.
- **Note on the page:** a non-sonar image will be flagged unknown, which is correct behaviour.

### Page 3: Research dashboard (`/dashboard`)

The tab bar is Glass 1. Every chart and table sits on a data plate.

- **Overview:** comparison table for all three methods with winners highlighted for AUROC, AP, TPR, FPR and UDR.
- **Curves (D3 SVG):** ROC and PR curves for all three methods, with hover crosshairs and the operating point marked.
- **Confusion matrices:** normalised heatmaps for MSP, SVDD and DML, with counts available on hover.
- **Unknown detection:** grouped bars for chain, valve, shampoo-bottle and standing-bottle across the three methods.
- **Threshold explorer:** drag τ across the dual score histogram (known vs unknown). TPR, FPR and UDR recompute in the browser from the exported per-image score arrays, with no server calls.
- **Embedding explorer:** 2D scatter from pre-fitted PCA or UMAP coordinates. Uploaded images are projected onto it as a pulsing point. t-SNE cannot place new points, so use it only for a static background if at all.
- **Training dynamics:** loss and accuracy curves for the baseline ResNet-50 and the triplet-loss network.
- **Phase 2 turntable evaluation:** cross-dataset results on 17 object classes (4,756 images; the rotating-platform class is excluded). Shown only once the Phase 2 run is complete.

### Page 4: Pipeline lab (`/pipeline`)

- **Ocean noise simulator:** sliders for multiplicative speckle noise (σ) and turbidity (backscatter attenuation), showing the restored image after median filtering and CLAHE.
- **Highlight and shadow inspector:** splits the image into a highlight zone (green overlay, direct backscatter) and an occlusion shadow (purple overlay, beam blockage), with area percentages and the highlight-to-shadow ratio. Label this as an approximate, threshold-based segmentation.
- **Before/after slider:** a swipe handle comparing the raw frame with the preprocessed one.

### Page 5: AUV patrol simulator (`/mission`)

- **Concept:** an interactive simulation of an autonomous underwater vehicle cruising a seabed survey grid. Label it "Illustrative simulation": the vehicle motion is scripted, while the classifications come from `/api/predict` on bundled sample images.
- **Interface:** map and sonar-track timeline, speed control, and a sensor-frequency toggle (3.0 MHz vs 1.8 MHz).
- **Encounter sequence:**
  - Propeller (known): catalogued, the vehicle continues.
  - Tire (known): catalogued, the vehicle continues.
  - Chain (novel): the OSR engine rejects it, an alert fires, and the vehicle computes an avoidance waypoint.

### Page 6: Methods and mathematics (`/methods`)

**Method 1: MSP.** A softmax confidence score:

$$\hat{y} = \arg\max_k p_k(x), \qquad \text{known iff } \max_k p_k(x) \ge \tau$$

**Method 2: one-class SVDD (nearest centroid).** Class centroids in the 2048-D global-average-pooled feature space of the fine-tuned ResNet-50:

$$C_k = \frac{1}{N_k} \sum_{i=1}^{N_k} f(x_i)$$

This is a centroid-distance rule in the spirit of SVDD. It is not a trained Deep SVDD hypersphere, and the page should say so.

**Method 3: deep metric learning.** Triplet margin loss with margin α = 0.2, cosine distance and hard-triplet online mining. The embedding is 128-D and L2-normalised:

$$L = \max\bigl(0,\; d(f(a), f(p)) - d(f(a), f(n)) + \alpha\bigr)$$

**Decision rule (Equation 2)**, used for methods 2 and 3, written with a distance threshold:

$$\hat{y} = \begin{cases} \arg\min_k \lVert f(x) - C_k \rVert_2 & \text{if } \min_k \lVert f(x) - C_k \rVert_2 < \tau \\ \text{UNKNOWN} & \text{if } \min_k \lVert f(x) - C_k \rVert_2 \ge \tau \end{cases}$$

In the code and the UI the score is `-min_k ||f(x) - C_k||` and a sample is known when `score ≥ τ`, so the score-space threshold is the negative of the distance-space one.

Each method section also carries a plain-language explanation, strengths and weaknesses, and a "which to use" note: deep metric learning has the best AUROC, one-class SVDD has the lowest false-positive rate.

### Page 7: Dataset and hardware (`/dataset`)

- **Sensor:** ARIS Explorer 3000 acoustic camera. 3.0 MHz (identification) and 1.8 MHz (detection) modes, 128 beams, 0.25° angular resolution.
- **Dataset:** Marine Debris Forward-Looking Sonar (MD-FLS), watertank-cropped release.

| Class | Images | Role |
| --- | --- | --- |
| bottle | 449 | Known |
| can | 367 | Known |
| tire | 331 | Known |
| drink-carton | 349 | Known |
| hook | 133 | Known |
| propeller | 137 | Known |
| chain | 226 | Unknown (test only) |
| valve | 208 | Unknown (test only) |
| shampoo-bottle | 99 | Unknown (test only) |
| standing-bottle | 65 | Unknown (test only) |
| **Total** | **2,364** | 1,766 known, 598 unknown |

- **Splits (known classes):** 1,233 train, 262 validation, 271 test. All 598 unknown images are test-only. Zero leakage between splits was verified.
- Show the class grid with sample images, the before/after preprocessing slider, and the class weights used against imbalance (hook and propeller are upweighted).

### Page 8: Unknown discovery, v2 (`/discovery`)

1. Rejected frames accumulate in an SQLite anomaly pool (image, embedding, three scores, timestamp).
2. DBSCAN on the 128-D embeddings finds candidate clusters.
3. An operator reviews each cluster montage and names or rejects it.
4. A confirmed cluster becomes a new centroid for the SVDD and DML methods, so no retraining is needed. MSP would need fine-tuning.

Gate the page behind an admin view, because a public site lets anyone pollute the pool. Free Hugging Face Space storage is ephemeral, so push the pool to external storage.

### Page 9: About and citations (`/about`)

- Bahria University Computer Science Department, team and supervisor acknowledgement.
- BibTeX for Valdenegro-Toro (MD-FLS dataset), He et al. (ResNet), Scheirer et al. and Bendale and Boult (open-set recognition), and Hendrycks and Gimpel (MSP baseline).

### Glass budget per page

| Page | Blurred layers | Solid areas |
| --- | --- | --- |
| Home | Nav, hero panel, KPI shell | Radar viewport |
| Live demo | Nav, showdown shell | Gauges, distance chart, inset cards |
| Dashboard | Nav, tab bar | All charts and tables (data plates) |
| Pipeline lab | Nav, controls shell | Image canvases |
| Mission | Nav, controls shell | Map and timeline |
| Methods, Dataset, About | Nav, section shells | Equations, tables |

---

## 4. Backend REST API

Built with FastAPI (`backend/app/main.py`), wrapping `OSRPredictor` from `backend/app/inference.py`.

### `GET /api/health`

```json
{"status": "online", "model_loaded": true, "device": "cpu"}
```

### `GET /api/meta`

```json
{
  "known_classes": ["bottle", "can", "tire", "drink-carton", "hook", "propeller"],
  "unknown_classes": ["chain", "valve", "shampoo-bottle", "standing-bottle"],
  "thresholds": {"msp": 0.9887, "svdd": -13.17, "dml": null},
  "metrics": {"dml_auroc": 0.9255, "svdd_fpr": 0.1171, "dml_tpr": 0.9410}
}
```

The DML threshold is filled from `config.json` at startup.

### `POST /api/predict`

Multipart image plus form fields `method` (`"dml"`, `"svdd"` or `"msp"`) and an optional `custom_tau` (float, in the selected method's own score scale).

```json
{
  "method_used": "dml",
  "is_known": false,
  "verdict": "unknown",
  "predicted_class": null,
  "nearest_known_class": "drink-carton",
  "score": -1.41,
  "threshold": -0.712,
  "margin_to_threshold": -0.698,
  "anomaly_score": 1.41,
  "centroid_distances": {
    "bottle": 1.45, "can": 1.52, "tire": 1.62,
    "drink-carton": 1.41, "hook": 1.70, "propeller": 1.58
  },
  "showdown": {
    "msp":  {"is_known": true,  "predicted_class": "can", "score": 0.994, "threshold": 0.9887},
    "svdd": {"is_known": false, "predicted_class": null,  "score": -17.9, "threshold": -13.17},
    "dml":  {"is_known": false, "predicted_class": null,  "score": -1.41, "threshold": -0.712}
  }
}
```

Field definitions: `score` is `-min distance` for SVDD and DML and the max softmax probability for MSP; `margin_to_threshold = score - threshold`; `anomaly_score` is the minimum centroid distance. The example values are illustrative except the SVDD threshold, which comes from the notebook. In the example, MSP accepts an unknown with a score above its threshold, which is the overconfidence failure the demo is meant to show.

### `POST /api/physics`

Image in; returns highlight percentage, shadow percentage, their ratio, and a base64 overlay PNG.

### `POST /api/simulate-noise`

Image plus `speckle_intensity` (float) and `turbidity` (float); returns the base64 noisy image and the base64 restored image.

### `GET /api/samples`

Bundled samples with thumbnails and labels.

### v2: discovery

`GET /api/unknowns`, `POST /api/unknowns/cluster`, `POST /api/unknowns/{id}/confirm`.

---

## 5. Pre-exported static data (`results.json`)

All curves, histograms and matrices are computed in the notebook and stored in `frontend/public/data/results.json`, so the dashboard needs no server round trips. Entries that are `null` must be exported from the notebook before the dashboard is built.

```json
{
  "summary": {
    "total_images": 2364,
    "known_images": 1766,
    "unknown_images": 598,
    "train_known": 1233,
    "val_known": 262,
    "test_known": 271,
    "test_unknown": 598,
    "winners": {"auroc": "dml", "ap": "dml", "tpr": "dml", "fpr": "svdd", "udr": "svdd"}
  },
  "methods": {
    "msp":  {"auroc": 0.8165, "ap": 0.5782, "tpr": 0.8487, "fpr": 0.3177, "udr": 0.6823, "tau": 0.9887},
    "svdd": {"auroc": 0.8986, "ap": 0.8275, "tpr": 0.8413, "fpr": 0.1171, "udr": 0.8829, "tau": -13.17},
    "dml":  {"auroc": 0.9255, "ap": 0.8448, "tpr": 0.9410, "fpr": 0.2525, "udr": 0.7475, "tau": null}
  },
  "confusion": {
    "msp":  {"tn": 408, "fp": 190, "fn": 41, "tp": 230},
    "svdd": {"tn": 528, "fp": 70,  "fn": 43, "tp": 228},
    "dml":  null
  },
  "per_class_unknown_detection": {
    "chain":           {"msp": 60.0, "svdd": 76.0,  "dml": null},
    "valve":           {"msp": 85.0, "svdd": 93.0,  "dml": null},
    "shampoo-bottle":  {"msp": 57.0, "svdd": 99.0,  "dml": null},
    "standing-bottle": {"msp": 63.0, "svdd": 100.0, "dml": null}
  },
  "curves": {
    "msp_roc": [], "svdd_roc": [], "dml_roc": [],
    "msp_pr": [],  "svdd_pr": [],  "dml_pr": []
  },
  "scores": {
    "msp":  {"known": [], "unknown": []},
    "svdd": {"known": [], "unknown": []},
    "dml":  {"known": [], "unknown": []}
  },
  "strictness_table": {"msp": [], "svdd": [], "dml": []},
  "embedding_2d": {"coords": [], "labels": []},
  "training": {"baseline": {}, "triplet": {}},
  "phase2_turntable": null
}
```

- `curves` and `scores` hold full arrays exported from the notebook (`[fpr, tpr]` pairs; one score per test image).
- `strictness_table` holds each method's τ at evenly spaced strictness levels, derived from validation known-class scores.
- The DML per-class detection rates and DML confusion matrix must be re-exported with the same threshold used for the DML summary metrics. See the revision notes.

---

## 6. Directory structure

```text
sonar-osr-web/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI routes
│   │   ├── inference.py        # OSRPredictor wrapper
│   │   ├── preprocessing.py    # median, CLAHE, physics, noise simulation
│   │   └── models.py           # ResNet-50 and EmbeddingNet architectures
│   ├── artifacts/
│   │   ├── resnet50_baseline.pth
│   │   ├── embedding_model.pth
│   │   ├── centroids.npz       # SVDD (2048-D) and DML (128-D) centroids
│   │   └── config.json         # class names, thresholds, normalisation
│   ├── requirements.txt        # fastapi, torch (cpu), torchvision, pillow, numpy
│   └── Dockerfile              # Hugging Face Spaces CPU image
│
├── frontend/
│   ├── public/
│   │   ├── samples/            # bundled known and unknown sonar images
│   │   ├── figures/            # exported dashboard PNGs
│   │   └── data/
│   │       └── results.json    # pre-exported benchmark data
│   ├── src/
│   │   ├── assets/             # icons, Bahria University crest
│   │   ├── styles/
│   │   │   ├── tokens.css      # colour, glass and radius variables
│   │   │   ├── glass.css       # .glass, .glass--card, .glass--float, .plate, .inset, fallbacks
│   │   │   └── main.css        # layout and typography
│   │   ├── components/
│   │   │   ├── Backdrop.jsx    # fixed sonar backdrop layer
│   │   │   ├── Navigation.jsx  # glass top bar with model status
│   │   │   ├── Footer.jsx
│   │   │   ├── ui/
│   │   │   │   └── GlassPanel.jsx   # tier prop: shell | card | float
│   │   │   ├── charts/
│   │   │   │   ├── RocCurve.jsx
│   │   │   │   ├── MarginGauge.jsx
│   │   │   │   ├── CentroidBars.jsx
│   │   │   │   ├── ThresholdExplorer.jsx
│   │   │   │   └── ConfusionMatrix.jsx
│   │   │   └── simulation/
│   │   │       ├── AuvPatrol.jsx
│   │   │       └── PhysicsInspector.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── LiveDemo.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PipelineLab.jsx
│   │   │   ├── Mission.jsx
│   │   │   ├── Methods.jsx
│   │   │   ├── Dataset.jsx
│   │   │   ├── Discovery.jsx   # v2
│   │   │   └── About.jsx
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 7. Build order

Priority: **Must** is needed for supervisor review, **Should** is strongly recommended, **Stretch** can be cut.

```text
Phase 1: Foundation (day 1)                                          
  Step 0   Export results.json and sample images from the notebook       Must
  Step 1   FastAPI backend, verify /api/predict on localhost:8000        Must

Phase 2: Frontend core and glass system (days 2-3)
  Step 2   Vite + React project, tokens.css, glass.css, Backdrop,
           GlassPanel, with fallback and reduced-transparency checks     Must
  Step 3   Home page: radar sweep hero and KPI strip                     Must
  Step 4   Live demo: showdown, strictness control, margin gauge         Must

Phase 3: Research dashboard (days 4-5)
  Step 5   ROC, PR curves and confusion matrices (D3 SVG)                Must
  Step 6   Threshold explorer (client-side τ scrubbing)                  Should
  Step 7   Centroid distance bars and embedding explorer                 Should

Phase 4: Simulation labs (days 6-7)
  Step 8   AUV patrol simulator                                          Stretch
  Step 9   Ocean noise and turbidity lab                                 Stretch
  Step 10  Highlight and shadow inspector                                Stretch

Phase 5: Documentation and deployment (days 8-9)
  Step 11  Methods, Dataset and About pages                              Must
  Step 12  Backend to Hugging Face Spaces (Docker, CPU)                  Must
  Step 13  Frontend to Vercel                                            Must
  Step 14  Responsive, cross-browser, contrast and scroll-performance QA Must
```

---

## 8. Definition of done

The platform is ready for supervisor review when:

1. **Accurate verification:** a known propeller is returned as known with confidence above 90%; an unseen chain or valve is flagged unknown under SVDD and DML.
2. **Numeric fidelity:** every dashboard metric matches `outputs/results/all_results.json` (for example AUROC 0.9255 and FPR 11.71%).
3. **Speed targets:** first paint under 1.5 s and inference under 300 ms, both measured on the deployed CPU Space. These are targets to verify, not guarantees, and the first request after idle will be slower because free Spaces sleep.
4. **Mobile:** no horizontal scroll or broken gauges down to 360 px width.
5. **Glass quality:** body text meets 4.5:1 contrast on every glass tier, measured on the composite over the brightest backdrop region.
6. **Fallbacks:** the site is fully readable with `backdrop-filter` disabled and with reduced-transparency or high-contrast preferences on.
7. **Performance:** no more than three blurred layers in view at once, and scrolling stays smooth on a mid-range phone.

---

## Revision notes

Changes made to the previous design document in addition to the glassmorphism restyle:

1. **Dataset counts:** known images are 1,766 (not 1,820) and unknown images are 598 (not 544). The KPI "Evaluation images: 2,364" is the full dataset; the test set is 271 known + 598 unknown.
2. **Phase 2 turntable:** 17 object classes and 4,756 images, because the rotating-platform class (186 images) is excluded. The tab stays hidden until the run is complete.
3. **SVDD naming:** the implemented method is nearest-centroid scoring in 2048-D, not a trained Deep SVDD hypersphere, so it is labelled "one-class SVDD (nearest centroid)".
4. **Thresholds:** the SVDD threshold is −13.17 (from the notebook). The DML threshold is read from `config.json`. The earlier typed values (−0.684, −0.712, −0.550, −0.850) were not exported values.
5. **One τ for three methods:** replaced with a strictness level mapped to each method's own τ.
6. **DML per-class detection:** the earlier values (71, 76, 78, 74) were not exported. They are set to `null` until re-exported.
7. **API example:** the earlier example listed "valve" (an unknown class) as the top known match and had a score that disagreed with its distances. It is rewritten consistently.
8. **Triplet loss description:** now matches the implementation (margin 0.2, cosine distance, hard-triplet mining) instead of MultiSimilarity mining.
9. **Status badge:** reports `/api/health`, not a live sensor.
10. **Page numbering and endpoints:** one consistent numbering (nine routes) and one set of endpoint names (`/api/simulate-noise`, `/api/unknowns/cluster`). `Mission.jsx` and `Discovery.jsx` were added to the file tree.
11. **Artifacts:** the file tree lists the four deploy files produced by the notebook, instead of one bundled `osr_checkpoint.pth`.
12. **Muted text colour:** `#64748B` replaced by `#94A3B8` for text (contrast fix).
13. **Priorities:** build order now carries Must / Should / Stretch tags.
