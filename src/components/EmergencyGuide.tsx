import React, { useState } from 'react';
import {
  ShieldAlert,
  Home,
  CheckCircle,
  Waves,
  ZapOff,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'antes' | 'durante' | 'despues'>('antes');

  return (
    <section id="guia" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="border-b border-[#DDE1DF] pb-3">
          <div className="flex items-center gap-2 text-[#245A66] font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 stroke-[2]" />
            {t.guideBadge}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1">
            {t.guideTitle}
          </h2>
          <p className="text-sm text-[#687078] mt-1 max-w-2xl">
            {t.guideSubtitle}
          </p>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 p-1 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[6px]">
          <button
            onClick={() => setActiveTab('antes')}
            className={`flex-1 py-2 px-3 rounded-[4px] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'antes'
                ? 'bg-[#245A66] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>{t.phaseBefore}</span>
          </button>

          <button
            onClick={() => setActiveTab('durante')}
            className={`flex-1 py-2 px-3 rounded-[4px] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'durante'
                ? 'bg-[#B84A45] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>{t.phaseDuring}</span>
          </button>

          <button
            onClick={() => setActiveTab('despues')}
            className={`flex-1 py-2 px-3 rounded-[4px] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'despues'
                ? 'bg-[#3F8063] text-white shadow-xs'
                : 'text-[#687078] hover:text-[#252A2E]'
            }`}
          >
            <span>{t.phaseAfter}</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-1">
          {activeTab === 'antes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#252A2E] flex items-center gap-1.5 text-sm">
                  <Home className="w-4 h-4 text-[#245A66] stroke-[2]" />
                  {language === 'en' ? 'Home Protection' : 'Aseguramiento del Hogar'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li>Protect windows with tape or wood shutters to prevent shattering.</li>
                      <li>Secure or store loose outdoor items (gas tanks, furniture, potted plants).</li>
                      <li>Clear roof drains and gutters to facilitate runoff and avoid localized flooding.</li>
                      <li>Turn off gas lines and power if water begins entering the building.</li>
                    </>
                  ) : (
                    <>
                      <li>Proteja ventanas de vidrio con cinta o paneles de madera para prevenir roturas por viento.</li>
                      <li>Fije o guarde objetos sueltos en azoteas y patios (tanques de gas, macetas, láminas).</li>
                      <li>Limpie desagües y coladeras para reducir encharcamientos.</li>
                      <li>Cierre el suministro de gas y desconecte la energía si el agua comienza a ingresar.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#252A2E] flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#A66C19] stroke-[2]" />
                  {language === 'en' ? 'Evacuation Plan' : 'Plan Familiar y Evacuación'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li>Locate your nearest designated storm shelter in the directory below.</li>
                      <li>Pack critical documents and IDs in sealed waterproof plastic bags.</li>
                      <li>If located in low-lying coastal or river zones, evacuate immediately when instructed.</li>
                      <li>Prepare food, carrier, and leash for domestic pets.</li>
                    </>
                  ) : (
                    <>
                      <li>Ubique el refugio temporal más cercano a su domicilio en el directorio.</li>
                      <li>Empaque documentos oficiales en bolsas herméticas de plástico.</li>
                      <li>Si vive en zona baja o margen de río, acate la orden de evacuación oportuna.</li>
                      <li>Prevea alimento, correa y transportadora para animales domésticos.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'durante' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-[#F7F7F4] border border-[#B84A45]/30 rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#B84A45] flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#B84A45] stroke-[2]" />
                  {language === 'en' ? 'Mandatory Indoor Shelter' : 'Resguardo Obligatorio en Interiores'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li>Remain in the most reinforced room of the house, away from glass windows.</li>
                      <li>Do not go outdoors; destructive gusts carry dangerous airborne debris.</li>
                      <li>Use battery flashlights instead of candles to avoid fires.</li>
                      <li>Stay calm and keep children and seniors in the safest designated room.</li>
                    </>
                  ) : (
                    <>
                      <li>Permanezca en la habitación más resistente de la vivienda, lejos de ventanales.</li>
                      <li>No salga a la vía pública; las ráfagas proyectan láminas y ramas peligrosas.</li>
                      <li>Utilice linternas de baterías en lugar de velas para evitar incendios.</li>
                      <li>Conserve la calma y mantenga a niños y adultos mayores en el área más segura.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#B84A45]/30 rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#B84A45] flex items-center gap-1.5 text-sm">
                  <Waves className="w-4 h-4 text-[#245A66] stroke-[2]" />
                  {language === 'en' ? 'Beware of the Cyclone Eye' : 'Precaución con el Ojo del Ciclón'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li><strong>Apparent Calm:</strong> If winds suddenly stop, the eye is passing over.</li>
                      <li>DO NOT leave shelter; violent winds will resume from the opposite direction within minutes.</li>
                      <li>Wait for official civil defense all-clear announcements.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Calma aparente:</strong> Si el viento cesa bruscamente, el ojo está cruzando la zona.</li>
                      <li>NO abandone el refugio; en pocos minutos los vientos regresarán en sentido opuesto.</li>
                      <li>Espere el aviso formal de las autoridades antes de salir.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'despues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#252A2E] flex items-center gap-1.5 text-sm">
                  <ZapOff className="w-4 h-4 text-[#A66C19] stroke-[2]" />
                  {language === 'en' ? 'Secondary Hazards' : 'Riesgos Secundarios'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li>Stay away from fallen power lines; report them immediately to utility services.</li>
                      <li>Do not cross flooded roads or swollen rivers on foot or by vehicle.</li>
                      <li>Check for gas leaks before flipping electrical switches.</li>
                      <li>Drink bottled or boiled water only.</li>
                    </>
                  ) : (
                    <>
                      <li>Evite postes y cables caídos; repórtelos de inmediato al 071 de CFE.</li>
                      <li>No cruce ríos o calles anegadas; la corriente puede arrastrar vehículos.</li>
                      <li>Revise que no haya fugas de gas antes de encender interruptores.</li>
                      <li>Consuma exclusivamente agua embotellada o debidamente hervida.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 space-y-2">
                <div className="font-bold text-[#252A2E] flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#3F8063] stroke-[2]" />
                  {language === 'en' ? 'Safe Return' : 'Retorno Seguro'}
                </div>
                <ul className="text-[#687078] space-y-1.5 list-disc list-inside leading-relaxed">
                  {language === 'en' ? (
                    <>
                      <li>Return home only when Civil Protection officially declares the area secure.</li>
                      <li>Photograph property damage for insurance or government relief claims.</li>
                      <li>Drain standing water to prevent mosquito breeding.</li>
                    </>
                  ) : (
                    <>
                      <li>Regrese a su domicilio únicamente cuando Protección Civil declare la zona segura.</li>
                      <li>Documente fotográficamente daños materiales para gestiones de apoyo.</li>
                      <li>Elimine recipientes con agua estancada para prevenir mosquitos.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
