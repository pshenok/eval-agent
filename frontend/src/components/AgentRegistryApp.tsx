import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Activity,
  Clock,
  Layers,
  Zap,
  Star,
  Play,
  Settings,
  Users,
  Bot,
  Sparkles,
  CheckCircle,
  Combine,
  Check,
} from 'lucide-react';

import { useAgents, useAgentStats } from '@hooks/useAgents';
import { useStagesByAgent } from '@hooks/useStages';
import { useOptimizeAgents } from '@hooks/useOptimizeAgents';
import { cn, getAgentIcon, formatDate, sleep } from '@utils/index';
import type { Agent } from '@types/index';

// Components
import BackgroundFX from './ui/BackgroundFX';
import NavButton from './ui/NavButton';
import StageCard from './stage/StageCard';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import OptimizationAnimation from './ui/OptimizationAnimation';

const AgentRegistryApp: React.FC = () => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animatingStages, setAnimatingStages] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState('registry');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [showOptimizationAnimation, setShowOptimizationAnimation] = useState(false);
  const [optimizingAgentNames, setOptimizingAgentNames] = useState<string[]>([]);

  // Queries
  const { data: agentsData, isLoading: agentsLoading, error: agentsError, refetch } = useAgents();
  const { data: statsData } = useAgentStats();
  const optimizeMutation = useOptimizeAgents();
  
  // Получаем stages только для раскрытого агента
  const { data: expandedAgentStages, isLoading: stagesLoading } = useStagesByAgent(
    expandedAgent || ''
  );

  const agents = agentsData?.items || [];

  // Filter agents based on search
  const filteredAgents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((agent: Agent) =>
      `${agent.name} ${agent.description}`.toLowerCase().includes(q)
    );
  }, [agents, searchTerm]);

  const handleAgentExpand = async (agentId: string) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
      setAnimatingStages([]);
      return;
    }
    
    setExpandedAgent(agentId);
    setAnimatingStages([]);
  };

  // Анимируем stages когда они загружены
  React.useEffect(() => {
    if (expandedAgentStages && expandedAgent && !stagesLoading) {
      const animateStages = async () => {
        setAnimatingStages([]);
        for (let i = 0; i < expandedAgentStages.length; i++) {
          await sleep(120);
          setAnimatingStages((prev) => [...prev, expandedAgentStages[i].id]);
        }
      };
      animateStages();
    }
  }, [expandedAgentStages, expandedAgent, stagesLoading]);

  // Handle agent selection for optimization
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else if (prev.length < 2) {
        return [...prev, agentId];
      }
      return prev;
    });
  };

  // Handle optimization by button click
  const handleOptimizeClick = async () => {
    if (selectedAgents.length !== 2) return;

    // Get agent names for animation
    const agentNames = selectedAgents
      .map(id => agents.find(agent => agent.id === id)?.name)
      .filter(Boolean) as string[];
    
    setOptimizingAgentNames(agentNames);
    setShowOptimizationAnimation(true);

    try {
      const result = await optimizeMutation.mutateAsync({
        agentIds: selectedAgents,
        optimizedAgentName: `Optimized ${agentNames.join(' + ')}`,
        optimizedAgentDescription: `Optimized agent combining the best of ${agentNames.join(' and ')}`
      });
      console.log('Optimization result:', result);
    } catch (error) {
      console.error('Optimization failed:', error);
      // Even if optimization fails, we'll still show the animation and reload
    }
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowOptimizationAnimation(false);
    setOptimizingAgentNames([]);
    setSelectedAgents([]); // Clear selection
    // Reload the page to show new optimized agent
    window.location.reload();
  };

  const isLoading = agentsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (agentsError) {
    return <ErrorMessage error={agentsError} onRetry={() => refetch()} />;
  }

  // Подсчитываем общее количество stages из всех агентов
  const totalStages = agents.reduce((total, agent) => total + (agent.stages?.length || 0), 0);

  return (
    <div className="min-h-screen text-slate-200 bg-[#09090f] selection:bg-fuchsia-500/30 selection:text-fuchsia-50">
      <BackgroundFX />

      {/* Optimization Animation */}
      <AnimatePresence>
        <OptimizationAnimation
          isVisible={showOptimizationAnimation}
          agentNames={optimizingAgentNames}
          onComplete={handleAnimationComplete}
        />
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className={cn('sticky top-0 z-20 px-6 py-4 backdrop-saturate-150', 'glass')}>
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center ring-1 ring-white/20 shadow-[0_8px_30px_rgba(168,85,247,0.35)]">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                ReAgent
              </span>
            </div>
            <div className="hidden sm:flex gap-2 ml-4">
              {/* <NavButton
                icon={Users}
                label="Registry"
                active={currentView === 'registry'}
                onClick={() => setCurrentView('registry')}
              /> */}
              <NavButton
                icon={Activity}
                label="Analytics"
                active={currentView === 'analytics'}
                onClick={() => setCurrentView('analytics')}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Optimize Button */}
            {selectedAgents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className={cn('px-3 py-2 rounded-xl text-sm', 'glass')}>
                  <span className="text-slate-400">Selected:</span>
                  <span className="text-white font-semibold ml-1">{selectedAgents.length}/2</span>
                </div>
                {selectedAgents.length === 2 && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="btn-primary"
                    onClick={handleOptimizeClick}
                    disabled={optimizeMutation.isLoading}
                  >
                    <Combine className="w-4 h-4" />
                    {optimizeMutation.isLoading ? 'Optimizing...' : 'Optimize'}
                  </motion.button>
                )}
              </motion.div>
            )}

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300/60" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                aria-label="Search agents"
              />
            </div>
            <button className="btn-subtle" aria-label="Settings">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Hero Section */}
          <section className={cn('relative overflow-hidden p-8 rounded-3xl', 'glass')}>
            <div className="absolute -top-16 -right-20 w-72 h-72 bg-gradient-to-tr from-violet-500/40 via-fuchsia-500/30 to-emerald-400/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-cyan-400/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                AI Agent{' '}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-emerald-300 bg-clip-text text-transparent">
                  Evaluation
                </span>
              </h2>
              <p className="text-slate-300/90 max-w-2xl mb-5">
                Manage, evaluate, and optimize AI agents. Select 2 agents and click "Optimize" to create an improved agent.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-violet-300">
                  <Activity className="w-4 h-4" />
                  <span>{totalStages} Active Stages</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Star className="w-4 h-4" />
                  <span>{statsData?.totalAgents || agents.length} Registered Agents</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <Zap className="w-4 h-4" />
                  <span>Real‑time Evaluation</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {filteredAgents.map((agent: Agent) => {
              const isExpanded = expandedAgent === agent.id;
              const isSelected = selectedAgents.includes(agent.id);
              const agentStages = isExpanded ? (expandedAgentStages || []) : [];

              return (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.005] ring-1',
                    'glass',
                    isExpanded ? 'ring-violet-500/30' : 'ring-white/5',
                    isSelected ? 'ring-emerald-500/50 bg-emerald-500/5' : ''
                  )}
                >
                  {/* Agent Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Selection Checkbox */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAgentSelect(agent.id)}
                          className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                              : 'border-white/20 hover:border-emerald-400/50'
                          )}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>

                        <div className="text-4xl" aria-hidden>
                          {agent.icon || getAgentIcon(agent.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white truncate">{agent.name}</h3>
                            <div className={cn('px-2 py-1 rounded-full text-xs font-medium', 'glass')}>
                              <Activity className="w-3 h-3 inline mr-1" />
                              Active
                            </div>
                          </div>
                          <p className="text-slate-300/90 text-sm mb-3 max-w-2xl line-clamp-2">
                            {agent.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-slate-400">
                              <Layers className="w-3 h-3" />
                              <span>{agent.stages?.length || 0} stages</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>Updated {formatDate(agent.updatedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Play className="w-4 h-4" />
                          Run Pipeline
                        </button>
                        <button
                          onClick={() => handleAgentExpand(agent.id)}
                          className={cn('p-3 rounded-xl grid place-items-center', 'glass')}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-300" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Stages */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-fuchsia-300" />
                            Pipeline Stages
                          </h4>
                          <div className="flex items-center gap-3 text-sm">
                            <div className={cn('px-3 py-1 rounded-full', 'glass')}>
                              <span className="text-slate-400">Total Stages:</span>
                              <span className="text-white font-semibold ml-1">{agentStages.length}</span>
                            </div>
                            <button
                              className="btn-subtle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="w-4 h-4" />
                              Configure
                            </button>
                          </div>
                        </div>

                        {stagesLoading && expandedAgent === agent.id ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner message="Loading stages..." size="sm" fullScreen={false} />
                          </div>
                        ) : agentStages.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {agentStages.map((stage, index) => (
                              <StageCard
                                key={stage.id}
                                stage={stage}
                                index={index}
                                isAnimated={animatingStages.includes(stage.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={cn('p-8 rounded-2xl text-center', 'glass')}>
                            <Layers className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                            <h5 className="text-lg font-semibold text-white mb-2">No Stages Yet</h5>
                            <p className="text-slate-400 text-sm mb-4">
                              This agent doesn't have any stages configured.
                            </p>
                            <button className="btn-primary">
                              <Settings className="w-4 h-4" />
                              Add Stage
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredAgents.length === 0 && (
              <div className={cn('p-12 rounded-3xl text-center', 'glass')}>
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-slate-400">Try adjusting your search terms or check back later.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-10">
        <div className="mx-auto max-w-7xl text-xs text-slate-500/80">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
          <p>© {new Date().getFullYear()} Agent Registry — Dark UI with AI Optimization</p>
        </div>
      </footer>
    </div>
  );
};

export default AgentRegistryApp;
