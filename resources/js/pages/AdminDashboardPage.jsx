import React, { useState, useEffect } from 'react';
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
    ExternalLink,
    Settings,
    ShieldAlert,
    Save,
    Loader2,
    Globe,
    Terminal,
    Key
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const queryClient = useQueryClient();

    // Stats, Users, Orders Queries
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

    // Server Query Settings Logic
    const [querySettings, setQuerySettings] = useState({
        host: '',
        query_port: 10011,
        username: 'serveradmin',
        password: '',
        flood_commands: 10,
        flood_time: 3,
        ban_time: 600
    });

    const { data: settingsData, isLoading: loadingSettings } = useQuery({
        queryKey: ['query-settings'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/admin/query-settings');
            return response.data.data;
        },
        enabled: activeTab === 'settings'
    });

    useEffect(() => {
        if (settingsData) {
            setQuerySettings({
                host: settingsData.master?.host || '',
                query_port: settingsData.master?.query_port || 10011,
                username: settingsData.master?.username || 'serveradmin',
                password: '', // Password stays hidden
                flood_commands: settingsData.flood?.flood_commands || 10,
                flood_time: settingsData.flood?.flood_time || 3,
                ban_time: settingsData.flood?.ban_time || 600
            });
        }
    }, [settingsData]);

    const updateSettingsMutation = useMutation({
        mutationFn: (data) => axios.post('/api/v1/admin/query-settings', data),
        onSuccess: (res) => {
            alert(res.data.message);
            queryClient.invalidateQueries(['query-settings']);
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
                        { id: 'tickets', label: 'Tickets', icon: <MessageSquare size={16} /> },
                        { id: 'settings', label: 'Server Query', icon: <Settings size={16} /> }
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

            {activeTab === 'settings' && (
                <div className="space-y-8 max-w-5xl">
                    {/* Master Connection Info */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/30">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-widest text-lg">Conexão Master TeamSpeak</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Configurações de Acesso ao Servidor de Query</p>
                            </div>
                        </div>
                        
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-inter">
                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <Globe size={14} className="mr-2" /> IP ou Host do Servidor
                                </label>
                                <input 
                                    type="text"
                                    placeholder="ex: 127.0.0.1 ou ts.lendarios.com"
                                    value={querySettings.host}
                                    onChange={(e) => setQuerySettings({...querySettings, host: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <Terminal size={14} className="mr-2" /> Porta Query
                                </label>
                                <input 
                                    type="number"
                                    value={querySettings.query_port}
                                    onChange={(e) => setQuerySettings({...querySettings, query_port: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <Users size={14} className="mr-2" /> Usuário Query
                                </label>
                                <input 
                                    type="text"
                                    value={querySettings.username}
                                    onChange={(e) => setQuerySettings({...querySettings, username: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <Key size={14} className="mr-2" /> Senha Query
                                </label>
                                <input 
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={querySettings.password}
                                    onChange={(e) => setQuerySettings({...querySettings, password: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Flood Control Settings */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/30">
                            <div className="p-3 bg-orange-500 text-white rounded-2xl">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-widest text-lg">Server Query Flood</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Prevenção contra spam de comandos</p>
                            </div>
                        </div>
                        
                        <div className="p-10 space-y-10 text-inter">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Comandos p/ Flood</label>
                                    <input 
                                        type="number"
                                        value={querySettings.flood_commands}
                                        onChange={(e) => setQuerySettings({...querySettings, flood_commands: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Número de comandos permitidos.</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tempo de Janela (s)</label>
                                    <input 
                                        type="number"
                                        value={querySettings.flood_time}
                                        onChange={(e) => setQuerySettings({...querySettings, flood_time: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Tempo em segundos para reset.</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Duração Ban (s)</label>
                                    <input 
                                        type="number"
                                        value={querySettings.ban_time}
                                        onChange={(e) => setQuerySettings({...querySettings, ban_time: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Tempo de bloqueio do IP.</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex items-center text-orange-600 space-x-2">
                                    <ShieldAlert size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Cuidado: Alterações globais!</span>
                                </div>
                                <button 
                                    onClick={() => updateSettingsMutation.mutate(querySettings)}
                                    disabled={updateSettingsMutation.isPending}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl shadow-blue-200 disabled:opacity-50"
                                >
                                    {updateSettingsMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    <span>Salvar Configuração Master</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
