# Figure Plan

| Figure Label | File | Class | Role | Message | Layout | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fig:overview` | `figures/fig_overview.png` | concept-method | Architecture overview | Contrasts MSP and 2048-D SVDD (Global Center vs. Class Centroids) against end-to-end $S^{127}$ `EmbeddingNet` | Double-column 5-stage flow (`0.72\textwidth`) | Verified PNG ready |
| `fig:preproc` | `figures/preprocessing_example.png` | evidence-result | Preprocessing effect | Median blur + CLAHE suppresses speckle and clarifies contours on `bottle` | Single-column 1x3 strip (`0.92\linewidth`) | Verified PNG ready |
| `fig:all_comp` | `figures/osr_roc_pr_comparison.png` | evidence-result | Unified OSR benchmark | DML leads ROC (`0.9603`) and PR (`0.9235`) across operating thresholds (redundant bar panel removed) | Double-column 1x2 comparison (`0.68\textwidth`) | Verified cropped PNG ready |
| `fig:svdd_dash` | `figures/svdd_failure_panels.png` | evidence-result | SVDD collapse diagnosis | Global Centroid (`0.2371`) collapses below random while Nearest Centroid (`0.9175`) separates score distributions | Double-column 1x2 plot (`0.64\textwidth`) | Verified cropped PNG ready |
| `fig:msp_dist` | `figures/msp_distributions.png` | evidence-result | MSP failure diagnosis | Dense unknown accumulation near `1.0` forces $\tau^* = 0.9980$ | Single-column 1x2 plot (`0.92\linewidth`) | Verified PNG ready |
| `fig:tsne` | `figures/dml_tsne_visualization.png` | evidence-result | Manifold geometry | t-SNE confirms tight known clusters and peripheral/interstitial unknown separation | Double-column 1x2 scatter (`0.70\textwidth`) | Verified PNG ready |

Note: `class_distribution.png`, `all_methods_unknown_detection.png`, and `confusion_matrix_baseline.png`, as well as the redundant bar/confusion/summary panels of `all_methods_comparison.png` and `svdd_complete_dashboard.png`, were omitted so no figure duplicates counts or metrics already tabulated in Tables I-IV (originals remain untouched in `paper_figures/`).
