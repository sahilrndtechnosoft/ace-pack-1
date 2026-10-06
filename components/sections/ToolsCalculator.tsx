'use client';
import { useState } from 'react';
import { cartonPlan } from '@/lib/data/resources';

export function ToolsCalculator() {
  const [capacity,setCapacity] = useState('500');
  const [quantity,setQuantity] = useState('10000');
  const [units,setUnits] = useState('500');
  const ml = Number(capacity);
  const plan = cartonPlan(Number(quantity),Number(units));
  return <div className="resource-grid">
    <section className="resource-tool" aria-labelledby="capacity-tool"><h2 id="capacity-tool">Capacity converter</h2><p>Compare millilitres and litres when reviewing container specifications.</p>
      <label>Capacity in millilitres (ml)<input type="number" min="0" step="any" value={capacity} onChange={e=>setCapacity(e.target.value)} /></label>
      <output aria-live="polite">{capacity.trim() && Number.isFinite(ml) && ml>=0 ? `${ml.toLocaleString()} ml = ${(ml/1000).toLocaleString(undefined,{maximumFractionDigits:6})} litres` : 'Enter a valid, non-negative capacity.'}</output>
    </section>
    <section className="resource-tool" aria-labelledby="carton-tool"><h2 id="carton-tool">Carton planner</h2><p>Estimate full cartons using the packing configuration provided by our team.</p>
      <label>Containers required<input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} /></label>
      <label>Containers per carton<input type="number" min="1" step="1" value={units} onChange={e=>setUnits(e.target.value)} /></label>
      <output aria-live="polite">{plan ? `${plan.cartons.toLocaleString()} full cartons · ${plan.spare.toLocaleString()} additional containers` : 'Enter positive whole numbers within a valid range.'}</output>
    </section>
  </div>;
}
