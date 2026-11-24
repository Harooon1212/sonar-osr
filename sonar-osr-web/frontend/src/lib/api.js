// API client for SonarOSR FastAPI backend and static fallbacks

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Status not 200');
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function fetchMeta() {
  try {
    const res = await fetch(`${API_BASE}/meta`);
    if (!res.ok) throw new Error('Failed to fetch metadata');
    return await res.json();
  } catch (err) {
    console.warn('Backend meta offline, using cached metadata');
    return {
      known_classes: ['bottle', 'can', 'tire', 'drink-carton', 'hook', 'propeller'],
      unknown_classes: ['chain', 'valve', 'shampoo-bottle', 'standing-bottle'],
      sensor_specs: {
        device: 'ARIS Explorer 3000',
        frequency: '3.0 MHz / 1.8 MHz',
        resolution: 'High-frequency forward-looking acoustic imaging'
      }
    };
  }
}

export async function fetchBenchmarkData() {
  try {
    const res = await fetch('/data/results.json');
    if (!res.ok) throw new Error('Failed to fetch results.json');
    return await res.json();
  } catch (err) {
    console.error('Error loading benchmark data:', err);
    return null;
  }
}

export async function fetchSampleManifest() {
  try {
    const res = await fetch('/samples/manifest.json');
    if (!res.ok) throw new Error('Failed to fetch samples manifest');
    return await res.json();
  } catch (err) {
    console.error('Error loading sample manifest:', err);
    return [];
  }
}

export async function runPredict(imageFile, threshold = 0.5, method = 'all') {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('threshold', threshold.toString());
  formData.append('custom_tau', threshold.toString());
  formData.append('method', method);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Prediction failed: ${errText}`);
  }
  return await res.json();
}

export async function runPhysicsExtraction(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${API_BASE}/physics`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Physics extraction failed: ${errText}`);
  }
  return await res.json();
}

export async function runNoiseSimulation(imageFile, noiseVariance = 0.15, turbidity = 0.25) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('noise_variance', noiseVariance.toString());
  formData.append('speckle_intensity', noiseVariance.toString());
  formData.append('turbidity', turbidity.toString());

  const res = await fetch(`${API_BASE}/simulate-noise`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Noise simulation failed: ${errText}`);
  }
  return await res.json();
}
