import React, { useState } from 'react';
import {
  ShieldAlert,
  Home,
  CheckCircle,
  Waves,
  ZapOff,
  AlertTriangle,
} from 'lucide-react';

export const EmergencyGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'antes' | 'durante' | 'despues'>('antes');

  return (
    <section id="guia" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="border-b border-[#DDE1DF] pb-3">
          <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 stroke-[1.75]" />
            Protocolos de Protección Civil
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#252A2E] mt-0.5">
            Protocolo de Actuación por Fases
          </h2>
          <p className="text-xs text-[#687078] mt-0.5 max-w-2xl">
            Instrucciones oficiales para salvaguardar la vida y el patrimonio antes, durante y después del impacto ciclónico.
          </p>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-1.5 p-1 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px]">
          <button
            onClick={() => setActiveTab('antes')}
            className={`flex-1 py-1.5 px-3 rounded-[3px] text-xs font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'antes'
                ? 'bg-[#245A66] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>1. Antes del Impacto</span>
          </button>

          <button
            onClick={() => setActiveTab('durante')}
            className={`flex-1 py-1.5 px-3 rounded-[3px] text-xs font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'durante'
                ? 'bg-[#B84A45] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>2. Durante el Huracán</span>
          </button>

          <button
            onClick={() => setActiveTab('despues')}
            className={`flex-1 py-1.5 px-3 rounded-[3px] text-xs font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'despues'
                ? 'bg-[#7D9B8A] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>3. Después del Paso</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-1">
          {activeTab === 'antes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#252A2E] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
                  Aseguramiento del Hogar
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Proteja ventanas de vidrio con cinta o paneles de madera para prevenir roturas por viento.</li>
                  <li>Fije o guarde objetos sueltos en azoteas y patios (tinacos ligeros, tanques de gas, macetas).</li>
                  <li>Limpie coladeras y desagües para facilitar el flujo pluvial y reducir anegamientos.</li>
                  <li>Cierre el suministro de gas y desconecte la energía si el agua comienza a ingresar.</li>
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#252A2E] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#A66C19] stroke-[1.75]" />
                  Plan Familiar y Evacuación Preventiva
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Ubique el refugio temporal más cercano a su domicilio en el directorio.</li>
                  <li>Empaque documentos oficiales en bolsas herméticas de plástico.</li>
                  <li>Si vive en zona baja, estero o margen de río, acate la orden de evacuación oportuna.</li>
                  <li>Prevea alimento, correa y transportadora para animales domésticos.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'durante' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F7F7F4] border border-[#B84A45]/30 rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#B84A45] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B84A45] stroke-[1.75]" />
                  Resguardo Obligatorio en Interiores
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Permanezca en la habitación más resistente de la vivienda, lejos de ventanales y canceles.</li>
                  <li>No salga a la vía pública; las ráfagas proyectan láminas, ramas y escombros peligrosos.</li>
                  <li>Utilice linternas de baterías en lugar de velas para evitar incendios accidentales.</li>
                  <li>Conserve la calma y mantenga a niños y personas mayores en el área más segura.</li>
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#B84A45]/30 rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#B84A45] flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
                  Precaución con el Ojo del Ciclón
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Calma aparente:</strong> Si el viento cesa bruscamente, el ojo del huracán está cruzando la zona.</li>
                  <li>NO abandone el refugio; en pocos minutos los vientos se reanudarán en sentido opuesto.</li>
                  <li>Espere el aviso formal de las autoridades antes de dar por concluida la contingencia.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'despues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#252A2E] flex items-center gap-1.5">
                  <ZapOff className="w-3.5 h-3.5 text-[#A66C19] stroke-[1.75]" />
                  Riesgos Secundarios
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Evite acercarse a postes o cables caídos; repórtelos de inmediato al 071 de CFE.</li>
                  <li>No cruce vados, ríos o calles anegadas a pie o en vehículo; la corriente puede arrastrarlos.</li>
                  <li>Revise que no haya fugas de gas antes de encender interruptores o fósforos.</li>
                  <li>Consuma exclusivamente agua embotellada o debidamente hervida.</li>
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-semibold text-[#252A2E] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#3F8063] stroke-[1.75]" />
                  Retorno y Evaluación
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Regrese a su domicilio únicamente cuando Protección Civil declare la zona segura.</li>
                  <li>Documente fotográficamente daños materiales para gestiones de seguro o apoyos.</li>
                  <li>Colabore en la eliminación de encharcamientos para prevenir la proliferación de mosquitos.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
