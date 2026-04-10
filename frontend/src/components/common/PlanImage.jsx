import { Battery, ImageOff, PanelTop, Zap } from 'lucide-react';
import { planPlaceholders } from '../../config/siteContent';

const equipmentIcons = {
  panel: PanelTop,
  inverter: Zap,
  battery: Battery,
};

export default function PlanImage({ src, alt, type = 'plan', planType = 'basic', className = '' }) {
  const fallback = type === 'panel'
    ? planPlaceholders.panel
    : type === 'inverter'
      ? planPlaceholders.inverter
      : type === 'battery'
        ? planPlaceholders.battery
        : planPlaceholders[planType] || planPlaceholders.basic;

  const Icon = equipmentIcons[type];

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src || fallback}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallback;
        }}
      />
      {Icon ? (
        <div className="absolute left-3 top-3 rounded-full bg-slate-950/70 p-2 text-white">
          <Icon className="h-4 w-4" />
        </div>
      ) : (
        <div className="absolute left-3 top-3 rounded-full bg-slate-950/70 p-2 text-white">
          <ImageOff className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
