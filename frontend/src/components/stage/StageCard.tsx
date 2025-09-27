import React from 'react';
import { motion } from 'framer-motion';
import { cn, getVendorColor } from '@utils/index';
import type { Stage } from '@types/index';

interface StageCardProps {
  stage: Stage;
  index: number;
  isAnimated: boolean;
}

const StageCard: React.FC<StageCardProps> = ({ stage, index, isAnimated }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.98 }}
    animate={isAnimated ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    className={cn(
      'p-4 rounded-2xl group transition-all duration-500 hover:scale-[1.02]',
      'glass'
    )}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10">
          <span className="text-white font-bold text-sm">{stage.sequence}</span>
        </div>
        <div>
          <h5 className="font-semibold text-white text-sm">{stage.name}</h5>
          <p className="text-xs text-slate-400">{stage.type}</p>
        </div>
      </div>

      <div
        className={cn(
          'px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg shadow-black/20',
          `bg-gradient-to-r ${getVendorColor(stage.vendor)}`
        )}
      >
        {stage.vendor}
      </div>
    </div>

    {stage.description && (
      <p className="text-xs text-slate-300/90 mb-3 line-clamp-2">{stage.description}</p>
    )}

    <div className="space-y-2 text-xs">
      <div className={cn('p-2 rounded-lg', 'glass')}>
        <span className="text-slate-400 font-medium">Input:</span>
        <p className="text-slate-200 mt-1 line-clamp-1">{stage.input}</p>
      </div>
      <div className={cn('p-2 rounded-lg', 'glass')}>
        <span className="text-slate-400 font-medium">Output:</span>
        <p className="text-slate-200 mt-1 line-clamp-1">{stage.output}</p>
      </div>
    </div>

    {stage.evaluation && (
      <div className="mt-3 pt-3 border-t border-white/10">
        <span className="text-xs text-slate-400 font-medium">Evaluation Metrics:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.keys(stage.evaluation)
            .slice(0, 3)
            .map((metric) => (
              <span
                key={metric}
                className="px-2 py-1 text-[10px] rounded-full bg-white/10 text-slate-300"
              >
                {metric}
              </span>
            ))}
        </div>
      </div>
    )}
  </motion.div>
);

export default StageCard;
