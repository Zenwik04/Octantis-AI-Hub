import React from 'react';
import { Opportunity } from '../types';

interface OpportunityRadarProps {
  opportunities: Opportunity[];
}

export const OpportunityRadar: React.FC<OpportunityRadarProps> = ({ opportunities }) => {
  return (
    <div className="w-full aspect-square max-w-[500px] mx-auto relative group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-3xl transform scale-90"></div>
      
      {/* Radar Container */}
      <div className="relative w-full h-full rounded-full border border-octantis-800 bg-octantis-950/50 backdrop-blur-sm shadow-[0_0_50px_rgba(30,41,59,0.5)] overflow-hidden">
        
        {/* Grid Lines (Concentric Circles) */}
        <div className="absolute inset-0 m-auto w-[25%] h-[25%] rounded-full border border-octantis-700/30"></div>
        <div className="absolute inset-0 m-auto w-[50%] h-[50%] rounded-full border border-octantis-700/30"></div>
        <div className="absolute inset-0 m-auto w-[75%] h-[75%] rounded-full border border-octantis-700/30"></div>
        
        {/* Crosshair Lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-octantis-700/30"></div>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-octantis-700/30"></div>

        {/* Labels */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono tracking-widest">ALTO IMPACTO</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono tracking-widest">BAJO IMPACTO</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono tracking-widest writing-mode-vertical">ALTA VIABILIDAD</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono tracking-widest writing-mode-vertical">BAJA VIABILIDAD</span>

        {/* Opportunity Points */}
        {opportunities.map((opp, index) => {
          // Map scores (0-100) to position (0-100%)
          // Impact (Y axis): 100 is top (0%), 0 is bottom (100%)
          const top = 100 - opp.impactScore;
          // Feasibility (X axis): 100 is right (100%), 0 is left (0%)
          const left = opp.feasibilityScore;

          const isRadical = opp.type === 'Radical';

          return (
            <div
              key={opp.id}
              className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer group/point transition-all duration-500 ease-out hover:scale-150 hover:z-50"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <div className={`
                w-full h-full rounded-full border-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                ${isRadical 
                  ? 'bg-purple-500 border-purple-300 shadow-purple-500/40 animate-pulse' 
                  : 'bg-blue-500 border-blue-300 shadow-blue-500/40'}
              `}></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover/point:block z-50">
                <div className="bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded shadow-xl text-center">
                  {opp.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
