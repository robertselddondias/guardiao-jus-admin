
enum BeneficioType {
    ATENDIMENTO_24 = "ATENDIMENTO_24",
    PROCESSOS_DIVERSOS = "PROCESSOS_DIVERSOS",
    EMERGENCIA = "EMERGENCIA",
    SEM_CARENCIA = "SEM_CARENCIA",
    DEPENDENTES = "DEPENDENTES",
    WHATSAPP = "WHATSAPP"
}

// Mapeamento para labels de exibição
export const BeneficioTypeLabels: Record<BeneficioType, string> = {
    [BeneficioType.ATENDIMENTO_24]: "Atendimento 24hrs",
    [BeneficioType.PROCESSOS_DIVERSOS]: "Processos Diversos",
    [BeneficioType.EMERGENCIA]: "Atendimento de Emergência",
    [BeneficioType.SEM_CARENCIA]: "Sem Carência",
    [BeneficioType.DEPENDENTES]: "Dependentes",
    [BeneficioType.WHATSAPP]: "Whatsapp"
};

export default BeneficioType;
