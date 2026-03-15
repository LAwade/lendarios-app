import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Shield, AlertTriangle, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function TeamSpeakBans({ serverId }) {
    const queryClient = useQueryClient();
    const [ip, setIp] = useState('');
    const [uid, setUid] = useState('');
    const [duration, setDuration] = useState(0);
    const [reason, setReason] = useState('');

    const { data: bans, isLoading } = useQuery({
        queryKey: ['server', serverId, 'bans'],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/bans`);
            return response.data.data;
        }
    });

    const addBanMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`/api/v1/teamspeak/${serverId}/bans`, {
                ip, uid, duration: parseInt(duration), reason
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert(data.message || 'Banimento adicionado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['server', serverId, 'bans'] });
            setIp('');
            setUid('');
            setDuration(0);
            setReason('');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Erro ao adicionar banimento');
        }
    });

    const removeBanMutation = useMutation({
        mutationFn: async (banId) => {
            const response = await axios.delete(`/api/v1/teamspeak/${serverId}/bans`, {
                data: { ban_id: banId }
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert(data.message || 'Banimento removido com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['server', serverId, 'bans'] });
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Erro ao remover banimento');
        }
    });

    const handleAddBan = (e) => {
        e.preventDefault();
        if(!ip && !uid) {
            alert('Preencha o IP ou UID do usuário para banir.');
            return;
        }
        addBanMutation.mutate();
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500"><RefreshCw className="animate-spin inline-block mr-2" /> Carregando banimentos...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center">
                <Shield className="mr-2 text-red-600" />
                Gestão de Banimentos
            </h2>

            <div className="bg-red-50 rounded-3xl border border-red-100 p-6">
                <h3 className="font-bold text-red-900 mb-4 flex items-center text-sm uppercase tracking-widest">
                    <AlertTriangle className="mr-2" size={18} />
                    Adicionar Novo Ban
                </h3>
                <form onSubmit={handleAddBan} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Endereço IP (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                            placeholder="Ex: 192.168.1.1"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Unique ID (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                            placeholder="Ex: p1A5...="
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Duração (Segundos, 0 = Permanente)</label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Motivo</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                            placeholder="Motivo do banimento..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <button 
                            type="submit"
                            disabled={addBanMutation.isPending}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {addBanMutation.isPending ? <RefreshCw className="animate-spin" size={20} /> : <Plus size={20} />}
                            <span>Banir Usuário</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-bold text-gray-700">Banimentos Ativos</h3>
                </div>
                <div className="p-0">
                    {bans && bans.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Alvo</th>
                                    <th className="p-4 font-bold">Motivo</th>
                                    <th className="p-4 font-bold">Criado por</th>
                                    <th className="p-4 font-bold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bans.map((b, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-900">
                                            {b.ip && <div>IP: {b.ip}</div>}
                                            {b.uid && <div className="text-sm font-mono text-gray-500">UID: {b.uid}</div>}
                                            {b.name && <div className="text-sm text-gray-500">Nome: {b.name}</div>}
                                        </td>
                                        <td className="p-4 text-gray-600">{b.ban_reason || '-'}</td>
                                        <td className="p-4 text-gray-500">{b.invokername || '-'}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => removeBanMutation.mutate(b.banid)}
                                                disabled={removeBanMutation.isPending}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Remover Banimento"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-medium">
                            Não há banimentos ativos neste servidor.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
