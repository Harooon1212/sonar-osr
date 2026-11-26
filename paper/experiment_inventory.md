# Experiment Inventory

## 1. Benchmark / Dataset
- **Dataset:** Marine Debris Forward-Looking Sonar (MD-FLS), `watertank-cropped` subset acquired with a 3.0 MHz Sound Metrics ARIS Explorer 3000 sonar.
- **Total images:** 2,364 valid 4-channel RGBA image patches across 10 object categories (0 corrupted).
- **Known classes ($K=6$, 1,766 total):** `bottle` (449), `can` (367), `tire` (331), `drink-carton` (349), `hook` (133), `propeller` (137).
- **Unknown classes ($U=4$, 598 total):** `chain` (226), `valve` (208), `shampoo-bottle` (99), `standing-bottle` (65). Notice `shampoo-bottle` and `standing-bottle` form a near-OOD morphological twin test against known `bottle`.
- **Deterministic Split (`seed = 42`):** Known classes split 70% / 15% / 15% into `1,233` train / `262` validation / `271` known test (0 file overlap across splits). Unknown classes held strictly for testing (`598`), yielding `869` combined OSR test samples (`271` known + `598` unknown).

## 2. Task Setting & Preprocessing
- **Preprocessing (`preprocess_sonar`):** `RGBA -> RGB`, grayscale conversion, $3\times 3$ median blur (`cv2.medianBlur`), CLAHE (`clipLimit=2.0`, `tileGridSize=(8,8)`), 3-channel replication (`GRAY2RGB`), `Resize(224,224)`, ImageNet mean/std normalization.
- **Training augmentation:** `RandomHorizontalFlip(0.5)`, `RandomVerticalFlip(0.3)`, `RandomRotation(15)`, `ColorJitter(brightness=0.2, contrast=0.2)`. Test/val use deterministic resize and normalization only.
- **Class balancing:** Inverse-frequency loss weights $w_k = N_{\text{train}} / (K N_k)$ ranging from `0.6545` (`bottle`) to `2.2097` (`hook`) for baseline cross-entropy.

## 3. Evaluated Models & Baselines
- **Closed-set Backbone (`build_resnet50`):** ImageNet-1K pretrained ResNet-50 (`layer1`, `layer2` frozen: `1,435,392` frozen / `23,124,806` trainable / `24,560,198` total), MLP head `Dropout(0.3)-Linear(2048,512)-ReLU-Dropout(0.2)-Linear(512,6)`, Adam (`lr=1e-4`, `wd=1e-4`), StepLR(`7, 0.5`), EarlyStopping(`patience=5`). Converged in 12 epochs (`99.2%` best val acc; `99.26%` / `269/271` test accuracy).
- **Method 1 (MSP Threshold):** Post-hoc max softmax probability over 6 classes.
- **Method 2 (One-Class SVDD Variants over 2048-D GAP features):**
  - 2A: L2-normalized `OneClassSVM(kernel='rbf', nu=0.1, gamma='scale')`.
  - 2B: Global Centroid Hypersphere $S_{\text{global}}(z) = -\|z - c\|_2$.
  - 2C: Nearest Class Centroid $S_{\text{nearest}}(z) = -\min_k \|z - c_k\|_2$.
- **Method 3 (Hyperspherical Deep Metric Learning, `EmbeddingNet`):** ResNet-50 trunk wrapped via `nn.Sequential` + `Linear(2048,512)-BatchNorm1d(512)-ReLU-Dropout(0.3)-Linear(512,128)` + L2 unit normalization onto $S^{127}$. All `24,623,808` parameters fine-tuned end-to-end with cosine `TripletMarginLoss(margin=0.2)` and online hard `TripletMarginMiner(margin=0.2)`. Scored via negated Euclidean distance to nearest known training centroid.

## 4. Metrics & Operating Thresholds
- AUROC ($\uparrow$), Average Precision AP ($\uparrow$), TPR / Known Acceptance ($\uparrow$), FPR / Unknown False Acceptance ($\downarrow$), UDR = $1 - \text{FPR}$ ($\uparrow$), calibrated at Youden's $J$ threshold $\tau^* = \arg\max_\tau(\text{TPR}(\tau) - \text{FPR}(\tau))$.

## 5. Verified Main Numbers (`paper/data/all_results.json` & `dataset_and_baseline.json`)
- Closed-set ResNet-50: `269/271` (`99.26%`), Macro F1 = `0.9918`; DML nearest-centroid known accuracy = `100.00%` (`1.0`).
- MSP: AUROC `0.9069`, AP `0.7747`, TPR `0.8708`, FPR `0.1455`, UDR `0.8545`, $\tau^* = 0.9980$, TP/FN/TN/FP = `236/35/511/87` (`chain` 66.37%, `valve` 94.71%, `shampoo-bottle` 100.0%, `standing-bottle` 100.0%).
- SVDD OC-SVM: AUROC `0.6982`, AP `0.3943`, TPR `0.9926`, FPR `0.5100`, UDR `0.4900`.
- SVDD Global Centroid: AUROC `0.2371`, AP `0.2064`, TPR `0.9815`, FPR `0.9298`, UDR `0.0702`.
- SVDD Nearest Centroid: AUROC `0.9175`, AP `0.8568`, TPR `0.8856`, FPR `0.1405`, UDR `0.8595`, $\tau^* = -13.8392$, TP/FN/TN/FP = `240/31/514/84` (`chain` 70.80%, `valve` 91.35%, `shampoo-bottle` 100.0%, `standing-bottle` 100.0%).
- DML: AUROC `0.9603`, AP `0.9235`, TPR `0.9077`, FPR `0.0987`, UDR `0.9013`, $\tau^* = -0.2378$, TP/FN/TN/FP = `246/25/539/59` (`chain` 80.53%, `valve` 92.79%, `shampoo-bottle` 100.0%, `standing-bottle` 100.0%).

## 6. Variance, Caveats & Unexecuted Scope
- Single deterministic seed (`seed=42`) on the clean Kaggle run; multi-seed error bars are absent and declared as a limitation.
- Youden thresholds $\tau^*$ are selected on the test ROC curve (upper-bound operating-point calibration).
- Cross-domain MD-FLS Turntable evaluation (18 classes) was not executed in this clean run and is left as future work.
- Raw stdout per-epoch DML loss tables and raw 2048-D centroid L2 norm printouts were not serialized into `paper_results/` and are excluded.
