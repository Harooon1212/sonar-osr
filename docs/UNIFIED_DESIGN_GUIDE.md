# SonarOSR: Unified Full-Stack Architecture & Design Guide
**Open-Set Recognition for Underwater Forward-Looking Sonar (FLS) Imagery**  
*Department of Computer Science, Bahria University, Islamabad*  
* **Authors:** Mohammad Khizar Hayat Cheema (01-134231-039), Muhammad Haroon (01-134231-052)  
* **Supervisor:** Dr. Arif Ur Rahman  
* **Date:** November 2026  

---

## 1. Executive Summary & Architectural Vision

The **SonarOSR** platform is a full-stack, research-grade evaluation and demonstration platform. It combines the rigorous **7-page Web Build Plan** (Vite + React, custom dark naval aesthetics, D3.js SVG visualizations, FastAPI) with all the specialized **research workbench modules** developed in our Python pipeline (interactive AUV patrol simulation, ocean speckle noise simulator, sonar physics highlight/shadow segmentation, dynamic threshold tuning, and multi-model paradigm showdowns).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT-SIDE (REACT + VITE)                              │
│                                                                                        │
│   [Page 1: Home & Hero]   [Page 2: Live Demo & Showdown]  [Page 3: Research Dashboard] │
│   [Page 4: Pipeline Lab]  [Page 5: Methods & Math]        [Page 6: Dataset & Physics]  │
│   [Page 7: AUV Simulator] [Page 8: Unknown Discovery]     [Page 9: About & References] │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON API
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SERVER-SIDE (FASTAPI + PYTORCH)                           │
│                                                                                        │
│   GET /api/health     GET /api/meta        POST /api/predict     GET /api/samples      │
│   POST /api/physics   POST /api/noise-sim  GET /api/unknowns     POST /api/cluster     │
│                                                                                        │
│   Core Engine: OSRPredictor (src/inference.py) + Preprocessor (src/preprocessing.py)   │
│   Artifacts:   osr_checkpoint.pth (ResNet-50 + EmbeddingNet + Centroids + Thresholds)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design System & Visual Tokens

The user interface rejects generic AI dashboard templates and conforms to an authentic **naval acoustic research station** aesthetic.

### 2.1 Color Palette
* **Background (`--bg-base`):** `#0A0F1E` (Ultra-deep abyss navy)
* **Surface / Cards (`--bg-surface`):** `#0D1829` (Submerged panel surface)
* **Surface Alt / Elevated (`--bg-elevated`):** `#132238` (Active card / highlight surface)
* **Borders / Separators (`--border-subtle`):** `#1E2E48`
* **Naval Accent (`--accent-blue`):** `#1B3A6B` (Sonar primary)
* **Highlight / Glow (`--glow-cyan`):** `#38BDF8` / `#60A5FA` (Active beams, operating points)
* **Acoustic Highlight (`--highlight-green`):** `#10B981` (Direct target backscatter peak)
* **Acoustic Shadow (`--shadow-purple`):** `#A855F7` (Beam occlusion zone)
* **Anomaly / Unknown (`--alert-red`):** `#EF4444` (Out-of-distribution alert)
* **Text Primary (`--text-main`):** `#E2E8F0`
* **Text Muted (`--text-muted`):** `#64748B`

### 2.2 Typography
* **Headings (`--font-heading`):** `Space Grotesk`, sans-serif (Technical, crisp, architectural)
* **Body / UI (`--font-body`):** `Inter`, sans-serif (Clean, readable at all sizes)
* **Data / Metrics / Thresholds (`--font-mono`):** `JetBrains Mono`, monospace (Strictly for scores, matrices, coordinates)

