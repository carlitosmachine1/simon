import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  Home,
  CheckCircle,
  HelpCircle,
  Waves,
  ZapOff,
  Flame,
  PhoneCall,
} from 'lucide-react';

export const EmergencyGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'antes' | 'durante' | 'despues'>('antes');

  return (
    <section id="que-hacer" className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            Protocolos de Protección Civil
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¿Qué Hacer ante el Huracán Simón?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Siga estas instrucciones paso a paso para proteger la vida de su familia y mascotas
            en las fases previa, de impacto y posterior al huracán categoría 4.
          </p>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('antes')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'antes'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. ANTES del Impacto</span>
          </button>

          <button
            onClick={() => setActiveTab('durante')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'durante'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. DURANTE el Huracán</span>
          </button>

          <button
            onClick={() => setActiveTab('despues')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'despues'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. DESPUÉS de la Tormenta</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'antes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-400" />
                  Protección de la Vivienda
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Coloque cinta adhesiva en forma de "X" o madera en ventanas de cristal contra proyectiles de viento.</li>
                  <li>Asegure o guarde tinacos, tanques de gas ligeros, macetas y láminas en azoteas.</li>
                  <li>Limpie coladeras, canales pluviales y desagües para facilitar la salida del agua.</li>
                  <li>Cierre llaves de gas y baje el interruptor eléctrico general si el agua empieza a entrar.</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  Plan Familiar y Evacuación
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Identifique con anticipación el refugio temporal más cercano habilitado en su colonia.</li>
                  <li>Tenga lista la mochila de emergencia con documentos en bolsas impermeables selladas.</li>
                  <li>Si las autoridades emiten orden de evacuación en su zona, desaloje de inmediato y sin dudar.</li>
                  <li>Asegure el resguardo seguro y alimento de sus animales domésticos.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'durante' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-950/70 border border-red-900/40 rounded-xl p-4 space-y-2">
                <div className="font-bold text-red-400 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Resguardo Total en Interiores
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Permanezca en el cuarto más seguro de la casa (sin ventanas o con muros de concreto reforzados).</li>
                  <li>Aléjese por completo de puertas de vidrio, ventanas y canceles.</li>
                  <li>No salga a la intemperie bajo ninguna circunstancia, las rachas de 295 km/h proyectan ramas y escombros mortales.</li>
                  <li>Mantenga apagadas las luces y use únicamente linternas de pilas (evite velas por fugas de gas).</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-red-900/40 rounded-xl p-4 space-y-2">
                <div className="font-bold text-red-400 flex items-center gap-2">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  Cuidado con el Ojo del Huracán
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>¡Alerta con la calma engañosa!:</strong> Si de pronto cesa el viento y sale el sol, está pasando el ojo del huracán.</li>
                  <li>NO salga; en cuestión de minutos los vientos reanudarán con la misma furia en sentido opuesto.</li>
                  <li>Monitoree la radio de pilas para confirmar cuando el vórtice se haya alejado totalmente.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'despues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-blue-300 flex items-center gap-2">
                  <ZapOff className="w-4 h-4 text-blue-400" />
                  Precaución con Riesgos Ocultos
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>No toque ni se acerque a cables eléctricos caídos en charcos o vías públicas. Reporte al 071 de CFE.</li>
                  <li>No cruce ríos crecidos, arroyos ni calles inundadas a pie o en auto; la corriente arrastra vehículos pesados.</li>
                  <li>Inspeccione fugas de gas con agua y jabón antes de encender estufas o fósforos.</li>
                  <li>Beba solo agua embotellada o previamente hervida para evitar brotes de cólera o infecciones gastrointestinales.</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-blue-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Regreso Seguro a Casa
                </div>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Espere el aviso formal de Protección Civil antes de abandonar el refugio temporal.</li>
                  <li>Tome fotografías de los daños materiales para los reportes de seguros o apoyos gubernamentales.</li>
                  <li>Participe en brigadas de limpieza comunitaria para retirar lodo y cacharros que acumulen mosquitos del dengue.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
