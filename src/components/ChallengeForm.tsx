import React, { useState } from 'react';
import { OctantisScope, ChallengeState } from '../types';
import { Sparkles, ArrowRight, Target, Activity, Clock, Cpu } from 'lucide-react';

interface ChallengeFormProps {
  onSubmit: (data: ChallengeState) => void;
  isLoading: boolean;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ChallengeState>({
    scope: '',
    description: '',
    criteria: {
      risk: 50,
      timeHorizon: 50,
      techMaturity: 50
    }
  });

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, scope: e.target.value as OctantisScope }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleSliderChange = (key: keyof typeof formData.criteria, value: string) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: parseInt(value, 10)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.scope && formData.description) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Configuración de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Reto Estratégico</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Define los parámetros clave para que nuestro motor de IA identifique y mapee las oportunidades de mayor impacto en tu sector.
        </p>
      </div>

      <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/20 to-transparent">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-1000"></div>
        
        <form onSubmit={handleSubmit} className="relative bg-octantis-900/90 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl border border-octantis-800">
          
          {/* Section 1: Scope & Definition */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            <div className="md:col-span-12">
              <label htmlFor="scope" className="flex items-center gap-2 text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">
                <Target className="w-4 h-4" /> Ámbito de Actuación
              </label>
              <div className="relative">
                <select 
                  id="scope"
                  value={formData.scope}
                  onChange={handleScopeChange}
                  className="w-full bg-octantis-950 border border-octantis-700 rounded-lg px-4 py-3.5 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all shadow-inner"
                  required
                >
                  <option value="" disabled className="text-slate-500">Seleccione un ámbito estratégico...</option>
                  {Object.values(OctantisScope).map((scope) => (
                    <option key={scope} value={scope}>{scope}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-12">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Descripción del Reto
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleDescriptionChange}
                rows={5}
                className="w-full bg-octantis-950 border border-octantis-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-inner"
                placeholder="Describa el problema, las necesidades específicas y los objetivos estratégicos que busca resolver con esta iniciativa..."
                required
              />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-octantis-700 to-transparent mb-10"></div>

          {/* Section 2: Investor Criteria (Sliders) */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Criterio Inversor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Risk Slider */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" /> Riesgo
                  </label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {formData.criteria.risk < 33 ? 'Conservador' : formData.criteria.risk < 66 ? 'Moderado' : 'Agresivo'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.criteria.risk}
                  onChange={(e) => handleSliderChange('risk', e.target.value)}
                  className="w-full h-2 bg-octantis-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Bajo</span>
                  <span>Alto</span>
                </div>
              </div>

              {/* Time Horizon Slider */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" /> Horizonte
                  </label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {formData.criteria.timeHorizon < 33 ? 'Corto Plazo' : formData.criteria.timeHorizon < 66 ? 'Medio Plazo' : 'Largo Plazo'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.criteria.timeHorizon}
                  onChange={(e) => handleSliderChange('timeHorizon', e.target.value)}
                  className="w-full h-2 bg-octantis-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Inmediato</span>
                  <span>Futuro</span>
                </div>
              </div>

              {/* Tech Maturity Slider */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" /> Madurez
                  </label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {formData.criteria.techMaturity < 33 ? 'Emergente' : formData.criteria.techMaturity < 66 ? 'Crecimiento' : 'Consolidada'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.criteria.techMaturity}
                  onChange={(e) => handleSliderChange('techMaturity', e.target.value)}
                  className="w-full h-2 bg-octantis-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Experimental</span>
                  <span>Probada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                relative overflow-hidden group w-full md:w-auto px-8 py-4 rounded-xl 
                bg-gradient-to-r from-blue-600 to-cyan-600 
                text-white font-bold text-lg tracking-wide shadow-lg shadow-blue-500/25
                hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    Generar Mapa de Oportunidades
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
