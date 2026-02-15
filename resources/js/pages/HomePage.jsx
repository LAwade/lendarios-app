import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Bot, Shield, Zap, Clock, Globe, Cpu, MessageSquare, Star, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-4">
                    ✨ Tecnologia de Ponta para Tibia & TS3
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
                    Domine seu <span className="text-blue-600">TeamSpeak</span> <br /> com Automação Total
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    A melhor plataforma de gerenciamento de servidores TS3 e bots inteligentes para Tibia. Performance brasileira, proteção DDoS e setup instantâneo.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                    <Link to="/shop" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition shadow-xl shadow-blue-200 flex items-center justify-center space-x-2">
                        <span>Ver Planos e Preços</span>
                    </Link>
                    <Link to="/register" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-lg transition shadow-sm">
                        Criar Conta Grátis
                    </Link>
                </div>
            </section>

            {/* Diferenciais Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-gray-900">Nossos Diferenciais</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Por que centenas de guilds escolhem a Lendários TeaM todos os dias?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <Clock />, title: "Atualização Flash", desc: "BOT com atualização ultra-rápida de 10s a 30s.", color: "blue" },
                        { icon: <Globe />, title: "Ping Brasileiro", desc: "Servidores hospedados no Brasil com latência de 15ms.", color: "green" },
                        { icon: <Bot />, title: "Suporte TS6", desc: "Nosso BOT já suporta totalmente o novo TeamSpeak 6.", color: "purple" },
                        { icon: <Shield />, title: "DDoS Protection", desc: "Sua guild sempre online com proteção de nível empresarial.", color: "red" },
                        { icon: <Cpu />, title: "Painel Poderoso", desc: "Gerenciamento completo e intuitivo com funções incríveis.", color: "orange" },
                        { icon: <Zap />, title: "Setup Instantâneo", desc: "Ativação automática logo após a confirmação do pagamento.", color: "yellow" }
                    ].map((feat, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className={`bg-${feat.color}-50 text-${feat.color}-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition`}>
                                {React.cloneElement(feat.icon, { size: 28 })}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Funções do BOT */}
            <section className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black leading-tight">
                            ⚡️ Funções Poderosas <br /> <span className="text-blue-400">Integradas ao Tibia</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                "BOT de Comando (!mp, !mm, !mk)",
                                "Listas (Friend, Hunted, Death)",
                                "Makers List Automática",
                                "Alertas de Morte em Tempo Real",
                                "Alertas de Level Up e Conexão",
                                "Configuração Automática de Canais"
                            ].map((task, i) => (
                                <div key={i} className="flex items-center space-x-3 text-gray-300">
                                    <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" />
                                    <span className="font-medium">{task}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/shop" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition">
                            Explorar Funções na Loja
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1 shadow-2xl rotate-3">
                            <div className="bg-gray-800 rounded-[1.4rem] p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-3 font-mono text-sm">
                                    <p className="text-blue-400">[SYSTEM] <span className="text-gray-300">BOT Conectado ao Servidor</span></p>
                                    <p className="text-green-400">[ALERTA] <span className="text-gray-300">MataSeisTudo (Level 450) acabou de morrer!</span></p>
                                    <p className="text-purple-400">[COMANDO] <span className="text-gray-300">!mp enviado para todos os membros.</span></p>
                                    <p className="text-blue-400">[INFO] <span className="text-gray-300">Makers List atualizada: 85 online.</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-gray-900">O que a galera diz</h2>
                    <p className="text-gray-500">Feedback real de quem utiliza nossos serviços todos os dias.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "João Pedro VaiNaFé", text: "O serviço de TeamSpeak + BOTs é simplesmente incrível! A integração com o meu servidor Tibia foi fácil, e os alertas ajudam muito." },
                        { name: "Marcelo Oliveira Consumidos", text: "A qualidade e estabilidade do servidor TeamSpeak é excelente, e o suporte foi muito ágil quando precisei. O BOT automatizou tudo!" },
                        { name: "MataSeisTudo BLACK BACK", text: "Tudo foi pensado em quem joga Tibia. Simplesmente cheguei e coloquei a galera pra jogar sem precisar fazer nada!" }
                    ].map((test, i) => (
                        <div key={i} className="bg-blue-50/50 p-8 rounded-3xl space-y-6">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-700 italic">"{test.text}"</p>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {test.name[0]}
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{test.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="text-center py-20 bg-blue-600 rounded-[3rem] text-white shadow-2xl shadow-blue-200">
                <h2 className="text-4xl font-black mb-6">Pronto para elevar o nível da sua Guild?</h2>
                <p className="text-blue-100 mb-10 max-w-xl mx-auto">Junte-se a centenas de jogadores e tenha o controle total do seu TeamSpeak hoje mesmo.</p>
                <Link to="/shop" className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 transition shadow-lg shadow-blue-700/20">
                    Começar Agora
                </Link>
            </section>
        </div>
    );
}
