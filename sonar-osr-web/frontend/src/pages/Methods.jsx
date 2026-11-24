import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Methods() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Methodology and mathematical formulations</h1>
        <p className="page-desc">
          Mathematical foundations, loss functions, and decision boundary architectures governing the 3 acoustic recognition paradigms.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Method 1: DML */}
        <div className="glass--card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-info" style={{ marginRight: '8px' }}>Primary architecture</span>
              Deep metric learning (DML) with triplet margin loss
            </h3>
            <span className="badge badge-info font-mono tabular-nums">AUROC 0.9255</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            Rather than learning hyperplane decision boundaries, DML maps acoustic features into a 128-dimensional 
            L2-normalized hyperspherical space where Euclidean distance directly reflects semantic acoustic similarity.
          </p>

          <div className="plate" style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--glow-cyan)', marginBottom: '14px' }}>
            <div style={{ color: 'var(--text-faint)', fontSize: '11px', marginBottom: '4px' }}>Semi-hard triplet margin loss (margin α = 0.20)</div>
            L_triplet = max(0, ||f(x_a) - f(x_p)||^2 - ||f(x_a) - f(x_n)||^2 + α)
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Where <code className="font-mono">x_a</code> is the anchor echo, <code className="font-mono">x_p</code> is a positive echo from the same class, 
            <code className="font-mono">x_n</code> is a negative echo from a different class, and <code className="font-mono">α = 0.20</code> is the enforced margin. 
            Hard-triplet online mining ensures rapid gradient convergence and dense cluster compactness.
          </p>

          <div className="inset" style={{ marginTop: '14px', padding: '14px', fontSize: '13px' }}>
            <strong style={{ color: 'var(--text-bright)' }}>Open-set decision rule (Equation 2):</strong> During inference, the query embedding is compared against all class cluster centroids:
            <div className="font-mono" style={{ margin: '6px 0', color: 'var(--glow-cyan)' }}>
              d_min = min_k ||f(x) - c_k||_2 &nbsp; | &nbsp; if d_min &lt; τ &rarr; Class k, else &rarr; Unknown (rejected)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '4px' }}>
              Deep metric learning achieves the highest overall AUROC (0.9255) and known-class recall (94.10%).
            </div>
          </div>
        </div>

        {/* Method 2: One-Class SVDD (nearest centroid) */}
        <div className="glass--card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-known" style={{ marginRight: '8px' }}>One-class paradigm</span>
              One-class SVDD (nearest centroid)
            </h3>
            <span className="badge badge-known font-mono tabular-nums">AUROC 0.8986</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            One-class SVDD evaluates acoustic representations against class centroids in the 2048-D global-average-pooled 
            feature space of the fine-tuned ResNet-50. Points falling outside the learned decision radius τ are detected as anomalies.
          </p>

          <div className="plate" style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--highlight-green)', marginBottom: '14px' }}>
            <div style={{ color: 'var(--text-faint)', fontSize: '11px', marginBottom: '4px' }}>Class centroid definition (2048-D feature space)</div>
            {"C_k = (1 / N_k) * Σ_{i=1}^{N_k} f(x_i)"}
          </div>

          <div className="inset" style={{ padding: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-bright)' }}>Operating characteristic:</strong> One-class SVDD achieves the 
            lowest false-positive rate across all tested methods (<strong style={{ color: 'var(--highlight-green)' }}>FPR: 11.71%</strong>), 
            making it the safest choice for defensive underwater navigation where false alarms on known marine debris must be minimized.
          </div>
        </div>

        {/* Method 3: Baseline MSP */}
        <div className="glass--card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-warning" style={{ marginRight: '8px' }}>Baseline paradigm</span>
              Maximum Softmax Probability (MSP) with ResNet-50
            </h3>
            <span className="badge badge-warning font-mono tabular-nums">AUROC 0.8165</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            A standard ResNet-50 backbone fine-tuned with cross-entropy loss. Unknown rejection is attempted by thresholding 
            the maximum softmax output: <code className="font-mono">P_max = max_k Softmax(z_k)</code>.
          </p>

          <div className="plate" style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--semantic-warning)', marginBottom: '14px' }}>
            <div style={{ color: 'var(--text-faint)', fontSize: '11px', marginBottom: '4px' }}>Softmax confidence score</div>
            {"y_hat = argmax_k p_k(x),    known iff max_k p_k(x) ≥ τ"}
          </div>

          <div className="inset" style={{ padding: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--semantic-warning)' }}>Theoretical limitation:</strong> Softmax normalizes unbounded linear logits across only the known classes. 
            Even an arbitrary out-of-distribution input will project onto some dominant logit, producing an artificially high probability score (&gt;95%), causing catastrophic false acceptances.
          </div>
        </div>
      </div>
    </div>
  );
}