### 2.3 Strict Design Principles
1. **Sentence-case throughout:** Use "Known marine debris", not "KNOWN MARINE DEBRIS".
2. **Restrained animation:** Exactly one subtle radar sweep animation in the Hero. No distracting hover shakes on cards.
3. **Typography integrity:** No single-word colored gradient text in headings.
4. **No AI-slop gradients:** Flat, high-contrast dark surfaces with functional borders.
5. **Mobile & accessibility compliant:** Full responsive flex/grid layouts down to 360px viewport width.

---

## 3. Information Architecture & Page Specifications

The platform is organized into **seven core pages** plus two specialized tools:

```
Navigation Hierarchy:
├── / (Home & Overview)
├── /demo (Live OSR Classifier & 3-Paradigm Showdown)
├── /dashboard (Research Benchmark, ROC/PR Curves, Threshold Explorer)
├── /pipeline (Sonar Preprocessing, Ocean Noise & Physics Lab)
├── /mission (AUV Autonomous Patrol Simulator)
├── /methods (Theoretical Foundations & Equations)
├── /dataset (Marine Debris FLS & ARIS 3000 Sensor Specs)
├── /discovery (Unknown Discovery & Incremental Clustering - v2)
└── /about (Team, Supervisors, Citations)
```

---

### Page 1: Home (`/`)
* **Acoustic Hero:** Real Forward-Looking Sonar image embedded inside a circular or sector radar viewport with a subtle, continuous $360^\circ$ sweep line.
* **Live System Status:** Status indicator badge (`🟢 SENSOR ONLINE · ARIS EXPLORER 3000`).
* **Problem Narrative:** Concise statement explaining the closed-set failure mode: *Conventional classifiers assign high-confidence known categories to unmapped underwater targets, creating catastrophic risks for autonomous submersibles.*
* **Benchmark KPI Strip:** Read dynamically from `results.json`:
  * Best AUROC: `0.9255` (Deep Metric Learning)
  * Safest False Positive Rate: `11.71%` (Deep SVDD)
  * Known Class Recall (TPR): `94.10%`
  * Evaluation Images: `2,364`
* **Interactive Pipeline Strip:** Visual 5-stage schematic:
  `Raw Sonar Frame` $\rightarrow$ `Hybrid Median/CLAHE` $\rightarrow$ `ResNet-50 GAP (2048-D)` $\rightarrow$ `Open-Set Boundary` $\rightarrow$ `Decision`.

---

### Page 2: Live Demo & Paradigm Showdown (`/demo`)
* **Input Zone:**
  * Drag-and-drop file uploader (supports PNG, JPG, BMP, RGBA conversion).
  * Bundled demo gallery with 6 known samples (*Propeller, Bottle, Tire, Can, Drink-carton, Hook*) and 4 unknown samples (*Chain, Valve, Shampoo-bottle, Standing-bottle*).
* **Operational Risk Preset & Threshold Slider ($\tau$):**
  * Presets: *Defense / High-Security ($\tau = -0.550$)*, *Balanced Research ($\tau = -0.712$)*, *High-Recall ($\tau = -0.850$)*.
  * Draggable slider updating the decision boundary in real time.
* **Side-by-Side 3-Method Showdown:**
  * **Card 1: Baseline MSP (Softmax):** Displays predicted class, probability bar, and highlights overconfidence error if unknown.
  * **Card 2: Deep SVDD (Centroid Radius):** Displays centroid Euclidean distance, margin to threshold, and hypersphere verdict.
  * **Card 3: Deep Metric Learning (Triplet Loss):** Displays metric embedding distance, margin gauge, and compact cluster verdict.
* **Margin-to-Threshold ($\text{Score} - \tau$) Gauge:**
  * A horizontal diverging gauge centered at 0:
    * **Positive (Right, Green):** Known Region ($\text{Score} \ge \tau$).
    * **Negative (Left, Red):** Out-of-Distribution Region ($\text{Score} < \tau$).
* **Latent Centroid Distances (D3 SVG):**
  * Bar chart showing distances to all 6 known class centroids with a dynamic red dashed line for active $\tau$.
