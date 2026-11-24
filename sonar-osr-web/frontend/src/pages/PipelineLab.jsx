import React, { useState } from 'react';
import NoiseLab from '../components/simulation/NoiseLab';
import PhysicsInspector from '../components/simulation/PhysicsInspector';
import AuvPatrol from '../components/simulation/AuvPatrol';
import { Sliders, Layers, Compass } from 'lucide-react';

export default function PipelineLab() {
  const [labTab, setLabTab] = useState('noise');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Acoustic physics and ocean simulation lab</h1>
        <p className="page-desc">
          Interactive testbench for underwater sonar phenomenology: Rayleigh speckle injection, acoustic shadow physics, and AUV mission simulation.
        </p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${labTab === 'noise' ? 'active' : ''}`} onClick={() => setLabTab('noise')}>
          <Sliders size={15} strokeWidth={1.5} /> Ocean noise & speckle workbench
        </button>
        <button className={`tab-btn ${labTab === 'physics' ? 'active' : ''}`} onClick={() => setLabTab('physics')}>
          <Layers size={15} strokeWidth={1.5} /> Highlight & shadow decomposer
        </button>
        <button className={`tab-btn ${labTab === 'auv' ? 'active' : ''}`} onClick={() => setLabTab('auv')}>
          <Compass size={15} strokeWidth={1.5} /> AUV seabed patrol simulator
        </button>
      </div>

      {labTab === 'noise' && <NoiseLab />}
      {labTab === 'physics' && <PhysicsInspector />}
      {labTab === 'auv' && <AuvPatrol />}
    </div>
  );
}
