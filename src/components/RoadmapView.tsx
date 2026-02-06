import React from 'react';
import { Opportunity, RoadmapData } from '../types';
import { ArrowLeft, Flag, Rocket, Zap, CheckSquare, Users, Target, FileDown, CalendarClock, Hexagon } from 'lucide-react';

interface RoadmapViewProps {
  opportunity: Opportunity;
  data: RoadmapData;
  onBack: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ opportunity, data, onBack }) => {
  const handleExport = () => {
    window.print();
  };

  const phases = [
    {
      id: 'validation',
      title: 'Fase 1: Validación Lean',
      icon: Flag,
      color: 'text-blue-400',
      printColor: 'print:text-blue-700',
      bg: 'bg-blue-500/10',
      printBg: 'print:bg-gray-100',
      border: 'border-blue-500/30',
      printBorder: 'print:border-gray-300',
      data: data.phases.validation
    },
    {
      id: 'pilot',
      title: 'Fase 2: Piloto Tecnológico',
      icon: Zap,
      color: 'text-purple-400',
      printColor: 'print:text-purple-700',
      bg: 'bg-purple-500/10',
      printBg: 'print:bg-gray-100',
      border: 'border-purple-500/30',
      printBorder: 'print:border-gray-300',
      data: data.phases.pilot
    },
    {
      id: 'scaling',
      title: 'Fase 3: Despliegue y Escalado',
      icon: Rocket,
      color: 'text-emerald-400',
      printColor: 'print:text-emerald-700',
      bg: 'bg-emerald-500/10',
      printBg: 'print:bg-gray-100',
      border: 'border-emerald-500/30',
      printBorder: 'print:border-gray-300',
      data: data.phases.scaling
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 print:max-w-none print:animate-none">
      
      {/* Official Report Header - ONLY VISIBLE ON PRINT */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-black pb-4 mb-8">
         <div className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-black" />
            <div>
               <h1 className="text-2xl font-bold text-black uppercase tracking-tight">Octantis AI-Hub</h1>
               <p className="text-xs text-gray-500 uppercase tracking-widest">Informe Estratégico Confidencial</p>
            </div>
         </div>
         <div className="text-right">
             <p className="text-sm font-bold text-black">FECHA</p>
             <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
         </div>
      </div>

      {/* Screen Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-octantis-800 pb-6 print:hidden">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver al Business Case
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Roadmap de Implementación</h2>
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <span>Hoja de ruta estratégica para:</span>
            <span className="font-semibold text-white">{opportunity.title}</span>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-octantis-950 font-bold hover:bg-white hover:scale-105 transition-all shadow-lg shadow-white/10"
        >
          <FileDown className="w-4 h-4" />
          Exportar Informe PDF
        </button>
      </div>

      {/* Print Title (Alternative to screen header) */}
      <div className="hidden print:block mb-8">
         <h2 className="text-3xl font-bold text-black mb-2">Roadmap de Implementación</h2>
         <p className="text-lg text-gray-700">Proyecto: <span className="font-bold">{opportunity.title}</span></p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-8 pl-4 md:pl-0 print:space-y-6 print:pl-0">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-[50%] top-0 bottom-32 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 hidden md:block opacity-30 print:block print:bg-none print:border-l print:border-dashed print:border-gray-400 print:left-8 print:md:left-8 print:opacity-100"></div>

        {phases.map((phase, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={phase.id} className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''} print:flex-row print:gap-8 break-inside-avoid`}>
              
              {/* Timeline Node (Center) */}
              <div className="absolute left-0 md:left-[50%] top-0 md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-octantis-950 border-4 border-octantis-900 z-10 shadow-xl print:static print:transform-none print:bg-white print:border-gray-800 print:shadow-none print:shrink-0 print:w-12 print:h-12">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${phase.bg} ${phase.color} ${phase.printBg} ${phase.printColor}`}>
                    <phase.icon className="w-5 h-5" />
                 </div>
              </div>

              {/* Spacer for alignment (Screen Only) */}
              <div className="flex-1 hidden md:block print:hidden"></div>

              {/* Content Card */}
              <div className="flex-1 ml-12 md:ml-0 print:ml-0 print:w-full">
                <div className={`
                    bg-octantis-900/80 backdrop-blur-sm border ${phase.border} 
                    p-6 rounded-2xl shadow-lg relative group hover:border-opacity-100 transition-colors
                    print:bg-white print:border-gray-300 print:shadow-none print:rounded-lg print:border
                `}>
                  <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-lg font-bold ${phase.color} ${phase.printColor}`}>{phase.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-octantis-950 px-2 py-1 rounded border border-octantis-800 print:bg-gray-100 print:text-gray-700 print:border-gray-300">
                          <CalendarClock className="w-3.5 h-3.5" />
                          {phase.data.duration}
                      </div>
                  </div>

                  <div className="space-y-4">
                      {/* Critical Tasks */}
                      <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 print:text-gray-500">Tareas Críticas</span>
                          <ul className="space-y-2">
                              {phase.data.tasks.map((task, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 print:text-gray-800">
                                      <CheckSquare className={`w-4 h-4 mt-0.5 ${phase.color} ${phase.printColor} opacity-70`} />
                                      {task}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-octantis-800/50 print:border-gray-200">
                          {/* KPI */}
                          <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 print:text-gray-500">Hito de Validación</span>
                              <div className="flex items-center gap-2 text-sm font-semibold text-white print:text-black">
                                  <Target className="w-4 h-4 text-red-400 print:text-red-700" />
                                  {phase.data.kpi}
                              </div>
                          </div>
                          {/* Resources */}
                          <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 print:text-gray-500">Recursos Clave</span>
                              <div className="flex items-center gap-2 text-sm text-slate-400 print:text-gray-700">
                                  <Users className="w-4 h-4" />
                                  <span className="truncate">{phase.data.resources}</span>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps / Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-octantis-900 to-slate-900 border border-octantis-700 rounded-xl p-8 relative overflow-hidden print:bg-none print:bg-white print:border print:border-gray-300 print:mt-8 break-inside-avoid">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none print:hidden"></div>
          
          <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 print:text-black">
                  <Zap className="w-6 h-6 text-yellow-400 fill-current print:text-yellow-600" />
                  Próximos Pasos (48h)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {data.nextSteps48h.map((step, idx) => (
                     <div key={idx} className="flex items-start gap-3 bg-octantis-950/50 p-4 rounded-lg border border-octantis-800 print:bg-gray-50 print:border-gray-200">
                         <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 print:bg-blue-100 print:text-blue-800">
                             {idx + 1}
                         </div>
                         <p className="text-sm text-slate-300 print:text-gray-800">{step}</p>
                     </div>
                 ))}
              </div>
          </div>
      </div>
      
      <div className="h-20 print:hidden"></div> {/* Bottom Spacer */}
    </div>
  );
};