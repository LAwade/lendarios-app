import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
    Server, 
    Shield, 
    Key, 
    Layout, 
    Activity, 
    Users, 
    RefreshCw, 
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Zap,
    Bot
} from 'lucide-react';
import TibiaBotSection from '../components/TibiaBotSection';

export default function ServerDetailsPage() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [templateType, setTemplateType] = useState('game');
    const [activeTab, setActiveTab] = useState('ts3');

    const { data: serverData, isLoading } = useQuery({
        queryKey: ['server', id],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${id}`);
            return response.data.data;
        }
    });

    const tokenMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`/api/v1/teamspeak/${id}/token`);
            return response.data.token;
        },
        onSuccess: (token) => {
            alert(`Token gerado com sucesso: ${token}`);
            queryClient.invalidateQueries(['server', id]);
        }
    });

    const templateMutation = useMutation({
        mutationFn: async (type) => {
            const response = await axios.post(`/api/v1/teamspeak/${id}/template`, { template: type });
            return response.data;
        },
        onSuccess: () => {
            alert('Template aplicado com sucesso!');
        }
    });

    if (isLoading) return <div className="animate-pulse flex justify-center py-20"><RefreshCw className="animate-spin text-blue-600" size={40} /></div>;

    const { db, realtime, tokens } = serverData;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-blue-600 font-bold transition">
                <ArrowLeft size={18} className="mr-2" />
                Voltar ao Dashboard
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Server size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">TS3 Server {db.virtual_port}</h1>
                        <div className="flex items-center space-x-3 mt-2 font-bold">
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs uppercase ${realtime ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <Activity size={12} className="mr-1" />
                                {realtime ? 'Online' : 'Offline'}
                            </span>
                            <span className="text-gray-400 text-sm italic">{db.master?.host}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex bg-white/50 p-1.5 rounded-2xl border border-gray-100 shadow-sm mr-4">
                        <button 
                            onClick={() => setActiveTab('ts3')}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${activeTab === 'ts3' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            <Server size={14} />
                            <span>TS3 Admin</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('tibia')}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${activeTab === 'tibia' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            <Bot size={14} />
                            <span>Tibia Bot</span>
                        </button>
                    </div>
                    <button className="bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center space-x-2 transition shadow-lg shadow-gray-200">
                        <Zap size={18} className="text-yellow-400" />
                        <span>Reiniciar</span>
                    </button>
                </div>
            </div>

            {activeTab === 'ts3' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-inter">
                    {/* Real-time Status */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="font-black text-gray-900 flex items-center uppercase tracking-widest text-sm">
                                    <Activity size={18} className="mr-2 text-blue-600" />
                                    Status em Tempo Real
                                </h2>
                            </div>
                            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Usuários</p>
                                    <p className="text-2xl font-black text-gray-900">{realtime?.virtualserver_clientsonline ?? 0} / {realtime?.virtualserver_maxclients ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Canais</p>
                                    <p className="text-2xl font-black text-gray-900">{realtime?.virtualserver_channelsonline ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Uptime</p>
                                    <p className="text-xl font-black text-gray-900 italic">99.9%</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Ping</p>
                                    <p className="text-xl font-black text-gray-900 italic">22ms</p>
                                </div>
                            </div>
                        </div>

                        {/* Template Setup */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center space-x-2 font-black text-gray-900 uppercase tracking-widest text-sm">
                                <Layout size={20} className="text-blue-600" />
                                <span>Configuração de Templates</span>
                            </div>
                            <p className="text-gray-500">Aplique estruturas de canais pré-definidas instantaneamente no seu servidor.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setTemplateType('game')}
                                    className={`p-6 rounded-2xl border-2 text-left transition ${templateType === 'game' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                                >
                                    <h4 className="font-bold text-gray-900">Template Gaming</h4>
                                    <p className="text-sm text-gray-500 mt-1">Canais para LoL, CS, Fortnite e salas de reunião gerais.</p>
                                </button>
                                <button 
                                    onClick={() => setTemplateType('tibia')}
                                    className={`p-6 rounded-2xl border-2 text-left transition ${templateType === 'tibia' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                                >
                                    <h4 className="font-bold text-gray-900">Template Tibia War</h4>
                                    <p className="text-sm text-gray-500 mt-1">Estrutura focada em Guilds, Hunted List e canais de comando.</p>
                                </button>
                            </div>

                            <button 
                                onClick={() => templateMutation.mutate(templateType)}
                                disabled={templateMutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition disabled:opacity-50"
                            >
                                {templateMutation.isPending ? 'Aplicando...' : 'Aplicar Template no Servidor'}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-8">
                        {/* Admin Token */}
                        <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-6 shadow-xl shadow-gray-200">
                            <div className="flex items-center space-x-2 font-black uppercase tracking-widest text-sm text-blue-400">
                                <Key size={20} />
                                <span>Chave de Privilégio</span>
                            </div>
                            <p className="text-gray-400 text-sm italic">Perdeu o acesso de Administrador? Gere uma nova chave aqui.</p>
                            
                            <button 
                                onClick={() => tokenMutation.mutate()}
                                disabled={tokenMutation.isPending}
                                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-black py-4 rounded-2xl transition shadow-lg flex items-center justify-center space-x-2"
                            >
                                <RefreshCw size={18} className={tokenMutation.isPending ? 'animate-spin' : ''} />
                                <span>Gerar Novo Token</span>
                            </button>

                            <div className="pt-4 border-t border-gray-800">
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Tokens Ativos</p>
                                <div className="space-y-3">
                                    {tokens.length === 0 ? (
                                        <p className="text-xs text-gray-600 italic">Nenhum token pendente no servidor.</p>
                                    ) : (
                                        tokens.map((t, i) => (
                                            <div key={i} className="bg-white/5 p-3 rounded-xl flex items-center justify-between border border-white/5">
                                                <span className="text-[10px] font-mono truncate mr-2">{t.token}</span>
                                                <Shield size={14} className="text-blue-400 shrink-0" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Support Alert */}
                        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                            <h4 className="font-black text-blue-900 mb-2 uppercase tracking-widest text-xs flex items-center">
                                <Shield size={16} className="mr-2" />
                                Proteção Anti-DDoS
                            </h4>
                            <p className="text-blue-700 text-sm">Seu servidor está protegido por nossa camada de filtragem avançada.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <TibiaBotSection serverId={id} />
            )}
        </div>
    );
}
