import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Database, Plus, RefreshCw, UploadCloud, Clock } from 'lucide-react';

export default function TeamSpeakBackups({ serverId }) {
    const queryClient = useQueryClient();

    const { data: backups, isLoading } = useQuery({
        queryKey: ['server', serverId, 'backups'],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/backups`);
            return response.data.data;
        }
    });

    const createBackupMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`/api/v1/teamspeak/${serverId}/backup`);
            return response.data;
        },
        onSuccess: (data) => {
            alert(data.message || 'Backup criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['server', serverId, 'backups'] });
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Erro ao criar backup');
        }
    });

    const restoreBackupMutation = useMutation({
        mutationFn: async (backupId) => {
            if(!confirm('Tem certeza que deseja restaurar este backup? Suas configurações atuais serão sobrescritas.')) {
                throw new Error('Cancelado');
            }
            const response = await axios.post(`/api/v1/teamspeak/${serverId}/backup/restore`, {
                backup_id: backupId
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert(data.message || 'Backup restaurado com sucesso!');
        },
        onError: (error) => {
            if(error.message !== 'Cancelado') {
                alert(error.response?.data?.message || 'Erro ao restaurar backup');
            }
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500"><RefreshCw className="animate-spin inline-block mr-2" /> Carregando backups...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 flex items-center">
                    <Database className="mr-2 text-blue-600" />
                    Backups do Servidor
                </h2>
                <button 
                    onClick={() => createBackupMutation.mutate()}
                    disabled={createBackupMutation.isPending}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition flex items-center space-x-2 disabled:opacity-50"
                >
                    {createBackupMutation.isPending ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                    <span>Gerar Novo Backup</span>
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-yellow-800 text-sm">
                <p className="font-bold mb-1">Aviso Importante</p>
                <p>Os backups salvam toda a estrutura de canais e grupos de servidor (Snapshot do DB do TS3), mas podem não salvar os ícones do servidor caso você use ícones customizados externamente.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-0">
                    {backups && backups.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {backups.map((bak, i) => (
                                <li key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600 mr-4">
                                            <UploadCloud size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Snapshot de Configuração</h4>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Clock size={14} className="mr-1" />
                                                <span>{new Date(bak.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => restoreBackupMutation.mutate(bak.id)}
                                            disabled={restoreBackupMutation.isPending}
                                            className="px-6 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold transition text-sm disabled:opacity-50 flex items-center"
                                        >
                                            <RefreshCw size={14} className={`mr-2 ${restoreBackupMutation.isPending && restoreBackupMutation.variables === bak.id ? 'animate-spin' : ''}`} />
                                            Restaurar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-medium">
                            Nenhum backup encontrado para este servidor.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
