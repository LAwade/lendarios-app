import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Users, UserMinus, Plus, Shield, RefreshCw } from 'lucide-react';

export default function TeamSpeakClients({ serverId }) {
    const queryClient = useQueryClient();
    const [view, setView] = useState('online'); // 'online' or 'all'
    const [selectedClientDbid, setSelectedClientDbid] = useState('');
    const [groupId, setGroupId] = useState('');

    const { data: clientsData, isLoading } = useQuery({
        queryKey: ['server', serverId, 'clients', view],
        queryFn: async () => {
            const endpoint = view === 'online' ? 'online' : '';
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/clients${endpoint ? `/${endpoint}` : ''}`);
            return response.data.data;
        }
    });

    const addGroupMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`/api/v1/teamspeak/${serverId}/groups/add`, {
                client_dbid: selectedClientDbid,
                group_id: groupId
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert(data.message || 'Grupo adicionado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['server', serverId, 'clients'] });
            setSelectedClientDbid('');
            setGroupId('');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Erro ao adicionar grupo');
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500"><RefreshCw className="animate-spin inline-block mr-2" /> Carregando clientes...</div>;

    const clientsUrl = view === 'online' ? 'Clientes Online' : 'Todos os Clientes (DB)';

    const handleAddGroup = (e) => {
        e.preventDefault();
        if(!selectedClientDbid || !groupId) return;
        addGroupMutation.mutate();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 flex items-center">
                    <Users className="mr-2 text-blue-600" />
                    Gestão de Clientes
                </h2>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setView('online')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${view === 'online' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Online
                    </button>
                    <button
                        onClick={() => setView('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${view === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Banco de Dados
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-bold text-gray-700">{clientsUrl}</h3>
                </div>
                <div className="p-0">
                    {clientsData && clientsData.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Nome (Nickname)</th>
                                    <th className="p-4 font-bold">DB Id</th>
                                    <th className="p-4 font-bold">UID</th>
                                    {view === 'online' && <th className="p-4 font-bold">Canal</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clientsData.map((c, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-900">{c.client_nickname}</td>
                                        <td className="p-4 text-gray-500">{c.client_database_id}</td>
                                        <td className="p-4 text-gray-500 text-sm font-mono">{c.client_unique_identifier}</td>
                                        {view === 'online' && <td className="p-4 text-gray-500">{c.cid}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-medium">
                            Nenhum cliente encontrado.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="mr-2 text-blue-600" size={18} />
                    Adicionar Grupo ao Cliente
                </h3>
                <form onSubmit={handleAddGroup} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">DB ID do Cliente</label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                            placeholder="Ex: 12"
                            value={selectedClientDbid}
                            onChange={(e) => setSelectedClientDbid(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ID do Grupo</label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                            placeholder="Ex: 6 (Server Admin)"
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={addGroupMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center space-x-2 disabled:opacity-50 h-[48px]"
                    >
                        {addGroupMutation.isPending ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                        <span>Adicionar Grupo</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
