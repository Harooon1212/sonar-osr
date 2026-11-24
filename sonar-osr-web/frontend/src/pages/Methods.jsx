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
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-info" style={{ marginRight: '8px' }}>Primary architecture</span>
              Deep Metric Learning (DML) with triplet margin loss
            </h3>
            <span className="badge badge-info font-mono tabular-nums">AUROC 0.9255</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            Rather than learning hyperplane decision boundaries, DML maps acoustic features into a 128-dimensional 
            L2-normalized hyperspherical space where Euclidean distance directly reflects semantic acoustic similarity.
          </p>

          <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Semi-hard triplet margin loss</div>
            L_triplet = max(0, ||f(x_a) - f(x_p)||^2 - ||f(x_a) - f(x_n)||^2 + α)
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Where <code className="font-mono">x_a</code> is the anchor echo, <code className="font-mono">x_p</code> is a positive echo from the same class, 
            <code className="font-mono">x_n</code> is a negative echo from a different class, and <code className="font-mono">α = 0.30</code> is the enforced margin. 
            Semi-hard negatives (<code className="font-mono">||f(a)-f(p)||^2 &lt; ||f(a)-f(n)||^2 &lt; ||f(a)-f(p)||^2 + α</code>) are selected to prevent gradient vanishing.
          </p>

          <div style={{ marginTop: '14px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}>
            <strong style={{ color: 'var(--text-bright)' }}>Open-set decision rule:</strong> During inference, the query embedding is compared against all class cluster centroids:
            <div className="font-mono" style={{ margin: '6px 0', color: 'var(--accent-cyan)' }}>
              d_min = min_k ||f(x) - c_k||_2 &nbsp; | &nbsp; if d_min &lt;= τ &rarr; Class k, else &rarr; Unknown (rejected)
            </div>
          </div>
        </div>

        {/* Method 2: Deep SVDD */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-known" style={{ marginRight: '8px' }}>One-class paradigm</span>
              Deep Support Vector Data Description (Deep SVDD)
            </h3>
            <span className="badge badge-known font-mono tabular-nums">AUROC 0.8986</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            Deep SVDD trains the neural network to enclose all known acoustic representations into a minimal-volume hypersphere 
            centered at fixed point <strong>c</strong>. Points falling outside the learned hypersphere radius R are detected as anomalies.
          </p>

          <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--semantic-positive)', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Deep SVDD objective function</div>
            min_W (1/N) * Σ ||ϕ(x_i; W) - c||^2 + (λ/2) * Σ ||W^l||_F^2
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The center vector <strong>c</strong> is precalculated by performing an initial forward pass of the training data through the network 
            and setting <strong>c = mean(ϕ(x_i))</strong>. Bias terms are omitted in the projection head to prevent trivial hypersphere collapse.
          </p>
        </div>

        {/* Method 3: Baseline MSP */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-warning" style={{ marginRight: '8px' }}>Baseline paradigm</span>
              Maximum Softmax Probability (MSP) and ResNet50
            </h3>
            <span className="badge badge-warning font-mono tabular-nums">AUROC 0.8165</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            A standard ResNet50 backbone fine-tuned with Cross-Entropy Loss. Unknown rejection is attempted by thresholding 
            the maximum softmax output: <code className="font-mono">P_max = max_k Softmax(z_k)</code>.
          </p>

          <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--semantic-warning)', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Softmax activation</div>
            P(y = k | x) = exp(z_k) / Σ_j exp(z_j)
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--semantic-warning)' }}>Theoretical limitation:</strong> Softmax normalizes unbounded linear logits across only the known classes. 
            Even an arbitrary out-of-distribution input will project onto some dominant logit, producing an artificially high probability score (&gt;95%).
          </div>
        </div>
      </div>
    </div>
  );
}
