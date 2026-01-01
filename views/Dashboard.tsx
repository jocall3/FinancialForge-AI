
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Card, PrimaryButton, FormInput, FormTextarea } from '../components/UI';
import { FinancialBlueprintProject } from '../types';

const Dashboard: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const handleCreate = () => {
        if (!name) return;
        const newProject: FinancialBlueprintProject = {
            id: crypto.randomUUID(),
            name,
            description: desc,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            concept: { description: '', keyComponents: [], marketOpportunity: '' },
            marketSegments: [],
            components: [],
            documents: [],
            policyEngines: [],
            interopFrameworks: [],
            operationalScenarios: [],
            projectSettings: {
                aiModelPreference: 'gemini-3-flash-preview',
                imageModelPreference: 'gemini-2.5-flash-image',
                defaultTone: 'Regulatory & Professional',
                defaultPromptPrefix: '',
                defaultNegativePrompt: 'cartoonish, low-fidelity',
                autoSaveInterval: 60
            },
            generationHistory: []
        };
        dispatch({ type: 'ADD_PROJECT', payload: newProject });
        dispatch({ type: 'SET_ACTIVE', payload: newProject.id });
        setName('');
        setDesc('');
        setIsCreating(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-50">Strategic Workbench</h2>
                    <p className="text-slate-400 mt-1">Design and simulate institutional-grade digital value networks.</p>
                </div>
                <PrimaryButton onClick={() => setIsCreating(true)}>
                    <span>+</span> Initialize New Blueprint
                </PrimaryButton>
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <Card className="w-full max-w-md shadow-2xl border-cyan-500/30" title="Initialize Infrastructure Blueprint">
                        <div className="space-y-4">
                            <FormInput 
                                label="Project Name" 
                                placeholder="e.g., Global Settlement Rail v2" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                            />
                            <FormTextarea 
                                label="Mission Objective" 
                                placeholder="Define the primary purpose of this infrastructure..." 
                                value={desc} 
                                onChange={e => setDesc(e.target.value)}
                            />
                            <div className="flex gap-3 pt-2">
                                <PrimaryButton className="flex-1" onClick={handleCreate}>Start Designing</PrimaryButton>
                                <button className="flex-1 text-slate-400 font-semibold text-sm hover:text-slate-200" onClick={() => setIsCreating(false)}>Cancel</button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.projects.map(project => (
                    <Card 
                        key={project.id} 
                        className="group hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col"
                    >
                        <div onClick={() => dispatch({ type: 'SET_ACTIVE', payload: project.id })} className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                                <div className="text-[10px] text-slate-500 font-mono">ID: {project.id.slice(0,8)}</div>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-3 mb-6">{project.description || "No mission objective defined."}</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-6">
                                <div>
                                    <div className="text-slate-600 mb-1">Components</div>
                                    <div className="text-slate-300">{project.components.length}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600 mb-1">Segments</div>
                                    <div className="text-slate-300">{project.marketSegments.length}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                            <span className="text-[10px] text-slate-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(confirm('Archive this blueprint?')) dispatch({ type: 'DELETE_PROJECT', payload: project.id });
                                }}
                                className="text-rose-500 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest"
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                ))}

                {state.projects.length === 0 && (
                    <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 5.5a.75.75 0 011.06 0l3 3 3-3a.75.75 0 111.06 1.06L11.06 9.5l3 3a.75.75 0 11-1.06 1.06l-3-3-3 3a.75.75 0 11-1.06-1.06l3-3-3-3a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-sm">No active blueprints. Create one to begin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
