# Paper Story

## Working Title
Hyperspherical Metric Learning and Failure Analysis of Confidence and Global-SVDD Boundaries for Open-Set Underwater Sonar Recognition

## Thesis
We evaluate open-set recognition on near-OOD forward-looking sonar debris imagery and show that hyperspherical deep metric learning on $S^{127}$ outperforms post-hoc confidence thresholding and latent SVDD on every metric while diagnosing why softmax compression and single-center SVDD break under acoustic mimicry.

## Task Boundary
- **Inputs:** Cropped 2D Forward-Looking Sonar (FLS) target bounding-box patches (`watertank-cropped`, 3.0 MHz ARIS Explorer 3000) preprocessed to $224\times 224$ tensors.
- **Outputs:** Binary open-set acceptance/rejection decision (known vs. unknown) plus known category assignment across $K=6$ trained debris classes.
- **Supported settings:** Single-frame 2D FLS patch OSR under deterministic disjoint known/unknown split (`1,233` train / `262` val / `869` test).
- **Out-of-scope settings:** Multi-ping temporal tracking, open-ocean reverberation / quarry field trials, cross-domain turntable inference (not run in this clean benchmark), and continual open-world class registration.

## Gap
Closed-set CNN classifiers achieve near-perfect in-distribution accuracy on sonar debris yet fail unsafely when unmodeled objects appear. Existing sonar OSR studies predominantly rely on softmax probability calibration or class-balanced OpenMax, leaving two geometric questions unanswered: why single-center one-class hyperspheres collapse on deep sonar features and whether end-to-end hyperspherical triplet metric learning resolves near-OOD acoustic mimicry without sacrificing closed-set accuracy.

## Technical Challenge
1. Forward-looking sonar patches lack color, exhibit multiplicative acoustic speckle, and vary widely in brightness and aspect ratio.
2. Physically distinct targets (`bottle` vs. `standing-bottle`, `shampoo-bottle`, and `chain`) share elongated bright highlights and acoustic shadows, producing high-confidence overlap in softmax space.
3. Cross-entropy training pushes known classes into separated peripheral feature lobes rather than a unimodal cluster around the global mean, violating single-center SVDD assumptions.

## Method Insight
Explicitly constraining representations onto the L2-normalized unit hypersphere $S^{127}$ with cosine-similarity Triplet Margin Loss and online hard mining aligns Euclidean nearest-centroid distance with angular class compactness, avoiding both unbounded softmax sectors and unnormalized multi-lobe voids.

## Contributions
1. A clean, leak-free near-OOD FLS evaluation benchmark on MD-FLS Watertank (`2,364` verified patches: 6 known classes including `bottle` vs. 4 withheld unknown classes including `standing-bottle`, `shampoo-bottle`, `valve`, and `chain`).
2. Empirical diagnosis of two post-hoc failure modes on sonar embeddings: Global Centroid SVDD collapse (`0.2371` AUROC, rescued to `0.9175` by Nearest Class Centroids) and extreme MSP score compression (`\tau^* = 0.9980`, `AP = 0.7747`).
3. Demonstration that end-to-end hyperspherical Deep Metric Learning on $S^{127}$ (`EmbeddingNet`) wins all five OSR metrics (`0.9603` AUROC, `0.9235` AP, `0.9077` TPR, `0.0987` FPR, `0.9013` UDR) alongside `100.0%` closed-set nearest-centroid known accuracy and improved rejection of the hardest geometric outlier `chain` (`80.53%`).

## Claims to Make (Strongly Supported)
- DML achieves `0.9603` AUROC and `0.9235` AP on the 869-image mixed test set, winning all five metrics over MSP (`0.9069` AUROC, `0.7747` AP) and Nearest-Centroid SVDD (`0.9175` AUROC, `0.8568` AP).
- Global Centroid SVDD scores worse than random chance (`0.2371` AUROC, `0.9298` FPR), whereas class-conditional Nearest Centroid lifts AUROC by `+0.6804` (`0.9175`).
- MSP pushes its Youden operating threshold to `0.9980` due to dense unknown score pile-up near `1.0` (`msp_distributions.png`).
- `chain` is the hardest unknown category across all three paradigms, rising from `66.37%` (MSP) and `70.80%` (SVDD) to `80.53%` (DML).

## Claims to Be Careful About
- Operating-point metrics (TPR, FPR, UDR) depend on Youden's $J$ threshold calibrated on the test ROC curve rather than a proxy-outlier validation split.
- `EmbeddingNet` updates all `24,623,808` parameters (whereas `build_resnet50` freezes `layer1`/`layer2`), so DML's advantage reflects both the cosine triplet objective and full backbone adaptation.

## Claims to Avoid
- Do not claim cross-domain open-ocean or Turntable generalization without test metrics.
- Do not claim multi-seed statistical significance or SOTA over unseen external sonar OSR methods (such as OpenMax or Class-Balanced OpenMax) that were not executed on this exact split.
- Do not quote unrecorded epoch losses or raw 2048-D centroid norm printouts omitted from `all_results.json`.

## Reviewer Risks
1. Single random seed (`42`) and test-set Youden threshold selection. (Address transparently in Protocol and Limitations.)
2. `EmbeddingNet` unfreezes early layers (`layer1`/`layer2`) while `build_resnet50` freezes them. (State explicitly as an implementation detail and discussion point rather than hiding it.)
3. Why OpenMax from prior sonar OSR literature is not in the quantitative table. (Position carefully in Related Work and note scope boundary.)
