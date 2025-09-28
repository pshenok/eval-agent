import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Bot, CheckCircle } from 'lucide-react';
import { cn } from '@utils/index';

interface OptimizationAnimationProps {
  isVisible: boolean;
  agentNames: string[];
  onComplete: () => void;
}

const OptimizationAnimation: React.FC<OptimizationAnimationProps> = ({
  isVisible,
  agentNames,
  onComplete,
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 40000); // Изменено с 5000 на 40000 (40 секунд)
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
    >
      <div className={cn('p-12 rounded-3xl text-center max-w-md mx-4', 'glass')}>
        {/* Animated Icons */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-white/40"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: [0, 360],
                x: [0, 40 + i * 10, 0],
                y: [0, 0, 0],
              }}
              transition={{
                duration: 1.5 + i * 0.2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-4"
        >
          <Zap className="w-6 h-6 inline mr-2 text-yellow-400" />
          Optimizing Agents
        </motion.h3>

        {/* Agent names */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-slate-300 mb-3">Combining agents:</p>
          <div className="space-y-2">
            {agentNames.map((name, index) => (
              <motion.div
                key={name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.2 }}
                className={cn('p-3 rounded-xl flex items-center gap-3', 'glass')}
              >
                <Bot className="w-5 h-5 text-violet-400" />
                <span className="text-white font-medium">{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          {[
            { text: 'Analyzing agent stages...', delay: 0 },
            { text: 'Querying Claude AI...', delay: 5000 },
            { text: 'Processing with Claude...', delay: 15000 },
            { text: 'Optimizing sequence...', delay: 25000 },
            { text: 'Creating new agent...', delay: 30000 },
            { text: 'Finalizing optimization...', delay: 35000 },
            { text: 'Complete! ✨', delay: 38000 },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay / 1000 }}
              className="flex items-center gap-3 text-sm text-slate-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.delay / 1000 + 0.1 }}
                className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center"
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </motion.div>
              <span>{step.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 40, ease: "easeInOut" }} // Изменено с 5 на 40 секунд
          className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full mt-8"
        />
      </div>
    </motion.div>
  );
};

export default OptimizationAnimation;
