import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../layout/PageHeader';
import FiltersBar from '../features/dashboard/FiltersBar';
import KpiCard from '../features/dashboard/KpiCard';
import ActivityBars from '../features/dashboard/ActivityBars';
import RankedList from '../features/dashboard/RankedList';
import Leaderboard from '../features/dashboard/Leaderboard';
import Tabs from '../ui/Tabs';
import Skeleton from '../ui/Skeleton';
import ErrorBanner from '../ui/ErrorBanner';
import OverviewView from '../features/dashboard/views/OverviewView';
import RocCurve from '../features/charts/RocCurve';
import ConfusionMatrix from '../features/charts/ConfusionMatrix';
import ThresholdExplorer from '../features/charts/ThresholdExplorer';
import LatentView from '../features/dashboard/views/LatentView';
import PerUnknownView from '../features/dashboard/views/PerUnknownView';
import AzimuthView from '../features/dashboard/views/AzimuthView';
import GalleryView from '../features/dashboard/views/GalleryView';
import { useBenchmark } from '../hooks/useBenchmark';
import { useFilters } from '../store/useFilters';
import { useEngine } from '../store/useEngine';
import { downloadJson } from '../lib/export';
import { titleCase } from '../lib/format';
import { cardStagger } from '../lib/motion';

const SAMPLE_THUMBS = {
  chain: '/samples/chain-sample.png',
  valve: '/samples/valve-sample.png',
  'shampoo-bottle': '/samples/shampoo-sample.png',
  'standing-bottle': null,
};

const ANALYTIC_TABS = [
  { id: 'overview', label: 'Overview & Leaderboard' },
  { id: 'roc', label: 'ROC & PR Curves' },
  { id: 'confusion', label: 'Confusion Matrix' },
  { id: 'latent', label: 'Latent Geometry' },
  { id: 'threshold', label: 'Threshold Explorer' },
  { id: 'unknowns', label: 'Per-Unknown' },
  { id: 'azimuth', label: 'Azimuth' },
  { id: 'gallery', label: 'Figures' },
];

