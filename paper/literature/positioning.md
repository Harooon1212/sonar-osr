# Positioning Analysis

## Closest Works
| Paper | Similarity | Difference | Risk if not discussed |
| :--- | :--- | :--- | :--- |
| Jiao et al. (2024) | Investigates open-set recognition on forward-looking sonar imagery under class imbalance | Evaluates calibration and logit mechanisms on NKSID rather than diagnosing SVDD radial-lobe collapse vs. $S^{127}$ triplet learning on MD-FLS | Reviewers may think sonar OSR has not been attempted recently |
| Li et al. (2026) | Extends OpenMax for long-tail open-set sonar recognition | Focuses on Weibull tail calibration and class priors rather than hyperspherical embedding boundaries | Must cite fairly as a complementary calibration-based sonar OSR approach |
| Vaze et al. (2022) | Analyzes closed-set classifier quality vs. open-set separability and near-OOD semantic shifts | Evaluated on natural RGB benchmarks rather than acoustic FLS speckle imagery | Need to position why strong closed-set accuracy (`99.26%`) still compresses MSP scores near `1.0` in FLS |
| Chong et al. (2020) | Examines collapse mechanisms of one-class deep hypersphere objectives | Analyzes training-time feature collapse rather than post-hoc Global Centroid vs. Nearest Centroid divergence on supervised FLS features | Connects our Global Centroid (`0.2371` AUROC) observation to broader one-class literature |
| Valdenegro-Toro et al. (2025) | Releases the Marine Debris Forward-Looking Sonar (MD-FLS) water-tank dataset used here | Focuses on closed-set multi-task benchmarks rather than open-set near-OOD mimicry diagnostics | Must credit sensor/dataset design and acknowledge unrun Turntable cross-domain split as future work |

## Our Position
- **Task boundary:** Single-frame 2D FLS open-set classification and unknown rejection on MD-FLS Watertank (`seed = 42`, `1,233` train / `262` val / `869` test).
- **Main distinction:** Combines an acoustically motivated near-OOD split (with `standing-bottle` and `shampoo-bottle` withheld against `bottle`) with a head-to-head comparison linking softmax compression, Global SVDD failure, Nearest-Centroid recovery, and end-to-end cosine triplet learning on $S^{127}$.
- **Claims to make:** Supported empirical rankings, confusion counts, per-unknown breakdown (`chain`, `valve`, `shampoo-bottle`, `standing-bottle`), and full backbone adaptation detail in `EmbeddingNet`.
- **Claims to avoid:** SOTA assertions over unrun OpenMax/NKSID baselines, multi-seed statistical variance claims, or open-ocean/Turntable generalization claims.
