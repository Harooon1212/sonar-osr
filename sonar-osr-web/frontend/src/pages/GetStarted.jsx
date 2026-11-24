import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, TrendingUp, FlaskConical, Terminal } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import { Card, CardHeader } from '../ui/Card';

export default function GetStarted() {
  return (
    <div>
      <PageHeader
        title="Get Started"
        subtitle="Quick guided tour of SonarOSR and instructions for running the platform locally"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card>
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-base font-bold text-ink mb-1">1. Explore Reports</h3>
          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            Filter methods (DML, SVDD, MSP) and classes to inspect AUROC, unknown detection rates, ROC/PR curves, confusion matrices, and publication figures.
          </p>
          <Link to="/dashboard" className="text-xs font-semibold text-primary hover:underline">
            Open Reports →
          </Link>
        </Card>

        <Card>
          <div className="w-10 h-10 rounded-xl bg-good-track text-good flex items-center justify-center mb-3">
            <Activity size={20} />
          </div>
          <h3 className="text-base font-bold text-ink mb-1">2. Run Live Inference</h3>
          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            Pick a known or unknown ARIS Explorer 3000 sample (or upload your own), tune threshold τ, and compare DML, Deep SVDD, and MSP verdicts.
          </p>
          <Link to="/demo" className="text-xs font-semibold text-primary hover:underline">
            Open Live Demo →
          </Link>
        </Card>

        <Card>
          <div className="w-10 h-10 rounded-xl bg-warn-soft text-warn flex items-center justify-center mb-3">
            <FlaskConical size={20} />
          </div>
          <h3 className="text-base font-bold text-ink mb-1">3. Test Acoustic Physics</h3>
          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            Inject Rayleigh speckle and turbidity in NoiseLab, decompose highlight/shadow zones, or replay the scripted AUV patrol simulation.
          </p>
          <Link to="/lab" className="text-xs font-semibold text-primary hover:underline">
            Open Pipeline Lab →
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Running Locally (Windows & Docker)"
          right={<Terminal size={16} className="text-primary" />}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="font-semibold text-ink mb-2">Windows One-Click (start_all.bat)</div>
            <pre className="font-mono text-ink-2 overflow-x-auto leading-relaxed">
{`# From project root:
start_all.bat

# Or manually in two terminals:
python -m uvicorn sonar-osr-web.backend.app.main:app --port 8000 --reload
cd sonar-osr-web/frontend && npm run dev`}
            </pre>
          </div>
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="font-semibold text-ink mb-2">Production / Hugging Face Space (Port 7860)</div>
            <pre className="font-mono text-ink-2 overflow-x-auto leading-relaxed">
{`cd sonar-osr-web/frontend && npm run build
# FastAPI serves dist/ automatically on /
# All API calls use relative /api/* paths`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
