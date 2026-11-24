import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '../../ui/Dropdown';
import MultiSelect from '../../ui/MultiSelect';
import { useFilters, ALL_METHOD_IDS } from '../../store/useFilters';

const SPLIT_OPTIONS = [
  { value: 'all', label: 'All data' },
  { value: 'watertank', label: 'Watertank (phase 1)', disabled: true, disabledReason: 'No data exported yet' },
  { value: 'turntable', label: 'Turntable (phase 2)', disabled: true, disabledReason: 'No data exported yet' },
];

const METHOD_ITEMS = [
  { id: 'dml', label: 'Deep Metric Learning (DML)', shortLabel: 'DML', group: 'Geometric' },
  { id: 'svdd', label: 'Deep SVDD (Hypersphere)', shortLabel: 'SVDD', group: 'Boundary-Based' },
  { id: 'msp', label: 'Baseline MSP (Softmax)', shortLabel: 'MSP', group: 'Confidence-Based' },
];

const METHOD_GROUPS = [
  { id: 'geometric', label: 'Geometric / Embedding', count: 1, memberIds: ['dml'] },
  { id: 'boundary', label: 'Boundary-Based', count: 1, memberIds: ['svdd'] },
  { id: 'confidence', label: 'Confidence-Based', count: 1, memberIds: ['msp'] },
];

const CLASS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'known', label: 'Known (6)' },
  { value: 'unknown', label: 'Unknown (4)' },
  { value: 'bottle', label: 'bottle (Known)' },
  { value: 'can', label: 'can (Known)' },
  { value: 'tire', label: 'tire (Known)' },
  { value: 'drink-carton', label: 'drink-carton (Known)' },
  { value: 'hook', label: 'hook (Known)' },
  { value: 'propeller', label: 'propeller (Known)' },
  { value: 'chain', label: 'chain (Unknown)' },
  { value: 'valve', label: 'valve (Unknown)' },
  { value: 'shampoo-bottle', label: 'shampoo-bottle (Unknown)' },
  { value: 'standing-bottle', label: 'standing-bottle (Unknown)' },
];

export default function FiltersBar() {
  const { split, methods, classFilter, setSplit, setMethods, clearMethods, setClassFilter, hydrateFromSearch } =
    useFilters();
  const location = useLocation();
  const navigate = useNavigate();

  // Hydrate from URL on first mount
  useEffect(() => {
    if (location.search) {
      hydrateFromSearch(location.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync store -> URL query string
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('split', split);
    params.set('methods', methods.length > 0 ? methods.join(',') : 'none');
    params.set('class', classFilter);
    const nextSearch = `?${params.toString()}`;
    if (location.search !== nextSearch) {
      navigate({ pathname: location.pathname, search: nextSearch }, { replace: true });
    }
  }, [split, methods, classFilter, location.pathname, location.search, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Dropdown
        label="Dataset split"
        value={split}
        options={SPLIT_OPTIONS}
        onChange={setSplit}
      />
      <MultiSelect
        label="Methods"
        selectedIds={methods}
        items={METHOD_ITEMS}
        groups={METHOD_GROUPS}
        onChange={(next) => setMethods(next)}
        onClear={() => clearMethods()}
      />
      <Dropdown
        label="Class"
        value={classFilter}
        options={CLASS_OPTIONS}
        onChange={setClassFilter}
      />
    </div>
  );
}
