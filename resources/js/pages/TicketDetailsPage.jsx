import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
    ArrowLeft, 
    MessageSquare, 
    Send, 
    Clock, 
    User, 
    ShieldCheck, 
    Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TicketDetailsPage() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const [reply, setReply] = useState('');

    const { data: ticket, isLoading } = useQuery({
        queryKey: ['ticket', id],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/tickets/${id}`);
            return response.data.data;
        }
    });

    const replyMutation = useMutation({
        mutationFn: async (message) => {
            const response = await axios.post(`/api/v1/tickets/${id}/reply`, { message });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ticket', id]);
            setReply('');
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <Link to="/tickets" className="flex items-center text-gray-500 hover:text-blue-600 font-bold transition">
                <ArrowLeft size={18} className="mr-2" />
                Voltar aos Tickets
            </Link>

            {/* Ticket Header */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest">
                        #{ticket.id}
                    </span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {ticket.category}
                    </span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{ticket.subject}</h1>
                <div className="flex items-center space-x-4 text-sm font-bold text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>Aberto em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className={`h-2 w-2 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <span className="uppercase tracking-widest text-[10px]">{ticket.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            {/* Message Thread */}
            <div className="space-y-8">
                {ticket.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-[32px] p-8 shadow-sm border ${msg.is_admin ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-100'}`}>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${msg.is_admin ? 'bg-blue-600' : 'bg-gray-100'}`}>
                                    {msg.is_admin ? <ShieldCheck size={20} /> : <User size={20} className="text-gray-400" />}
                                </div>
                                <div>
                                    <p className="font-black text-sm uppercase tracking-wider">{msg.is_admin ? 'Suporte Lendários' : msg.user?.name}</p>
                                    <p className={`text-[10px] uppercase font-bold ${msg.is_admin ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {msg.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Area */}
            {ticket.status !== 'closed' && (
                <div className="mt-12 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <MessageSquare className="text-blue-600" size={24} />
                        <h2 className="text-xl font-black text-gray-900">Sua Resposta</h2>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); if (reply.trim()) replyMutation.mutate(reply); }} className="space-y-6">
                        <textarea 
                            required
                            rows="4"
                            className="w-full px-6 py-6 bg-gray-50 rounded-3xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition text-lg"
                            placeholder="Escreva sua mensagem aqui..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        ></textarea>
                        <button 
                            type="submit"
                            disabled={replyMutation.isPending || !reply.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition flex items-center justify-center space-x-3 disabled:opacity-50 shadow-lg shadow-blue-100"
                        >
                            {replyMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <span>Enviar Mensagem</span>
                                    <Send size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