* **1-Click Mission Log Export:** Button exporting a formatted `.txt` or `.json` inspection report.

---

### Page 3: Research Dashboard (`/dashboard`)
Divided into tabs for deep academic evaluation:
1. **Overview:** Complete comparison table with winners highlighted for AUROC, AP, TPR, FPR, and UDR.
2. **Curves (D3 SVG):**
   * ROC Curves (FPR vs TPR) for all three methods with interactive hover crosshairs.
   * Precision-Recall (PR) Curves with operating points.
3. **Confusion Matrices:**
   * Interactive normalized heatmap for Baseline ResNet-50, Deep SVDD, and Deep Metric Learning (including the explicit "Unknown" column).
4. **Unknown Detection Breakdown:**
   * Grouped bar chart comparing detection rates for *Chain*, *Valve*, *Shampoo-bottle*, and *Standing-bottle*.
5. **Threshold Explorer (Client-Side D3):**
   * Drag $\tau$ across the dual score histogram (Known distribution vs Unknown distribution).
   * Dynamically recomputes TPR, FPR, and UDR instantly in the browser without server roundtrips.
6. **Latent Space Embedding Explorer:**
   * Interactive 2D scatter plot using pre-fitted **PCA / UMAP** coordinates.
   * Projects newly uploaded query images as glowing pulsing points onto the scatter.
7. **Training Dynamics:**
   * Epoch loss and accuracy curves for Baseline ResNet-50 and Triplet Loss miners.
8. **Phase 2 Turntable Evaluation:**
   * Cross-domain generalization metrics across 18 classes and 4,942 images.

---

### Page 4: Sonar Preprocessing & Physics Lab (`/pipeline`)
* **Ocean Noise & Turbidity Simulator:**
  * Sliders for **Multiplicative Speckle Noise ($\sigma$)** and **Turbidity / Backscatter Attenuation**.
  * Shows real-time restoration via Median filtering + CLAHE contrast normalization.
* **Acoustic Highlight & Shadow Inspector:**
  * Splits the image into:
    * **Highlight Zone (Green Overlay):** Direct specular backscatter.
    * **Occlusion Shadow (Purple Overlay):** Acoustic beam blockage.
  * Displays **Highlight-to-Shadow Ratio** and area percentages.
* **Interactive Before / After Split Slider:**
  * Interactive swipe handle comparing raw sonar to preprocessed acoustic representation.

---

### Page 5: AUV Autonomous Patrol Simulator (`/mission`)
* **Concept:** Interactive simulation of an Autonomous Underwater Vehicle (AUV) cruising along a seabed survey grid.
* **Interface:**
  * Map / Sonar track timeline.
  * Speed and sensor frequency toggles (3.0 MHz vs 1.8 MHz).
  * Sequential target encounter sequence:
    * *Propeller (Known)* $\rightarrow$ Cataloged, vehicle continues cruise.
    * *Tire (Known)* $\rightarrow$ Cataloged, vehicle continues cruise.
    * *Unmapped Chain / Obstacle (Novel)* $\rightarrow$ **🚨 Collision Alert! OSR engine rejects target $\rightarrow$ AUV computes avoidance waypoint.**

---

### Page 6: Theoretical Methods & Mathematics (`/methods`)
Academic reference documentation:
* **Method 1 (MSP):** Mathematical formulation, posterior probability limits, calibration challenges.
* **Method 2 (Deep SVDD):** 2048-D GAP embedding space, class centroid formulation:
  $$C_k = \frac{1}{N_k}\sum_{i=1}^{N_k} f(x_i)$$
* **Method 3 (Deep Metric Learning):** Triplet Margin Loss with MultiSimilarity online mining:
  $$\mathcal{L} = \max\left(0, \|f(a) - f(p)\|_2 - \|f(a) - f(n)\|_2 + \alpha\right)$$
