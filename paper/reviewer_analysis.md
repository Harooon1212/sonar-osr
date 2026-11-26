# Reviewer Analysis

## Executive Summary
- Current likely reviewer stance: Weak Accept to Accept (local IEEE conference: IBCAST / ICET / INMIC / FIT), provided scope boundaries stay explicit.
- Strongest part of the paper: The coherent end-to-end diagnostic linking Global Centroid SVDD collapse (`0.2371` AUROC), Nearest-Centroid multi-prototype recovery (`0.9175`), MSP confidence pile-up near `0.9980`, and consistent superiority of cosine triplet learning on $S^{127}$ (`0.9603` AUROC, `0.9235` AP) on a clean leak-free FLS benchmark.
- Highest rejection risk: Operating thresholds ($\tau^*$) use Youden's $J$ evaluated on the test ROC curve (`seed=42` single run), and `EmbeddingNet` unfreezes all `24,623,808` parameters whereas baseline ResNet-50 freezes `layer1`/`layer2`. Both are openly documented in Section V (Limitations) rather than hidden.
- Recommended next decision: Compile `paper/main.tex` on Overleaf to confirm exact page count ($\le 6$ pages) and visual legibility of Figs. 1, 3, 4, and 6.

## Three-Lens Assessment

| Lens | Concern ID | Observation & Evidence Location | Severity | Handling in Manuscript |
| :--- | :--- | :--- | :--- | :--- |
| Methodology | M1 | `EmbeddingNet` wraps ResNet via `nn.Sequential`, leaving `layer1`/`layer2` unfrozen (`24,623,808` trainable vs `23,124,806` in baseline; `experiment_inventory.md`) | Medium | Reported transparently in Section III-E and explicitly qualified in Section V Item 2 |
| Methodology | M2 | OpenMax and Class-Balanced OpenMax from prior sonar OSR work~\cite{bendale_2016_openmax,li_2026_copenmax} were not run on this split | Low-Medium | Positioned in Section II-B as complementary EVT calibration work and listed in Section V Item 3 |
| Statistics & Evidence | S1 | Single deterministic split/training seed (`seed = 42`) without multi-seed standard deviation | Medium | Declared in Section V Item 1; no variance claims made |
| Statistics & Evidence | S2 | Thresholds $\tau^*$ selected on test ROC via Youden's $J$ | Medium | Declared in Section V Item 1; AUROC and AP emphasized alongside operating-point metrics |
| Domain & Positioning | D1 | Controlled MD-FLS water-tank domain only; cross-domain Turntable subset (18 classes) unexecuted in clean run | Medium | Scoped strictly to `watertank-cropped` in Abstract, Section I, and Section V Item 3 |
| Domain & Positioning | D2 | All 3 methods reach `100.00%` on `shampoo-bottle` & `standing-bottle` at Youden $\tau^*$ (`msp_distributions.png` explains MSP relies on $\tau^*=0.9980$ at cost of 35 known FN) | Low | Clarified accurately in Section IV-E rather than claiming MSP fails completely on `standing-bottle` |

## Self-Review Statement
The paper is strongest on empirical consistency (`all_results.json`, `numeric_evidence.json`, `citation_lock.json`) and geometric diagnosis of Global SVDD collapse (`0.2371` vs. `0.9175`) alongside DML dominance (`0.9603` AUROC, `0.9235` AP). The highest remaining reviewer risk is single-seed, test-ROC threshold calibration and the unexecuted cross-domain turntable split. Claims intentionally weakened or omitted: no cross-domain generalization claims, no multi-seed variance claims, and no unrecorded epoch-loss tables. No mechanical citation or numeric blocker remains in the Overleaf source package; local PDF compilation is blocked solely by absence of a local TeX installation on Windows.
