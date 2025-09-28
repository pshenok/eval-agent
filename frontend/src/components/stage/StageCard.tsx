import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Hash } from 'lucide-react';
import { cn, getVendorColor } from '@utils/index';
import type { Stage } from '@types/index';

interface StageCardProps {
  stage: Stage;
  index: number;
  isAnimated: boolean;
}

const StageCard: React.FC<StageCardProps> = ({ stage, index, isAnimated }) => {
  // Extract metrics from evaluation object
  const metrics = stage.evaluation?.metrics;
  const hasMetrics = metrics && typeof metrics === 'object';

  // Format metrics for display
  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;
  const formatTime = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${ms}ms`;
  };
  const formatTokens = (tokens: number) => tokens.toLocaleString();

  return (
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

      {/* Performance Metrics Section */}
      {hasMetrics && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-slate-400 font-medium mb-3 block">Performance Metrics</span>
          
          {/* Metrics in 3-column grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Cost Metric */}
            {typeof metrics.cost_usd === 'number' && (
              <div className={cn('p-2 rounded-lg text-center', 'glass')}>
                <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 mb-1">Cost</div>
                <div className="text-xs text-white font-semibold">
                  {formatCost(metrics.cost_usd)}
                </div>
              </div>
            )}

            {/* Time Metric */}
            {typeof metrics.total_ms === 'number' && (
              <div className={cn('p-2 rounded-lg text-center', 'glass')}>
                <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 mb-1">Time</div>
                <div className="text-xs text-white font-semibold">
                  {formatTime(metrics.total_ms)}
                </div>
              </div>
            )}

            {/* Tokens Metric */}
            {typeof metrics.tokens_in === 'number' && (
              <div className={cn('p-2 rounded-lg text-center', 'glass')}>
                <Hash className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 mb-1">Tokens</div>
                <div className="text-xs text-white font-semibold">
                  {formatTokens(metrics.tokens_in)}
                </div>
              </div>
            )}
          </div>

          {/* Summary bar at the bottom */}
          <div className={cn('mt-2 p-2 rounded-lg', 'glass')}>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Performance</span>
              <div className="flex items-center gap-3">
                {typeof metrics.cost_usd === 'number' && (
                  <span className="text-emerald-300">
                    💰 {formatCost(metrics.cost_usd)}
                  </span>
                )}
                {typeof metrics.total_ms === 'number' && (
                  <span className="text-blue-300">
                    ⏱️ {formatTime(metrics.total_ms)}
                  </span>
                )}
                {typeof metrics.tokens_in === 'number' && (
                  <span className="text-violet-300">
                    🔢 {formatTokens(metrics.tokens_in)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for stages without metrics */}
      {stage.evaluation && !hasMetrics && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-slate-400 font-medium">Evaluation Data:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.keys(stage.evaluation)
              .slice(0, 3)
              .map((key) => (
                <span
                  key={key}
                  className="px-2 py-1 text-[10px] rounded-full bg-white/10 text-slate-300"
                >
                  {key}
                </span>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StageCard;
