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
    Key,
    TrendingUp,
    CreditCard,
    Activity,
    AlertTriangle
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
                password: '',
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
        <div className="space-y-10 pb-20 font-inter">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Control Panel</h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Visão Estratégica da Plataforma</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: <Activity size={16} /> },
                        { id: 'orders', label: 'Pedidos', icon: <ShoppingBag size={16} /> },
                        { id: 'users', label: 'Clientes', icon: <Users size={16} /> },
                        { id: 'tickets', label: 'Suporte', icon: <MessageSquare size={16} /> },
                        { id: 'settings', label: 'TS3 Master', icon: <Settings size={16} /> }
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
                <div className="space-y-10">
                    {/* Financial & Scale Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                                    <TrendingUp size={24} />
                                </div>
                                <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">Receita Ativa</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Ganhos no Mês</p>
                                <h3 className="text-3xl font-black text-gray-900 italic">R$ {Number(stats.monthly_revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-2">Total Acumulado: R$ {Number(stats.total_revenue).toLocaleString('pt-BR')}</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="bg-green-50 text-green-600 p-4 rounded-2xl">
                                    <Users size={24} />
                                </div>
                                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">Base de Dados</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Clientes Ativos</p>
                                <h3 className="text-3xl font-black text-gray-900 italic">{stats.active_users} <span className="text-sm text-gray-300 font-bold not-italic">/ {stats.total_users}</span></h3>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(stats.active_users / stats.total_users) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl">
                                    <Server size={24} />
                                </div>
                                <span className="text-[10px] font-black text-purple-500 bg-purple-50 px-3 py-1 rounded-full uppercase">Infraestrutura</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Servidores TS3</p>
                                <h3 className="text-3xl font-black text-gray-900 italic">{stats.active_servers} <span className="text-sm text-gray-300 font-bold not-italic">Online</span></h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-2">Disponibilidade: 100%</p>
                            </div>
                        </div>

                        <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="bg-white/20 p-4 rounded-2xl">
                                    <AlertTriangle size={24} />
                                </div>
                                <span className="text-[10px] font-black text-white bg-white/20 px-3 py-1 rounded-full uppercase">Pendente</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-orange-100 uppercase tracking-widest mb-1">Faturas em Aberto</p>
                                <h3 className="text-3xl font-black italic">R$ {Number(stats.pending_revenue).toLocaleString('pt-BR')}</h3>
                                <p className="text-[10px] text-orange-200 font-bold mt-2">{stats.pending_invoices} faturas aguardando pagamento</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Critical Actions */}
                        <div className="space-y-6">
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center">
                                <ShieldAlert size={16} className="mr-2 text-red-500" />
                                Atenção Necessária
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {stats.open_tickets > 0 && (
                                    <div className="bg-white p-6 rounded-3xl border-l-4 border-l-purple-600 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                                                <MessageSquare size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">{stats.open_tickets} Tickets Sem Resposta</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Clientes aguardando suporte técnico</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveTab('tickets')} className="p-2 bg-gray-50 text-gray-400 hover:text-purple-600 rounded-xl transition">
                                            <ArrowUpRight size={20} />
                                        </button>
                                    </div>
                                )}
                                <div className="bg-white p-6 rounded-3xl border-l-4 border-l-blue-600 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">Saúde do Sistema</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Todos os serviços rodando normalmente</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        <span className="text-[10px] font-black text-green-600 uppercase">Estável</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Overview */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center">
                                    <ShoppingBag size={16} className="mr-2 text-blue-600" />
                                    Últimos Pedidos
                                </h3>
                                <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Todos</button>
                            </div>
                            <div className="p-6 divide-y divide-gray-50">
                                {ordersData?.slice(0, 4).map(order => (
                                    <div key={order.id} className="py-4 flex items-center justify-between group">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{order.product?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase">{order.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900 italic">R$ {Number(order.total).toLocaleString('pt-BR')}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Other tabs remain largely the same but with refined table styling */}
            {activeTab === 'settings' && (
                <div className="space-y-8 max-w-5xl">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/30">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-widest text-lg">Conexão Master TeamSpeak</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Acesso ao Servidor de Query Global</p>
                            </div>
                        </div>
                        
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Globe size={14} className="mr-2" /> Host
                                </label>
                                <input 
                                    type="text"
                                    value={querySettings.host}
                                    onChange={(e) => setQuerySettings({...querySettings, host: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Terminal size={14} className="mr-2" /> Porta
                                </label>
                                <input 
                                    type="number"
                                    value={querySettings.query_port}
                                    onChange={(e) => setQuerySettings({...querySettings, query_port: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Users size={14} className="mr-2" /> Usuário
                                </label>
                                <input 
                                    type="text"
                                    value={querySettings.username}
                                    onChange={(e) => setQuerySettings({...querySettings, username: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Key size={14} className="mr-2" /> Senha
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

                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/30">
                            <div className="p-3 bg-orange-500 text-white rounded-2xl">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-widest text-lg">Server Query Flood</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Prevenção contra spam global</p>
                            </div>
                        </div>
                        
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-inter">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Comandos</label>
                                    <input 
                                        type="number"
                                        value={querySettings.flood_commands}
                                        onChange={(e) => setQuerySettings({...querySettings, flood_commands: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Janela (s)</label>
                                    <input 
                                        type="number"
                                        value={querySettings.flood_time}
                                        onChange={(e) => setQuerySettings({...querySettings, flood_time: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Ban (s)</label>
                                    <input 
                                        type="number"
                                        value={querySettings.ban_time}
                                        onChange={(e) => setQuerySettings({...querySettings, ban_time: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
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
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center">
                            <ShoppingBag size={18} className="mr-2 text-blue-600" />
                            Gerenciamento de Pedidos
                        </h2>
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
                                            <p className="text-sm font-black text-gray-900 italic">R$ {Number(order.total).toLocaleString('pt-BR')}</p>
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
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
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
                                    <th className="px-8 py-4">Cadastro</th>
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
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-1">
                                                <span className="font-black text-gray-900 italic">{user.virtual_servers_count || 0}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-black">Servers</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-blue-600 transition">
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
