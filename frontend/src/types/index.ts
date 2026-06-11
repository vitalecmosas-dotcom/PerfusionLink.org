// src/types/index.ts

export type PatientData = {
  height: string;
  weight: string;
  idealWeight: string;
  adjustedWeight: string;
  bsa: string;
  hto: string;
};
export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}
export type PerfusionPlan = {
  weightStrategy: string;
  targetCI: string;
  flowObjectives: string;
  perfusionType: string;
  systemicTargetTemp: string;

  cardioplegiaType: string;
  cardioplegiaRoute: string;
  cardioplegiaTemp: string;
  cardioplegiaVolume: string;

  primingLactatoRinger: string;
  primingPlasmalyte: string;
  primingSolucionSalina: string;
  primingGelofusine: string;
  primingAlbumina: string;
  primingSangre: string;
  primingManitol: string;
  primingBicarbonato: string;
  primingAcidoTranexamico: string;
  primingSulfatoMagnesio: string;
  primingHeparina: string;

  calculatedHto: string;
  anesthesiaVolume: string;

  cerebralPerfusion: boolean;
  cerebralRetrogradeFlow: string;
  cerebralRetrogradePressure: string;
  cerebralAnterogradeFlow: string;
  cerebralAnterogradePressure: string;
  cerebralAnterogradeNirs: string;
  cerebralRetrogradeNirs: string;

  myocardialPerfusion: boolean;
  myocardialFlow: string;
  myocardialPressure: string;

  distalPerfusion: boolean;
  distalCannulaSize: string;
  distalFlow: string;

  strategy_RAP: boolean;
  strategy_HAR: boolean;
  strategy_HNA: boolean;
  strategy_DVAV: boolean;
  strategy_RetornoVenoso: boolean;
  strategy_Miniaturizacion: boolean;
  strategy_MiECC: boolean;
  strategy_CUF: boolean;
  strategy_MUF: boolean;
  strategy_ZBUF: boolean;
  strategy_AhorroRecuperacion: boolean;

  pumpType: string;
  oxygenator: string;
  arterialCannula: string;
  venousCannulaSize: string;
  venousTubingSize: string;
  arterialTubingSize: string;
};