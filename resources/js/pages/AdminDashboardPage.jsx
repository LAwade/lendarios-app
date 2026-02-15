import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    Clock,
    ShoppingBag,
    Check,
    X,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const queryClient = useQueryClient();

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

    const { data: ordersData, isLoading: loadingOrders } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/admin/orders');
            return response.data.data;
        }
    });

    const confirmMutation = useMutation({
        mutationFn: (id) => axios.post(`/api/v1/admin/orders/${id}/confirm`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
            queryClient.invalidateQueries(['admin-stats']);
        }
    });

    const cancelMutation = useMutation({
        mutationFn: (id) => axios.post(`/api/v1/admin/orders/${id}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
        }
    });

    if (isLoading || loadingUsers || loadingOrders) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const stats = adminData;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Administração</h1>
                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: <ArrowUpRight size={16} /> },
                        { id: 'orders', label: 'Pedidos', icon: <ShoppingBag size={16} /> },
                        { id: 'users', label: 'Clientes', icon: <Users size={16} /> },
                        { id: 'tickets', label: 'Tickets', icon: <MessageSquare size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pending Orders Snippet */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center">
                                    <ShoppingBag size={18} className="mr-2 text-blue-600" />
                                    Pedidos Recentes
                                </h3>
                                <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Todos</button>
                            </div>
                            <div className="space-y-4">
                                {ordersData?.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-white p-2 rounded-xl border border-gray-200">
                                                <ShoppingBag size={16} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{order.product?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{order.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl shadow-gray-200">
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs text-blue-400 mb-8">Integridade do Ecossistema</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Database Master (PostgreSQL)', status: 'Online', delay: '1.2ms' },
                                    { label: 'TeamSpeak 3 Query API', status: 'Online', delay: '14ms' },
                                    { label: 'Node.js Tibia API Worker', status: 'Online', delay: '45ms' },
                                    { label: 'Nginx Gateway', status: 'Active', delay: '0.8ms' }
                                ].map((sys, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div>
                                            <p className="text-sm font-bold text-gray-100">{sys.label}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{sys.delay}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <span>{sys.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm">Gerenciamento de Pedidos</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-50/50">
                                    <th className="px-8 py-4">ID / Data</th>
                                    <th className="px-8 py-4">Cliente</th>
                                    <th className="px-8 py-4">Produto</th>
                                    <th className="px-8 py-4">Valor</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ordersData?.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-gray-900">#{order.id}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                                            <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-blue-600">{order.product?.name}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-gray-900">R$ {Number(order.total).toLocaleString('pt-BR')}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                order.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                                                order.status === 'completed' ? 'bg-green-50 text-green-600' : 
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {order.status === 'pending' ? 'Aguardando' : order.status === 'completed' ? 'Ativo' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {order.status === 'pending' && (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button 
                                                        onClick={() => confirmMutation.mutate(order.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                                                        title="Confirmar e Ativar"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => cancelMutation.mutate(order.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                                                        title="Cancelar Pedido"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center">
                            <Users size={18} className="mr-2 text-blue-600" />
                            Gestão de Clientes
                        </h2>
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
                                                <span className="font-black text-gray-900">{user.virtual_servers_count || 0}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Servers</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Ativo</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-gray-900 transition">
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
