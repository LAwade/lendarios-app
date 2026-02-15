import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
    Users, 
    MessageSquare, 
    DollarSign, 
    Server, 
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { data: adminData, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/admin/stats');
            return response.data.data;
        }
    });

    const { data: usersData, isLoading: loadingUsers } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/admin/users');
            return response.data.data;
        }
    });

    if (isLoading || loadingUsers) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const stats = adminData;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Administração</h1>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] bg-gray-100 px-4 py-2 rounded-xl">Master Access</div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Usuários Totais', value: stats.total_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'TS3 Online', value: stats.active_servers, icon: Server, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Tickets Abertos', value: stats.open_tickets, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Receita (Mês)', value: `R$ ${Number(stats.monthly_revenue).toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                        <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                            <item.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-inter">
                {/* Users Table */}
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center">
                            <Users size={18} className="mr-2 text-blue-600" />
                            Gestão de Clientes
                        </h2>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input type="text" placeholder="Buscar cliente..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 transition" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-50/50">
                                    <th className="px-8 py-4">Cliente</th>
                                    <th className="px-8 py-4">Serviços</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {usersData?.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                    {user.name.substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-1">
                                                <span className="font-black text-gray-900">{user.virtual_servers_count}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Servers</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Ativo</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-gray-900 transition">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-gray-50/30 border-t border-gray-50 text-center">
                        <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Ver todos os clientes</button>
                    </div>
                </div>

                {/* Sidebar Alerts / Pending Invoices */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl shadow-gray-200 overflow-hidden relative">
                        <div className="relative z-10 space-y-6">
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs text-blue-400">Ações Urgentes</h3>
                            <div className="space-y-4">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-start space-x-4 hover:bg-white/10 transition cursor-pointer group">
                                    <div className="bg-purple-600/20 text-purple-400 p-2 rounded-xl">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">{stats.open_tickets} Tickets Aguardando</p>
                                        <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">Resposta pendente</p>
                                    </div>
                                    <ArrowUpRight size={14} className="text-gray-600 group-hover:text-blue-400 transition" />
                                </div>

                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-start space-x-4 hover:bg-white/10 transition cursor-pointer group">
                                    <div className="bg-orange-600/20 text-orange-400 p-2 rounded-xl">
                                        <DollarSign size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">{stats.pending_invoices} Faturas Vencidas</p>
                                        <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">Ações de bloqueio</p>
                                    </div>
                                    <ArrowUpRight size={14} className="text-gray-600 group-hover:text-blue-400 transition" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Integridade do Sistema</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">Database Master</span>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">TeamSpeak Query</span>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">Tibia API (Node.js)</span>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
