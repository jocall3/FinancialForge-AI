
import React, { useState } from 'react';
import { useAppContext } from '../App';
// Added SecondaryButton to the imports from ../components/UI to fix identified errors
import { Card, PrimaryButton, FormTextarea, Badge, SecondaryButton } from '../components/UI';
import { geminiService } from '../services/geminiService';
import { InfrastructureComponentType } from '../types';

const ProjectEditor: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [activeTab, setActiveTab] = useState<'concept' | 'infrastructure' | 'compliance' | 'simulation'>('concept');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const project = state.projects.find(p => p.id === state.activeProjectId);

    if (!project) return <div>Error: No active project.</div>;

    const handleGenerateConcept = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const { concept, imageUrl } = await geminiService.generateConcept(prompt);
            dispatch({
                type: 'UPDATE_PROJECT',
                payload: { ...project, concept: { ...concept, imageUrl }, updatedAt: Date.now() }
            });
            setPrompt('');
        } catch (e) {
            console.error(e);
            alert("Generation failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComponent = async (type: InfrastructureComponentType) => {
        const componentPrompt = prompt || `Create a secure ${type} for the infrastructure.`;
        setLoading(true);
        try {
            const { component, imageUrl } = await geminiService.generateComponent(
                project.concept.description || project.name, 
                type, 
                componentPrompt
            );
            const newComponent = {
                ...component,
                id: crypto.randomUUID(),
                type,
                imageUrl,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            dispatch({
                type: 'UPDATE_PROJECT',
                payload: { ...project, components: [...project.components, newComponent], updatedAt: Date.now() }
            });
            setPrompt('');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Badge color="cyan">Draft v1.0</Badge>
                        <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">{project.name}</h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl">{project.description}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-xs font-bold bg-slate-700 rounded hover:bg-slate-600 transition-colors uppercase tracking-widest">Share</button>
                    <button className="px-4 py-2 text-xs font-bold bg-cyan-600 rounded hover:bg-cyan-500 transition-colors uppercase tracking-widest">Deploy Simulation</button>
                </div>
            </header>

            <div className="flex gap-1 bg-slate-900 p-1 rounded-lg w-fit border border-slate-800">
                {(['concept', 'infrastructure', 'compliance', 'simulation'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Generator Interface">
                        <div className="space-y-4">
                            <FormTextarea 
                                label="Instructional Prompt" 
                                placeholder="Describe a component, requirement, or scenario..." 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)}
                            />
                            {activeTab === 'concept' && (
                                <PrimaryButton className="w-full" onClick={handleGenerateConcept} disabled={loading}>
                                    {loading ? 'Processing...' : 'Refine Core Concept'}
                                </PrimaryButton>
                            )}
                            {activeTab === 'infrastructure' && (
                                <div className="grid grid-cols-2 gap-2">
                                    {(['Programmable Asset', 'Automated Agent', 'Data Feed', 'Network Node', 'Digital Identity Role', 'Value Transfer Mechanism'] as InfrastructureComponentType[]).map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => handleAddComponent(type)}
                                            disabled={loading}
                                            className="text-[10px] bg-slate-900 border border-slate-700 p-2 rounded hover:bg-slate-800 text-slate-300 font-bold uppercase tracking-tight text-left disabled:opacity-50"
                                        >
                                            + {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                * Generative AI will interpret your prompts and align them with existing financial standards (ISO 20022, FIX).
                            </p>
                        </div>
                    </Card>

                    <Card title="Blueprint Metadata">
                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Asset Count</span>
                                <span className="text-slate-200">{project.components.filter(c => c.type === 'Programmable Asset').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Agent Entities</span>
                                <span className="text-slate-200">{project.components.filter(c => c.type === 'Automated Agent').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Compliance Files</span>
                                <span className="text-slate-200">{project.documents.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Stability Rating</span>
                                <span className="text-emerald-400 font-bold">94%</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Workspace Area */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'concept' && (
                        <div className="space-y-6">
                            {project.concept.description ? (
                                <>
                                    {project.concept.imageUrl && (
                                        <div className="rounded-2xl overflow-hidden border border-slate-700 h-64 shadow-2xl">
                                            <img src={project.concept.imageUrl} className="w-full h-full object-cover" alt="Concept Visualization" />
                                        </div>
                                    )}
                                    <Card title="Vision Overview">
                                        <p className="text-slate-300 leading-relaxed mb-6 italic border-l-2 border-cyan-500 pl-4 py-1">{project.concept.description}</p>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Architectural Pillars</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {project.concept.keyComponents.map((comp, idx) => (
                                                    <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded bg-cyan-900/30 text-cyan-400 flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                                                        <span className="text-xs text-slate-200 font-semibold">{comp}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                    <Card title="Commercial Opportunity">
                                        <p className="text-sm text-slate-400 leading-relaxed">{project.concept.marketOpportunity}</p>
                                    </Card>
                                </>
                            ) : (
                                <div className="py-32 text-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <p className="mb-4">No concept defined yet.</p>
                                    <p className="text-xs uppercase tracking-widest">Enter a prompt in the left panel to begin.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'infrastructure' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.components.map(comp => (
                                <Card key={comp.id} className="relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="space-y-1">
                                            <Badge color={comp.criticality === 'Mission-Critical' ? 'red' : 'cyan'}>{comp.type}</Badge>
                                            <h4 className="font-bold text-slate-100">{comp.name || 'Unnamed Component'}</h4>
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-600">ID: {comp.id.slice(0,6)}</div>
                                    </div>
                                    {comp.imageUrl && (
                                        <img src={comp.imageUrl} className="w-full h-32 object-cover rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity border border-slate-700" alt="Comp Viz" />
                                    )}
                                    <p className="text-xs text-slate-400 line-clamp-2">{comp.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-1">
                                        {comp.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded text-[9px] font-bold">#{t}</span>)}
                                    </div>
                                    <button 
                                        onClick={() => {
                                            dispatch({
                                                type: 'UPDATE_PROJECT',
                                                payload: { ...project, components: project.components.filter(c => c.id !== comp.id) }
                                            });
                                        }}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 text-xs font-bold"
                                    >
                                        Delete
                                    </button>
                                </Card>
                            ))}
                            {project.components.length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-600">
                                    Initialize system components using the side panel.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'compliance' && (
                        <div className="space-y-4">
                            <Card title="Compliance Matrix">
                                <div className="flex flex-col gap-4 py-8 items-center text-slate-600 italic">
                                    <p>Regulatory frameworks (GDPR, MiCA, SOC2) can be generated here.</p>
                                    <SecondaryButton onClick={() => alert('Future enhancement: automated compliance generation.')}>
                                        Generate Regulatory Schema
                                    </SecondaryButton>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'simulation' && (
                        <div className="space-y-6">
                            <Card title="Real-time Network Activity Simulator">
                                <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
                                    <div className="z-10 text-center space-y-4">
                                        <div className="flex justify-center gap-4">
                                            {[1,2,3,4].map(i => <div key={i} className="w-2 h-8 bg-cyan-500/50 animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                                        </div>
                                        <p className="text-cyan-500 font-mono text-sm tracking-widest uppercase">Initializing Simulation Environment...</p>
                                        <SecondaryButton onClick={() => alert('Simulation environment requires 3+ infrastructure components to be active.')}>Start Testnet</SecondaryButton>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectEditor;
