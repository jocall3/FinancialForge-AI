
import React, { useState, useReducer, createContext, useContext, useEffect, useMemo } from 'react';
import { FinancialBlueprintProject, GenerationTask } from './types';
import Dashboard from './views/Dashboard';
import ProjectEditor from './views/ProjectEditor';
import { Badge } from './components/UI';

interface AppState {
    projects: FinancialBlueprintProject[];
    activeProjectId: string | null;
    currentView: 'dashboard' | 'editor';
}

type Action = 
    | { type: 'LOAD_PROJECTS', payload: FinancialBlueprintProject[] }
    | { type: 'ADD_PROJECT', payload: FinancialBlueprintProject }
    | { type: 'UPDATE_PROJECT', payload: FinancialBlueprintProject }
    | { type: 'DELETE_PROJECT', payload: string }
    | { type: 'SET_ACTIVE', payload: string | null }
    | { type: 'SET_VIEW', payload: AppState['currentView'] };

const initialState: AppState = {
    projects: [],
    activeProjectId: null,
    currentView: 'dashboard'
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOAD_PROJECTS': return { ...state, projects: action.payload };
        case 'ADD_PROJECT': return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT': return { 
            ...state, 
            projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) 
        };
        case 'DELETE_PROJECT': return { 
            ...state, 
            projects: state.projects.filter(p => p.id !== action.payload),
            activeProjectId: state.activeProjectId === action.payload ? null : state.activeProjectId,
            currentView: state.activeProjectId === action.payload ? 'dashboard' : state.currentView
        };
        case 'SET_ACTIVE': return { ...state, activeProjectId: action.payload, currentView: action.payload ? 'editor' : 'dashboard' };
        case 'SET_VIEW': return { ...state, currentView: action.payload };
        default: return state;
    }
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};

const App: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const saved = localStorage.getItem('financial_forge_projects');
        if (saved) {
            dispatch({ type: 'LOAD_PROJECTS', payload: JSON.parse(saved) });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('financial_forge_projects', JSON.stringify(state.projects));
    }, [state.projects]);

    const activeProject = useMemo(() => 
        state.projects.find(p => p.id === state.activeProjectId), 
    [state.projects, state.activeProjectId]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <div className="min-h-screen flex flex-col">
                <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-lg flex items-center justify-center font-black text-white italic">F</div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-100">
                            FinancialForge <span className="text-cyan-500">AI</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
                            className={`text-sm font-semibold transition-colors ${state.currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Dashboard
                        </button>
                        {state.activeProjectId && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'editor' })}
                                className={`text-sm font-semibold transition-colors ${state.currentView === 'editor' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Editor: <span className="italic">{activeProject?.name}</span>
                            </button>
                        )}
                        <Badge color="slate">Enterprise Access</Badge>
                    </div>
                </nav>

                <main className="flex-1 bg-[#0a0f1d] py-10">
                    <div className="max-w-7xl mx-auto px-8">
                        {state.currentView === 'dashboard' ? <Dashboard /> : <ProjectEditor />}
                    </div>
                </main>

                <footer className="py-6 border-t border-slate-900 text-center text-slate-500 text-xs">
                    PROTOTYPE ENVIRONMENT • SYSTEM v3.4.1 • POWERED BY GOOGLE GENAI
                </footer>
            </div>
        </AppContext.Provider>
    );
};

export default App;
