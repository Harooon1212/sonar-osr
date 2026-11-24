import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { Card } from '../../ui/Card';
import { titleCase } from '../../lib/format';

function PillBarShape(props) {
  const { x, y, width, height, background } = props;
  const bgY = background?.y ?? 0;
  const bgH = background?.height ?? 0;
  const r = Math.min(width / 2, 8);

  return (
    <g>
      <rect
        x={x}
        y={bgY}
        width={width}
        height={bgH}
        rx={r}
        ry={r}
        fill="var(--primary-track)"
      />
      {height > 0 && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={r}
          ry={r}
          fill="url(#activityBarGrad)"
        />
      )}
    </g>
  );
}

export default function ActivityBars({ perClassDetection = {}, selectedMethods = ['dml', 'svdd', 'msp'] }) {
  const [groupBy, setGroupBy] = useState('class'); // 'class' | 'method'

  const activeMethods = selectedMethods.length > 0 ? selectedMethods : ['dml', 'svdd', 'msp'];

  const chartData = React.useMemo(() => {
    const entries = Object.entries(perClassDetection);
    if (groupBy === 'class') {
      return entries.map(([cls, scores]) => {
        const vals = activeMethods.map((m) => Number(scores[m] ?? 0));
        const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return {
          name: titleCase(cls).replace(' Bottle', ''),
          fullName: cls,
          value: Number(avg.toFixed(1)),
          dml: scores.dml ?? 0,
          svdd: scores.svdd ?? 0,
          msp: scores.msp ?? 0,
        };
      });
    }
    // By method
    return activeMethods.map((m) => {
      const vals = entries.map(([, scores]) => Number(scores[m] ?? 0));
      const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return {
        name: m.toUpperCase(),
        fullName: m.toUpperCase(),
        value: Number(avg.toFixed(1)),
      };
    });
  }, [perClassDetection, activeMethods, groupBy]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Unknown-Class Detection</h3>
          <p className="text-xs text-ink-muted">Detection rate (%) across selected methods</p>
        </div>
        <button
          type="button"
          onClick={() => setGroupBy((g) => (g === 'class' ? 'method' : 'class'))}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
          aria-label="Toggle grouping between by class and by method"
        >
          <span>{groupBy === 'class' ? 'By class' : 'By method'}</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="h-[248px] w-full" aria-label="Unknown-class detection bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }} barCategoryGap="32%">
            <defs>
              <linearGradient id="activityBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6FA1FF" />
                <stop offset="100%" stopColor="#2F6BFF" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <RechartsTooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: 16,
                boxShadow: 'var(--shadow-pop)',
                fontSize: 12,
                color: 'var(--ink)',
              }}
              formatter={(value) => [`${value}%`, 'Detection rate']}
            />
            <Bar
              dataKey="value"
              barSize={18}
              background={{ fill: 'var(--primary-track)', radius: 9 }}
              shape={<PillBarShape />}
              isAnimationActive={true}
              animationDuration={550}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
