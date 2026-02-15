import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Bot, Shield, Zap } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                    Domine seu <span className="text-blue-600">TeamSpeak</span> com Tecnologia de Ponta
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A melhor plataforma de gerenciamento de servidores TS3 e bots para Tibia. Performance, segurança e automação em um só lugar.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-blue-200">
                        Começar Agora
                    </Link>
                    <Link to="/about" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-bold text-lg transition shadow-sm">
                        Saiba Mais
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="bg-blue-100 p-3 rounded-xl w-fit text-blue-600">
                        <Server size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Servidores Premium</h3>
                    <p className="text-gray-600">Infraestrutura de alta performance com proteção DDoS avançada para garantir que seu TS3 nunca caia.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="bg-purple-100 p-3 rounded-xl w-fit text-purple-600">
                        <Bot size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Bots Inteligentes</h3>
                    <p className="text-gray-600">Integração total com Tibia. Rankings, hunted lists e automação completa para sua guild.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="bg-green-100 p-3 rounded-xl w-fit text-green-600">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Setup Instantâneo</h3>
                    <p className="text-gray-600">Ativação automática logo após o pagamento. Seu servidor pronto para uso em segundos.</p>
                </div>
            </section>
        </div>
    );
}
