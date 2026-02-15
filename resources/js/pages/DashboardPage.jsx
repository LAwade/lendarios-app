import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
    LayoutDashboard, 
    Server, 
    CreditCard, 
    Zap, 
    Clock, 
    Settings, 
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/dashboard');
            return response.data.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const { services, stats } = dashboardData;

    return (
        <div className="space-y-10">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Servidores Ativos</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.active_servers}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Faturas Pendentes</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.pending_invoices}</h3>
                    </div>
                </div>

                <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100 flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-2xl">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Upgrade Disponível</p>
                        <h3 className="text-xl font-bold">Planos a partir de R$ 19,90</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Active Services */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-gray-900">Meus Serviços</h2>
                        <Link to="/shop" className="text-sm font-bold text-blue-600 hover:underline flex items-center">
                            Novo Servidor <ExternalLink size={14} className="ml-1" />
                        </Link>
                    </div>

                    {services.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                            <Server size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Nenhum serviço ativo</h3>
                            <p className="text-gray-500 mb-6">Você ainda não possui servidores contratados.</p>
                            <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition inline-block">
                                Ver Planos Disponíveis
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {services.map(service => (
                                <div key={service.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100">
                                                <Shield size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">TS3 Premium - {service.virtual_port}</h4>
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <span className={`h-2 w-2 rounded-full ${service.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-gray-500 font-medium">{service.status === 'online' ? 'Online' : 'Offline'}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-500 italic">{service.master?.host}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-2xl transition">
                                                <Settings size={18} />
                                                <span>Gerenciar</span>
                                            </button>
                                            <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition">
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Invoices & Alerts */}
                <div className="lg:col-span-4 space-y-8">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <CreditCard size={20} className="mr-2 text-gray-400" />
                            Faturamento Recente
                        </h2>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-2">
                                {/* Exemplo estático ou puxar da API se quiser expandir */}
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Fatura #1024</p>
                                            <p className="text-xs text-gray-500">Vence em 2 dias</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 italic">R$ 29,90</p>
                                </div>

                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Fatura #1023</p>
                                            <p className="text-xs text-gray-500">Paga em 15/02</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 italic">R$ 29,90</p>
                                </div>
                            </div>
                            <Link to="/invoices" className="block text-center py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition">
                                Ver todas as faturas
                            </Link>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-blue-900 font-bold mb-2 flex items-center">
                                <AlertCircle size={18} className="mr-2" />
                                Suporte Prioritário
                            </h4>
                            <p className="text-blue-700 text-sm mb-4">Precisa de ajuda com seu servidor ou bot de Tibia? Nossa equipe está online.</p>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                                Abrir Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
