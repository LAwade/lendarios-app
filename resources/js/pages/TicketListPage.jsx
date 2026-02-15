import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
    MessageSquare, 
    Plus, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight,
    Search,
    Loader2,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TicketListPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'TS3', priority: 'medium', message: '' });
    const queryClient = useQueryClient();

    const { data: tickets, isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/tickets');
            return response.data.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (ticket) => {
            const response = await axios.post('/api/v1/tickets', ticket);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets']);
            setIsCreateModalOpen(false);
            setNewTicket({ subject: '', category: 'TS3', priority: 'medium', message: '' });
            alert('Ticket aberto com sucesso!');
        }
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700';
            case 'answered': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Suporte Técnico</h1>
                    <p className="text-gray-500 mt-2">Estamos aqui para ajudar com seu TeamSpeak ou Bot.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    <span>Abrir Novo Ticket</span>
                </button>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {tickets.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <MessageSquare size={64} className="mx-auto text-gray-200" />
                        <p className="text-gray-500 font-medium">Você ainda não tem tickets de suporte abertos.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {tickets.map(ticket => (
                            <Link 
                                key={ticket.id} 
                                to={`/tickets/${ticket.id}`}
                                className="flex items-center justify-between p-8 hover:bg-gray-50 transition group"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className="hidden sm:flex h-14 w-14 bg-gray-50 rounded-2xl items-center justify-center text-gray-400 group-hover:text-blue-600 transition">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{ticket.category}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{ticket.subject}</h3>
                                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                                            <Clock size={12} />
                                            <span>Atualizado em {new Date(ticket.updated_at).toLocaleString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-black text-gray-900">Novo Chamado de Suporte</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newTicket); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Assunto</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                        placeholder="Ex: Problema no Token"
                                        value={newTicket.subject}
                                        onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prioridade</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                        value={newTicket.priority}
                                        onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="medium">Média</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem Detalhada</label>
                                <textarea 
                                    required
                                    rows="5"
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    placeholder="Descreva seu problema ou dúvida..."
                                    value={newTicket.message}
                                    onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {createMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : <span>Enviar Solicitação</span>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
