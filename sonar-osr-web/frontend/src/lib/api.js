// API client for SonarOSR FastAPI backend and static fallbacks

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_TIMEOUT_MS = 15000;

function mergeSignals(externalSignal, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs);

  const onExternalAbort = () => {
    controller.abort(externalSignal?.reason || new Error('Aborted'));
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
    },
  };
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err?.message || 'Unreachable' };
  }
}

export async function fetchMeta() {
  try {
    const res = await fetch(`${API_BASE}/meta`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Failed to fetch metadata');
    return await res.json();
  } catch {
    return {
      framework: 'SonarOSR (ResNet-50 + DML / Deep SVDD / MSP)',
      institution: 'Bahria University, Islamabad',
      sensor: 'Sound Metrics ARIS Explorer 3000 (3.0 MHz / 1.8 MHz)',
      known_classes: ['bottle', 'can', 'tire', 'drink-carton', 'hook', 'propeller'],
      unknown_classes: ['chain', 'valve', 'shampoo-bottle', 'standing-bottle'],
      sensor_specs: {
        device: 'ARIS Explorer 3000',
        frequency: '3.0 MHz / 1.8 MHz',
        resolution: 'High-frequency forward-looking acoustic imaging',
      },
    };
  }
}

export async function fetchBenchmarkData() {
  try {
    const res = await fetch('/data/results.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error loading benchmark data:', err);
    return null;
  }
}

export async function fetchSampleManifest() {
  try {
    const res = await fetch('/samples/manifest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error loading sample manifest:', err);
    return [];
  }
}

export async function runPredict(imageFile, threshold = 0.5, method = 'all', options = {}) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('threshold', threshold.toString());
  formData.append('custom_tau', threshold.toString());
  formData.append('method', method);

  const { signal, cleanup } = mergeSignals(options.signal, options.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
      signal,
    });
    if (!res.ok) {
      let detail = '';
      try {
        const json = await res.json();
        detail = json?.detail || JSON.stringify(json);
      } catch {
        detail = await res.text();
      }
      throw new Error(detail || `Prediction failed (HTTP ${res.status})`);
    }
    return await res.json();
  } finally {
    cleanup();
  }
}

export async function runPhysicsExtraction(imageFile, options = {}) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const { signal, cleanup } = mergeSignals(options.signal, options.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/physics`, {
      method: 'POST',
      body: formData,
      signal,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Physics extraction failed (HTTP ${res.status})`);
    }
    return await res.json();
  } finally {
    cleanup();
  }
}

export async function runNoiseSimulation(imageFile, noiseVariance = 0.15, turbidity = 0.25, options = {}) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('noise_variance', noiseVariance.toString());
  formData.append('speckle_intensity', noiseVariance.toString());
  formData.append('turbidity', turbidity.toString());

  const { signal, cleanup } = mergeSignals(options.signal, options.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/simulate-noise`, {
      method: 'POST',
      body: formData,
      signal,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Noise simulation failed (HTTP ${res.status})`);
    }
    return await res.json();
  } finally {
    cleanup();
  }
}
