import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radio,
  ChevronRight,
  Cpu,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import KpiCard from '../features/dashboard/KpiCard';
import { useBenchmark } from '../hooks/useBenchmark';
import { formatDecimal, formatPercent } from '../lib/format';
import { cardStagger } from '../lib/motion';
import SonarHypersphere3D from '../features/home/SonarHypersphere3D';

export default function Home() {
  const { data: benchmark } = useBenchmark();
  const dml = benchmark?.methods?.dml;
  const svdd = benchmark?.methods?.svdd;
  const msp = benchmark?.methods?.msp;
  const totalImages = benchmark?.summary?.total_images ?? 2364;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="p-7 sm:p-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <Badge tone="primary">
              <Radio size={13} />
              ARIS Explorer 3000 · 3.0 MHz · 96 Beams
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-[1.15]">
              Open-set recognition for underwater sonar imagery
            </h1>

            <p className="text-[15px] text-ink-2 leading-relaxed max-w-2xl">
              Standard deep neural networks force acoustic echoes into known categories with dangerously high false confidence.
              Our framework equips Autonomous Underwater Vehicles (AUVs) with bounded metric hyperspheres to safely reject
              unseen marine hazards and unknown objects in low-visibility seabed environments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-card hover:bg-primary-hover transition-colors"
              >
                <span>Launch Live Demo</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-soft border border-line text-sm font-semibold text-ink-2 hover:bg-hover transition-colors"
              >
                <Cpu size={15} />
                <span>Reports &amp; Benchmark</span>
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-soft border border-line text-sm font-semibold text-ink-2 hover:bg-hover transition-colors"
              >
                <FlaskConical size={15} />
                <span>Pipeline Lab</span>
              </Link>
            </div>
          </div>

          {/* Interactive 3D Metric Hypersphere & Sonar Embedding Space */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <SonarHypersphere3D />
          </div>
        </div>
      </Card>

      {/* 4 Headline KPI Tiles driven by results.json */}
      <motion.div
        variants={cardStagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <KpiCard
          title="Best AUROC (DML)"
          numericValue={dml?.auroc ?? 0.9255}
          formatValue={(v) => v.toFixed(4)}
          sparkline={benchmark?.curves?.dml_roc}
        />
        <KpiCard
          title="Lowest FPR (SVDD)"
          numericValue={svdd ? svdd.fpr * 100 : 11.71}
          formatValue={(v) => `${v.toFixed(2)}%`}
          sparkline={benchmark?.curves?.svdd_roc}
        />
        <KpiCard
          title="Known-Class Recall (DML)"
          numericValue={dml ? dml.tpr * 100 : 94.1}
          formatValue={(v) => `${v.toFixed(2)}%`}
        />
        <KpiCard
          title="MD-FLS Corpus"
          numericValue={totalImages}
          unit="images"
        />
      </motion.div>

      {/* Closed-World vs Open-Set Explainers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="The Closed-World Failure"
            subtitle="Standard Softmax classification"
            right={
              <Badge tone="bad">
                <AlertCircle size={13} />
                AUROC {formatDecimal(msp?.auroc, 4)}
              </Badge>
            }
          />
          <p className="text-sm text-ink-2 leading-relaxed mb-4">
            Standard Softmax classifiers divide Euclidean space with linear hyperplanes, leaving unbounded receptive fields.
            When an AUV encounters novel seabed debris or structural hazards, the network forces a closed-world label with
            artificially high confidence, causing false identifications during autonomous missions.
          </p>
          <div className="rounded-control bg-soft border border-line p-3 flex items-center justify-between text-xs">
            <span className="text-ink-muted">MSP Decision Boundary</span>
            <span className="font-mono font-semibold text-bad">
              Unbounded · FPR {formatPercent(msp?.fpr, 2)}
            </span>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="The Open-Set Solution"
            subtitle="Bounded metric hyperspheres"
            right={
              <Badge tone="good">
                <CheckCircle2 size={13} />
                AUROC {formatDecimal(dml?.auroc, 4)}
              </Badge>
            }
          />
          <p className="text-sm text-ink-2 leading-relaxed mb-4">
            Our dual-paradigm architecture enforces closed boundaries around known acoustic classes:
            <strong> Deep SVDD</strong> projects features against 2048-D centroids, while
            <strong> Deep Metric Learning (DML)</strong> uses semi-hard triplet mining in a 128-D L2-normalized embedding space.
            Any query exceeding decision radius τ is rejected as Unknown.
          </p>
          <div className="rounded-control bg-soft border border-line p-3 flex items-center justify-between text-xs">
            <span className="text-ink-muted">DML Decision Boundary</span>
            <span className="font-mono font-semibold text-good">
              Bounded Radius · τ Rejection
            </span>
          </div>
        </Card>
      </div>

      {/* End-to-End Pipeline */}
      <Card>
        <CardHeader
          title="End-to-End Processing & Decision Pipeline"
          subtitle="Four-stage acoustic signal transformation and open-set inference"
          right={
            <Badge tone="primary">
              <Layers size={13} />
              Zero Data Leakage
            </Badge>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              step: 'STAGE 01',
              title: 'Acoustic Denoising',
              desc: 'RGBA→RGB conversion, 3×3 median filtering to suppress Rayleigh speckle, and CLAHE contrast equalization.',
            },
            {
              step: 'STAGE 02',
              title: 'Physics Decomposition',
              desc: 'Otsu & percentile segmentation isolates specular target backscatter, occlusion shadow, and seabed reverberation.',
            },
            {
              step: 'STAGE 03',
              title: 'Feature Embedding',
              desc: 'ResNet-50 backbone maps 224×224 echograms into 2048-D GAP features and a 128-D L2 hypersphere.',
            },
            {
              step: 'STAGE 04',
              title: 'Open-Set Decision',
              desc: 'Euclidean distance to known class centroids is compared against τ: below τ = Known, above τ = Reject.',
            },
          ].map((s) => (
            <div key={s.step} className="p-4 rounded-control bg-soft border border-line">
              <div className="font-mono text-[11px] font-bold text-primary mb-1">{s.step}</div>
              <div className="text-sm font-semibold text-ink mb-1.5">{s.title}</div>
              <p className="text-xs text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