* **Decision Rule (Equation 2):**
  $$\hat{y} = \begin{cases} \arg\min_k \|f(x) - C_k\|_2 & \text{if } \min_k \|f(x) - C_k\|_2 < \tau \\ \text{UNKNOWN} & \text{if } \min_k \|f(x) - C_k\|_2 \ge \tau \end{cases}$$

---

### Page 7: Dataset & Hardware Specifications (`/dataset`)
* **Hardware Specs:** ARIS Explorer 3000 high-definition acoustic camera:
  * Operating Frequency: 3.0 MHz (Identification) / 1.8 MHz (Detection)
  * Beam Count: 128 beams, 0.25° angular resolution
* **Dataset Organization:** Marine Debris Forward-Looking Sonar (MD-FLS):
  * Known Classes ($C_{\text{known}}$): *Bottle, Can, Tire, Drink-carton, Hook, Propeller*
  * Unknown Classes ($C_{\text{unknown}}$): *Chain, Valve, Shampoo-bottle, Standing-bottle*
  * Class counts, image dimensions, and verified zero-leakage splits.

---

### Page 8: Unknown Discovery (v2 Roadmap) (`/discovery`)
* **Workflow:**
  1. Rejected unknown frames are accumulated in an SQLite anomaly pool.
  2. DBSCAN clustering on the 128-D embeddings identifies candidate novel clusters.
  3. Operator reviews the cluster montage and names the category.
  4. New cluster centroid is added directly into the model without full retraining.

---

### Page 9: About & Citations (`/about`)
* Bahria University Computer Science Department credentials.
* Team bios and supervisor acknowledgement.
* BibTeX citations for Valdenegro-Toro (MD-FLS), He et al. (ResNet), and Scheirer / Bendale (OSR).

---

## 4. Backend REST API Specification

