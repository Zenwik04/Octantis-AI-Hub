import React from 'react';
import { ChallengeState, Opportunity } from '../types';
import { OpportunityRadar } from './OpportunityRadar';
import { ArrowLeft, Zap, Layers, BarChart3, Plus, CheckCircle2 } from 'lucide-react';

interface OpportunityExplorationProps {
  challenge: ChallengeState;
  opportunities: Opportunity[];
  onBack: () => void;
  onPrioritize: (id: string) => void;
}

export const OpportunityExploration: React.FC<OpportunityExplorationProps> = ({ challenge, opportunities, onBack, onPrioritize }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Summary */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-octantis-800 pb-8">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Configurar nuevo reto
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Exploración de Oportunidades
            <span className="text-xs font-normal px-2 py-1 rounded-full border border-octantis-700 bg-octantis-900 text-slate-400">
              AI Generated
            </span>
          </h2>
          <div className="mt-2 text-slate-400 text-sm flex items-center gap-2">
            <span className="font-semibold text-blue-400">{challenge.scope}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="truncate max-w-md opacity-80">{challenge.description}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Oportunidades</div>
                <div className="text-2xl font-bold text-white">{opportunities.length}</div>
            </div>
            <div className="w-px bg-octantis-800"></div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disrupción</div>
                <div className="text-2xl font-bold text-purple-400">
                    {opportunities.filter(o => o.type === 'Radical').length} <span className="text-sm font-normal text-slate-500">Radicales</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Radar (Sticky on large screens) */}
        <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Opportunity Radar
                    </h3>
                    <div className="flex gap-2 text-xs">
                         <span className="flex items-center gap-1 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Incremental
                         </span>
                         <span className="flex items-center gap-1 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Radical
                         </span>
                    </div>
                </div>
                <OpportunityRadar opportunities={opportunities} />
                <div className="mt-8 p-4 rounded-xl bg-octantis-900/50 border border-octantis-800 text-sm text-slate-400">
                    <p>El radar posiciona las oportunidades basándose en su <strong>Impacto Estimado</strong> (Eje Y) y <strong>Viabilidad Técnica</strong> (Eje X).</p>
                </div>
            </div>
        </div>

        {/* Right Column: Grid of Cards */}
        <div className="lg:col-span-7 xl:col-span-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                Tarjetas de Oportunidades
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunities.map((opp) => (
                    <div 
                        key={opp.id} 
                        className="group relative flex flex-col bg-octantis-900 border border-octantis-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`
                                p-3 rounded-lg 
                                ${opp.type === 'Radical' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}
                            `}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className={`
                                text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border
                                ${opp.type === 'Radical' 
                                    ? 'bg-purple-950/30 border-purple-500/30 text-purple-300' 
                                    : 'bg-blue-950/30 border-blue-500/30 text-blue-300'}
                            `}>
                                {opp.type}
                            </span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {opp.title}
                        </h4>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            {opp.description}
                        </p>

                        <div className="pt-4 mt-auto border-t border-octantis-800 flex items-center justify-between">
                            <div className="flex gap-3 text-xs text-slate-500 font-mono">
                                <span>IMP: {opp.impactScore}%</span>
                                <span>VIA: {opp.feasibilityScore}%</span>
                            </div>
                            <button 
                                onClick={() => onPrioritize(opp.id)}
                                className="flex items-center gap-2 text-xs font-semibold text-white bg-octantis-800 hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors"
                            >
                                Priorizar
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card Placeholder */}
                <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-octantis-700 bg-octantis-950/30 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-octantis-900/50 transition-all min-h-[250px] group">
                    <div className="w-12 h-12 rounded-full bg-octantis-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Añadir Oportunidad Manual</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
