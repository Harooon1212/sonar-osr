import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Card } from '../../../ui/Card';
import Lightbox from '../../../ui/Lightbox';

const CORE_FIGURES = [
  { title: 'Final Benchmark Dashboard', src: '/figures/final_benchmark_dashboard.png' },
  { title: 'DML Complete Dashboard', src: '/figures/dml_complete_dashboard.png' },
  { title: 'SVDD Complete Dashboard', src: '/figures/svdd_complete_dashboard.png' },
  { title: 'MSP Complete Dashboard', src: '/figures/msp_complete_dashboard.png' },
  { title: 'Preprocessing All Classes', src: '/figures/preprocessing_all_classes.png' },
  { title: 'Sample Acoustic Batch', src: '/figures/sample_batch.png' },
];

const EXTRA_FIGURES = [
  { title: 'All Methods Comparison', src: '/figures/all_methods_comparison.png' },
  { title: 'All Methods Unknown Detection', src: '/figures/all_methods_unknown_detection.png' },
  { title: 'Class Distribution', src: '/figures/class_distribution.png' },
  { title: 'Confusion Matrix Baseline', src: '/figures/confusion_matrix_baseline.png' },
  { title: 'DML t-SNE Visualization', src: '/figures/dml_tsne_visualization.png' },
  { title: 'Metric t-SNE', src: '/figures/metric_tsne.png' },
  { title: 'MSP Distributions', src: '/figures/msp_distributions.png' },
  { title: 'MSP OSR Confusion Matrix', src: '/figures/msp_osr_confusion_matrix.png' },
  { title: 'MSP Per-Unknown Scores', src: '/figures/msp_per_unknown_scores.png' },
  { title: 'MSP ROC & PR Curves', src: '/figures/msp_roc_pr_curves.png' },
  { title: 'MSP Unknown Detection', src: '/figures/msp_unknown_detection.png' },
  { title: 'Pixel Distributions', src: '/figures/pixel_distributions.png' },
  { title: 'Preprocessing Example', src: '/figures/preprocessing_example.png' },
  { title: 'ResNet-50 Baseline Curves', src: '/figures/resnet50_baseline_curves.png' },
  { title: 'Sample Images', src: '/figures/sample_images.png' },
  { title: 'Unknown Sample Images', src: '/figures/unknown_sample_images.png' },
];

export default function GalleryView() {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const items = showAll ? [...CORE_FIGURES, ...EXTRA_FIGURES] : CORE_FIGURES;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          Click any publication figure to open zoomable lightbox (←/→ arrows, Esc to close).
        </p>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {showAll ? 'Show core 6 figures' : `Show all ${CORE_FIGURES.length + EXTRA_FIGURES.length} figures`}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((fig, idx) => (
          <Card key={fig.src} className="p-4 group">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold text-ink-2 truncate">{fig.title}</h4>
              <button
                type="button"
                aria-label={`Zoom ${fig.title}`}
                onClick={() => setLightboxIdx(idx)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary-soft transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIdx(idx)}
              className="block w-full aspect-[16/10] rounded-control overflow-hidden bg-soft border border-line"
            >
              <img
                src={fig.src}
                alt={fig.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
            </button>
          </Card>
        ))}
      </div>

      <Lightbox
        items={items}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onIndexChange={setLightboxIdx}
      />
    </div>
  );
}