export default function Dashboard() {
  const { data: benchmark, loading, error, retry } = useBenchmark();
  const { methods: selectedMethods, classFilter, split } = useFilters();
  const lastLatencyMs = useEngine((s) => s.lastLatencyMs);
  const [activeTab, setActiveTab] = useState('overview');

  const activeMethodIds = selectedMethods.length > 0 ? selectedMethods : ['dml', 'svdd', 'msp'];

  const derived = useMemo(() => {
    if (!benchmark) return null;
    const m = benchmark.methods || {};
    const perClass = benchmark.per_class_unknown_detection || {};
    const summary = benchmark.summary || {};
    const winners = summary.winners || {};

    const baselineAuroc = m.msp?.auroc ?? 0.8165;
    const bestSelectedAuroc = Math.max(
      ...activeMethodIds.map((id) => Number(m[id]?.auroc ?? 0))
    );
    const aurocGain = bestSelectedAuroc - baselineAuroc;

    // Class count based on classFilter
    let knownClassesCount = 6;
    let totalClassesCount = 10;
    if (classFilter === 'known') {
      knownClassesCount = 6;
      totalClassesCount = 6;
    } else if (classFilter === 'unknown') {
      knownClassesCount = 0;
      totalClassesCount = 4;
    } else if (classFilter !== 'all') {
      const isKnown = ['bottle', 'can', 'tire', 'drink-carton', 'hook', 'propeller'].includes(classFilter);
      knownClassesCount = isKnown ? 1 : 0;
      totalClassesCount = 1;
    }

    // Ranked unknown classes (Hardest vs Easiest)
    const rankedUnknowns = Object.entries(perClass)
      .map(([cls, scores]) => {
        const vals = activeMethodIds.map((id) => Number(scores[id] ?? 0));
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        return {
          id: cls,
          name: titleCase(cls),
          thumb: SAMPLE_THUMBS[cls] ?? null,
          value: Number(avg.toFixed(1)),
        };
      })
      .sort((a, b) => a.value - b.value);

    const hardest = rankedUnknowns.slice(0, 3);
    const easiest = [...rankedUnknowns].reverse().slice(0, 3);

    // Method leaderboard
    const methodRows = activeMethodIds
      .map((id) => ({ id, ...(m[id] || {}) }))
      .filter((r) => r.name)
      .sort((a, b) => (b.auroc ?? 0) - (a.auroc ?? 0))
      .map((r, idx) => ({
        id: r.id,
        rank: idx + 1,
        badgeText: r.id.toUpperCase(),
        name: r.name,
        subline: `AUROC ${(r.auroc ?? 0).toFixed(4)} · AP ${(r.ap ?? 0).toFixed(4)} · TPR ${((r.tpr ?? 0) * 100).toFixed(1)}%`,
        trend: (r.auroc ?? 0) >= baselineAuroc && r.id !== 'msp' ? 'up' : 'down',
      }));

    // Metric winners leaderboard
    const winnerEntries = [
      { key: 'auroc', label: 'Best AUROC', fmt: (meth) => Number(meth?.auroc ?? 0).toFixed(4), up: true },
      { key: 'ap', label: 'Average Precision', fmt: (meth) => Number(meth?.ap ?? 0).toFixed(4), up: true },
      { key: 'tpr', label: 'Known Recall (TPR)', fmt: (meth) => `${((meth?.tpr ?? 0) * 100).toFixed(2)}%`, up: true },
      { key: 'fpr', label: 'Lowest False Positive', fmt: (meth) => `${((meth?.fpr ?? 0) * 100).toFixed(2)}%`, up: true },
      { key: 'udr', label: 'Unknown Detection (UDR)', fmt: (meth) => `${((meth?.udr ?? 0) * 100).toFixed(2)}%`, up: true },
    ].map((entry, idx) => {
      const winId = winners[entry.key] || 'dml';
      const winMethod = m[winId];
      return {
        id: entry.key,
        rank: idx + 1,
        name: entry.label,
        subline: `${winId.toUpperCase()} · ${entry.fmt(winMethod)}`,
        trend: entry.up ? 'up' : 'down',
      };
    });

    return {
      totalImages: summary.total_images ?? 2364,
      knownClassesCount,
      totalClassesCount,
      baselineAuroc,
      bestSelectedAuroc,
      aurocGain,
      mspSpark: benchmark.curves?.msp_roc || [],
      dmlSpark: benchmark.curves?.dml_roc || [],
      perClass,
      hardest,
      easiest,
      methodRows,
      winnerEntries,
    };
  }, [benchmark, activeMethodIds, classFilter]);

  const handleDownloadReport = () => {
    if (!benchmark) return;
    downloadJson(
      {
        exportedAt: new Date().toISOString(),
        filters: { split, methods: activeMethodIds, classFilter },
        methods: Object.fromEntries(
          activeMethodIds.map((id) => [id, benchmark.methods?.[id]])
        ),
        per_class_unknown_detection: benchmark.per_class_unknown_detection,
      },
      `sonar_osr_report_${Date.now()}.json`
    );
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        onDownload={benchmark ? handleDownloadReport : undefined}
        downloadLabel="Download"
      />

      <FiltersBar />

      {error && (
        <div className="mb-6">
          <ErrorBanner title="Failed to load benchmark data" message={error} onRetry={retry} />
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[156px] rounded-card" />
              ))}
            </div>
            <Skeleton className="xl:col-span-5 h-[328px] rounded-card" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-[240px] rounded-card" />
            <Skeleton className="h-[240px] rounded-card" />
          </div>
        </div>
      )}

      {!loading && derived && (
        <>
          {/* Template Overview Block: 2x3 KPIs + Activity Bar Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-6">
            <motion.div
              variants={cardStagger}
              initial="hidden"
              animate="visible"
              className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <KpiCard
                title="Known Classes"
                numericValue={derived.knownClassesCount}
                unit={`/${derived.totalClassesCount}`}
              />
              <KpiCard
                title="Images Evaluated"
                numericValue={derived.totalImages}
              />
              <KpiCard
                title="Inference Latency"
                displayValue={lastLatencyMs ? `${lastLatencyMs.toFixed(1)} ms` : '—'}
                info="Measured from your most recent Live Demo prediction."
              />
              <KpiCard
                title="Baseline AUROC (MSP)"
                numericValue={derived.baselineAuroc}
                formatValue={(v) => v.toFixed(4)}
                info="Maximum Softmax Probability baseline open-set AUROC."
                sparkline={derived.mspSpark}
              />
              <KpiCard
                title="Best AUROC (Selected)"
                numericValue={derived.bestSelectedAuroc}
                formatValue={(v) => v.toFixed(4)}
                sparkline={derived.dmlSpark}
              />
              <KpiCard
                title="AUROC Gain vs MSP"
                numericValue={derived.aurocGain}
                formatValue={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(3)}`}
                sparkline={derived.dmlSpark}
              />
            </motion.div>

            <div className="xl:col-span-5">
              <ActivityBars
                perClassDetection={derived.perClass}
                selectedMethods={activeMethodIds}
              />
            </div>
          </div>

          {/* Ranked Progress Lists: Hardest vs Easiest Unknown Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <RankedList
              title="Hardest Unknown Classes"
              items={derived.hardest}
              tone="weak"
            />
            <RankedList
              title="Easiest Unknown Classes"
              items={derived.easiest}
              tone="strong"
            />
          </div>

          {/* Two Leaderboards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <Leaderboard
              title="Method Leaderboard"
              rows={derived.methodRows}
            />
            <Leaderboard
              title="Metric Winners"
              rows={derived.winnerEntries}
            />
          </div>

          {/* Segmented Tab Bar for the 8 Analytic Views */}
          <div className="pt-4 border-t border-line">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <h2 className="text-lg font-bold text-ink">Experimental Analytics</h2>
              <Tabs
                layoutId="dashboard-analytic-tabs"
                tabs={ANALYTIC_TABS}
                value={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {activeTab === 'overview' && (
              <OverviewView benchmark={benchmark} selectedMethods={activeMethodIds} />
            )}
            {activeTab === 'roc' && <RocCurve benchmark={benchmark} />}
            {activeTab === 'confusion' && <ConfusionMatrix benchmark={benchmark} />}
            {activeTab === 'latent' && <LatentView benchmark={benchmark} />}
            {activeTab === 'threshold' && <ThresholdExplorer benchmark={benchmark} />}
            {activeTab === 'unknowns' && <PerUnknownView benchmark={benchmark} />}
            {activeTab === 'azimuth' && <AzimuthView />}
            {activeTab === 'gallery' && <GalleryView />}
          </div>
        </>
      )}
    </div>
  );
}