Built with **FastAPI** (`backend/app/main.py`), utilizing [`src/inference.py`](file:///d:/OSR%20of%20SONAR%20images/src/inference.py).

### Endpoints:

#### 1. `GET /api/health`
* **Response:** `{"status": "online", "model_loaded": true, "device": "cpu"}`

#### 2. `GET /api/meta`
* **Response:**
  ```json
  {
    "known_classes": ["bottle", "can", "tire", "drink-carton", "hook", "propeller"],
    "unknown_classes": ["chain", "valve", "shampoo-bottle", "standing-bottle"],
    "thresholds": {"msp": 0.9887, "svdd": -0.6840, "dml": -0.7120},
    "metrics": {"dml_auroc": 0.9255, "svdd_fpr": 0.1171, "dml_tpr": 0.9410}
  }
  ```

#### 3. `POST /api/predict`
* **Request:** Multipart `file` (image) + Form parameters `method` (`"dml"`|`"svdd"`|`"msp"`) + optional `custom_tau` (float).
* **Response:**
  ```json
  {
    "is_known": false,
    "verdict": "UNKNOWN / NOVEL OBJECT",
    "predicted_class": "UNKNOWN_OBJECT",
    "top_known_match": "valve",
    "confidence": 0.117,
    "anomaly_score": 0.883,
    "threshold": -0.712,
    "margin_to_threshold": -0.171,
    "method_used": "Deep Metric Learning",
    "centroid_distances": {
      "bottle": 1.45, "can": 1.52, "tire": 1.62,
      "drink-carton": 1.41, "hook": 1.70, "propeller": 1.58
    },
    "showdown": {
      "msp": {"verdict": "can (Overconfident Error)", "confidence": 0.784, "is_known": true},
      "svdd": {"verdict": "UNKNOWN", "anomaly_score": 0.876, "is_known": false},
      "dml": {"verdict": "UNKNOWN", "anomaly_score": 0.918, "is_known": false}
    }
  }
  ```

#### 4. `POST /api/physics`
* **Request:** Image file.
* **Response:**
  ```json
  {
    "highlight_percentage": 14.2,
    "shadow_percentage": 22.8,
    "highlight_to_shadow_ratio": 0.62,
    "overlay_image_base64": "data:image/png;base64,..."
  }
  ```

#### 5. `POST /api/simulate-noise`
* **Request:** Image file + `speckle_intensity` (float) + `turbidity` (float).
* **Response:** Base64 noisy image and base64 restored preprocessed image.

#### 6. `GET /api/samples`
* **Response:** List of bundled image samples with pre-calculated thumbnails and labels.

---

## 5. Pre-Exported Static Data (`results.json`)

To guarantee zero latency on the frontend, all benchmark curves, histograms, and matrices are pre-computed and stored in `frontend/public/data/results.json`:

```json
{
  "summary": {
    "total_images": 2364,
    "known_count": 1820,
    "unknown_count": 544,
    "winners": {"auroc": "dml", "fpr": "svdd", "tpr": "dml", "ap": "dml"}
  },
  "methods": {
    "msp": {"auroc": 0.8165, "ap": 0.5782, "tpr": 0.8487, "fpr": 0.3177, "udr": 0.6823, "tau": 0.9887},
    "svdd": {"auroc": 0.8986, "ap": 0.8275, "tpr": 0.8413, "fpr": 0.1171, "udr": 0.8829, "tau": -0.6840},
    "dml": {"auroc": 0.9255, "ap": 0.8448, "tpr": 0.9410, "fpr": 0.2525, "udr": 0.7475, "tau": -0.7120}
  },
  "curves": {
    "msp_roc": [[0.0, 0.0], [0.1, 0.45], [0.3177, 0.8487], [1.0, 1.0]],
    "svdd_roc": [[0.0, 0.0], [0.05, 0.62], [0.1171, 0.8413], [1.0, 1.0]],
    "dml_roc": [[0.0, 0.0], [0.08, 0.81], [0.2525, 0.9410], [1.0, 1.0]]
  },
  "per_class_unknown_detection": {
    "chain": {"msp": 60.0, "svdd": 76.0, "dml": 71.0},
    "valve": {"msp": 85.0, "svdd": 93.0, "dml": 76.0},
    "shampoo-bottle": {"msp": 57.0, "svdd": 99.0, "dml": 78.0},
    "standing-bottle": {"msp": 63.0, "svdd": 100.0, "dml": 74.0}
  },
  "score_histograms": {
    "dml_known_scores": [-0.2, -0.25, -0.31, -0.42, -0.55],
    "dml_unknown_scores": [-1.1, -1.25, -1.35, -1.42, -1.68]
  }
}
```

---

## 6. Directory Structure

```text
sonar-osr-web/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application routes
│   │   ├── inference.py        # Independent OSRPredictor wrapper
│   │   ├── preprocessing.py    # Denoising, CLAHE, physics & noise simulation
│   │   └── models.py           # ResNet-50 & EmbeddingNet architectures
│   ├── artifacts/
│   │   ├── osr_checkpoint.pth  # Model bundle weights + centroids + tau
│   │   └── config.json         # Class names and metadata
│   ├── requirements.txt        # FastAPI, torch-cpu, torchvision, pillow, numpy
│   └── Dockerfile              # Hugging Face Spaces CPU deployment image
│
├── frontend/
│   ├── public/
│   │   ├── samples/            # Bundled known and unknown sonar images
│   │   ├── figures/            # High-res master dashboards (.png)
│   │   └── data/
│   │       └── results.json    # Pre-exported benchmark arrays for D3
│   ├── src/
│   │   ├── assets/             # SVG icons, Bahria University crest
│   │   ├── styles/
│   │   │   ├── tokens.css      # Custom dark navy CSS variables
│   │   │   └── main.css        # Clean responsive styles
│   │   ├── components/
│   │   │   ├── Navigation.jsx  # Top bar with status indicator
│   │   │   ├── Footer.jsx      # Credits and supervisor acknowledgement
│   │   │   ├── charts/
│   │   │   │   ├── RocCurve.jsx            # D3 interactive SVG ROC chart
│   │   │   │   ├── MarginGauge.jsx         # Diverging Score - tau gauge
│   │   │   │   ├── CentroidRadar.jsx       # D3 centroid distance bar meter
│   │   │   │   ├── ThresholdExplorer.jsx   # Interactive histogram scrub
│   │   │   │   └── ConfusionMatrix.jsx     # SVG normalized heatmap
│   │   │   └── simulation/
│   │   │       ├── AuvPatrol.jsx           # Mission mode patrol simulator
│   │   │       └── PhysicsInspector.jsx    # Highlight & shadow segmentation
│   │   ├── pages/
│   │   │   ├── Home.jsx                    # Hero with radar sweep + pipeline
│   │   │   ├── LiveDemo.jsx                # Classifier dropzone & showdown
│   │   │   ├── Dashboard.jsx               # Benchmark research tabs
│   │   │   ├── PipelineLab.jsx             # Noise simulator & physics lab
│   │   │   ├── Methods.jsx                 # OSR mathematics & equations
│   │   │   ├── Dataset.jsx                 # Sensor specs & class grid
│   │   │   └── About.jsx                   # FYP project & author credentials
│   │   ├── lib/
│   │   │   └── api.js          # Fetch client communicating with FastAPI
│   │   ├── App.jsx             # React Router routing
│   │   └── main.jsx            # Vite entrypoint
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 7. Build Order & Step-by-Step Implementation Roadmap

```
Phase 1: Foundation (Day 1)
  ├── Step 0: Export results.json & sample images from current workspace
  └── Step 1: Initialize FastAPI backend & verify /api/predict on localhost:8000

Phase 2: Frontend Core (Days 2-3)
  ├── Step 2: Initialize Vite + React project with custom CSS design tokens
  ├── Step 3: Implement Home page with Radar Sweep Hero & Stats Strip
  └── Step 4: Implement Live Demo page with Paradigm Showdown & Margin Gauge

Phase 3: Deep Research Dashboard (Days 4-5)
  ├── Step 5: Implement D3 SVG ROC Curves, PR Curves, and Confusion Matrices
  ├── Step 6: Build the interactive client-side Threshold Explorer (tau scrubbing)
  └── Step 7: Build the Latent Centroid Distance Meter

Phase 4: Specialized Simulation Labs (Days 6-7)
  ├── Step 8: Build the AUV Autonomous Patrol Mission Simulator
  ├── Step 9: Build the Ocean Noise & Turbidity Injection Lab
  └── Step 10: Build the Sonar Physics Highlight & Shadow Inspector

Phase 5: Documentation & Deployment (Days 8-9)
  ├── Step 11: Implement Methods, Dataset, and About pages
  ├── Step 12: Deploy Backend to Hugging Face Spaces (Docker CPU)
  ├── Step 13: Deploy Frontend to Vercel (Production URL)
  └── Step 14: Mobile responsiveness and cross-browser QA testing
```

---

## 8. Definition of Done & Success Criteria

The full-stack platform is officially complete and ready for supervisor review when:
1. **Accurate Verification:** Uploading a known *Propeller* returns known with $>90\%$ confidence; uploading an unseen *Chain* or *Valve* triggers the **🚨 UNKNOWN / NOVEL OBJECT ALERT** under Deep SVDD and Deep Metric Learning.
2. **Numeric Fidelity:** Every metric in the dashboard matches the values in [`outputs/results/all_results.json`](file:///d:/OSR%20of%20SONAR%20images/outputs/results/all_results.json) (AUROC 0.9255, FPR 11.71%).
3. **Responsive & Fast:** First paint loads in $<1.5$ seconds; inference responds in $<300$ ms.
4. **Mobile Usability:** The site functions without horizontal scroll or broken gauges down to 360px viewport width.
