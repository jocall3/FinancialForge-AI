
export type InfrastructureComponentType = 
    | 'Programmable Asset' 
    | 'Automated Agent' 
    | 'Data Feed' 
    | 'Network Node' 
    | 'Digital Identity Role' 
    | 'Value Transfer Mechanism' 
    | 'Protocol Integration' 
    | 'Cryptographic Security Module';

export interface FinancialProductConcept {
    description: string;
    keyComponents: string[];
    marketOpportunity: string;
    imageUrl?: string;
}

export interface MarketSegment {
    id: string;
    name: string;
    type: string;
    regulatoryEnvironment: string;
    targetDemographics: string;
    keyComplianceRequirements: string[];
    associatedProtocols: string[];
    uniqueMarketDynamics: string[];
    description: string;
    imageUrl?: string;
    createdAt: number;
    updatedAt: number;
}

export interface BaseInfrastructureComponent {
    id: string;
    name: string;
    type: InfrastructureComponentType;
    description: string;
    criticality: 'Low' | 'Medium' | 'High' | 'Mission-Critical';
    tags: string[];
    imageUrl?: string;
    createdAt: number;
    updatedAt: number;
}

export interface ProgrammableAssetDefinition extends BaseInfrastructureComponent {
    type: 'Programmable Asset';
    assetClass: string;
    issuanceMechanism: string;
    transferRestrictions: string[];
    settlementLayer: string;
}

export interface AutomatedAgentDefinition extends BaseInfrastructureComponent {
    type: 'Automated Agent';
    agentRole: string;
    operationalScope: string;
    decisionLogic: string[];
    communicationProtocols: string[];
}

export interface DataFeedConfiguration extends BaseInfrastructureComponent {
    type: 'Data Feed';
    dataType: string;
    sourceProvider: string;
    updateFrequency: string;
    validationMechanisms: string[];
}

export interface NetworkNodeTopology extends BaseInfrastructureComponent {
    type: 'Network Node';
    nodeFunction: string;
    networkType: string;
    hostingEnvironment: string;
    securityProtocols: string[];
}

export interface DigitalIdentityRole extends BaseInfrastructureComponent {
    type: 'Digital Identity Role';
    roleCategory: string;
    authenticationMethod: string[];
    authorizationPolicies: string[];
    dataPrivacyStandards: string;
    verificationLevel: string;
}

export interface ValueTransferMechanism extends BaseInfrastructureComponent {
    type: 'Value Transfer Mechanism';
    propulsionMechanism: string;
    interoperabilityScope: string;
    transactionCapacity: string;
    resilienceMeasures: string[];
}

export interface ProtocolIntegrationSchema extends BaseInfrastructureComponent {
    type: 'Protocol Integration';
    protocolStandard: string;
    applicationLayer: string;
    complexityRating: string;
    securityConsiderations: string[];
}

export interface CryptographicSecurityModule extends BaseInfrastructureComponent {
    type: 'Cryptographic Security Module';
    attestationMechanism: string;
    functionality: string[];
    securityAssuranceLevel: string;
    threatMitigation: string[];
}

export type AnyInfrastructureComponent = 
    | ProgrammableAssetDefinition 
    | AutomatedAgentDefinition 
    | DataFeedConfiguration 
    | NetworkNodeTopology 
    | DigitalIdentityRole 
    | ValueTransferMechanism 
    | ProtocolIntegrationSchema 
    | CryptographicSecurityModule;

export interface RegulatoryComplianceDocument {
    id: string;
    title: string;
    type: string;
    content: string;
    relatedEntities: string[];
    importance: 'Minor' | 'Standard' | 'Major' | 'Pivotal';
    imageUrl?: string;
    createdAt: number;
    updatedAt: number;
}

export interface SmartContractPolicyEngine {
    id: string;
    name: string;
    description: string;
    executionEnvironment: string;
    policyRules: string[];
    exampleScenarios: string[];
    limitations: string[];
    integrationWithPlatform: string;
    createdAt: number;
    updatedAt: number;
}

export interface InteroperabilityFramework {
    id: string;
    name: string;
    description: string;
    keyStandards: string[];
    dataExchangeFormats: string[];
    securityMechanisms: string[];
    impactOnLatency: string;
    createdAt: number;
    updatedAt: number;
}

export interface OperationalScenario {
    id: string;
    title: string;
    summary: string;
    type: string;
    initiator: string;
    goal: string;
    expectedOutcomes: string[];
    potentialChallenges: string[];
    relatedDocumentIds: string[];
    createdAt: number;
    updatedAt: number;
}

export interface ProjectSettings {
    aiModelPreference: string;
    imageModelPreference: string;
    defaultTone: string;
    defaultPromptPrefix: string;
    defaultNegativePrompt: string;
    autoSaveInterval: number;
}

export interface GenerationTask {
    id: string;
    projectId: string;
    type: string;
    status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
    prompt: string;
    generatedContent?: any;
    error?: string;
    startTime: number;
    endTime?: number;
    visualizationUrl?: string;
}

export interface FinancialBlueprintProject {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    concept: FinancialProductConcept;
    marketSegments: MarketSegment[];
    components: AnyInfrastructureComponent[];
    documents: RegulatoryComplianceDocument[];
    policyEngines: SmartContractPolicyEngine[];
    interopFrameworks: InteroperabilityFramework[];
    operationalScenarios: OperationalScenario[];
    projectSettings: ProjectSettings;
    generationHistory: GenerationTask[];
}
