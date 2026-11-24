import React from 'react';
import { GraduationCap, Code2, Users, BookOpen } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import { Card, CardHeader } from '../ui/Card';

export default function About() {
  return (
    <div>
      <PageHeader
        title="Final Year Project & Research Team"
        subtitle="Open-Set Recognition (OSR) for Underwater Forward-Looking Sonar Imagery · Bahria University, Islamabad"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <Card className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-base font-bold text-ink">Bahria University</h3>
            <div className="text-xs text-ink-muted">Islamabad Campus (E-8)</div>
            <div className="text-xs text-ink-faint mt-0.5">Department of Computer Science</div>

            <div className="mt-5 pt-4 border-t border-line text-left space-y-2 text-xs text-ink-2">
              <div><strong className="text-ink">Degree:</strong> BS Computer Science (BSCS)</div>
              <div><strong className="text-ink">Domain:</strong> Underwater Acoustic Robotics &amp; Vision</div>
              <div><strong className="text-ink">Year:</strong> 2026 Final Year Project</div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Technology Stack"
              right={<Code2 size={16} className="text-primary" />}
            />
            <ul className="space-y-2 text-xs text-ink-2 leading-relaxed">
              <li><strong className="text-ink">Frontend:</strong> React 18, Vite 5, Tailwind CSS, Framer Motion, Recharts, D3.js, Zustand, KaTeX</li>
              <li><strong className="text-ink">Backend:</strong> FastAPI, PyTorch, Uvicorn</li>
              <li><strong className="text-ink">Deep Learning:</strong> ResNet-50, Triplet Loss (DML), Deep SVDD, MSP</li>
              <li><strong className="text-ink">Sensor:</strong> Sound Metrics ARIS Explorer 3000</li>
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <Card>
            <CardHeader title="Research Abstract & Project Scope" />
            <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
              <p>
                Autonomous Underwater Vehicles (AUVs) navigating murky subsea environments face severe limitations when using
                optical cameras due to turbidity and light attenuation. Acoustic forward-looking sonar provides critical
                long-range visibility, but traditional closed-set deep classifiers fail catastrophically by mistaking novel
                obstacles, discarded marine clutter, and unexploded ordnances for known objects with high artificial confidence.
              </p>
              <p>
                This research introduces a bounded metric space open-set recognition framework. By combining speckle-reduction
                filtering, acoustic highlight/shadow physics decomposition, and semi-hard triplet metric learning, our system
                achieves an <strong className="text-ink">AUROC of 0.9255</strong> on zero-shot anomaly detection, preventing
                catastrophic false-accept decisions in autonomous subsea exploration.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Research Team & Supervision"
              right={<Users size={16} className="text-primary" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-control bg-soft border border-line">
                <div className="text-[11px] font-semibold text-primary">Project Supervisor</div>
                <div className="text-sm font-bold text-ink mt-1">Dr. Arif Ur Rahman</div>
                <div className="text-xs text-ink-muted mt-0.5">Dept. of Computer Science · BUIC</div>
              </div>
              <div className="p-4 rounded-control bg-soft border border-line">
                <div className="text-[11px] font-semibold text-good">Student Researcher</div>
                <div className="text-sm font-bold text-ink mt-1">Mohammad Khizar Hayat Cheema</div>
                <div className="font-mono text-[11px] text-ink-muted mt-0.5">01-134231-039</div>
              </div>
              <div className="p-4 rounded-control bg-soft border border-line">
                <div className="text-[11px] font-semibold text-good">Student Researcher</div>
                <div className="text-sm font-bold text-ink mt-1">Muhammad Haroon</div>
                <div className="font-mono text-[11px] text-ink-muted mt-0.5">01-134231-052</div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Academic References & Dataset Citations"
              right={<BookOpen size={16} className="text-primary" />}
            />
            <div className="space-y-2.5 text-xs text-ink-2 leading-relaxed">
              <div className="p-3 rounded-control bg-soft border border-line">
                <strong className="text-ink">MD-FLS Dataset:</strong> Valdenegro-Toro, M. (2019).{' '}
                <em>Marine Debris Forward-Looking Sonar Dataset: Watertank release</em>. Sound Metrics ARIS Explorer 3000.
              </div>
              <div className="p-3 rounded-control bg-soft border border-line">
                <strong className="text-ink">Open-Set Recognition:</strong> Scheirer, W. J., de Rocha, A., Micheals, R. J., &amp; Boult, T. E. (2013).{' '}
                <em>Toward Open Set Recognition</em>. IEEE TPAMI, 35(7), 1757–1772.
              </div>
              <div className="p-3 rounded-control bg-soft border border-line">
                <strong className="text-ink">Baseline MSP:</strong> Hendrycks, D., &amp; Gimpel, K. (2017).{' '}
                <em>A Baseline for Detecting Misclassified and Out-of-Distribution Examples in Neural Networks</em>. ICLR.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
