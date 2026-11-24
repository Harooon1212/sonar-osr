import React, { useState } from 'react';
import { Sliders, Layers, Compass } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import Tabs from '../ui/Tabs';
import NoiseLab from '../features/lab/NoiseLab';
import PhysicsInspector from '../features/lab/PhysicsInspector';
import AuvPatrol from '../features/lab/AuvPatrol';

const LAB_TABS = [
  { id: 'noise', label: 'Ocean Noise & Speckle', icon: Sliders },
  { id: 'physics', label: 'Highlight & Shadow', icon: Layers },
  { id: 'auv', label: 'AUV Patrol Simulator', icon: Compass },
];

export default function PipelineLab() {
  const [labTab, setLabTab] = useState('noise');

  return (
    <div>
      <PageHeader
        title="Pipeline Lab"
        subtitle="Interactive acoustic testbench for Rayleigh speckle, shadow physics, and AUV patrol simulation"
        action={
          <Tabs
            layoutId="pipeline-lab-tabs"
            tabs={LAB_TABS}
            value={labTab}
            onChange={setLabTab}
          />
        }
      />

      {labTab === 'noise' && <NoiseLab />}
      {labTab === 'physics' && <PhysicsInspector />}
      {labTab === 'auv' && <AuvPatrol />}
    </div>
  );
}
