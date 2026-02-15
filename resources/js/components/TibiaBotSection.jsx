import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
    Bot, 
    Skull, 
    Users, 
    Settings, 
    RefreshCw, 
    Save, 
    Sword, 
    Shield, 
    Zap,
    AlertCircle,
    UserMinus,
    Trophy,
    Hash,
    Layers,
    Volume2,
    Newspaper
} from 'lucide-react';

export default function TibiaBotSection({ serverId }) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        tibia_api_id: '',
        guild_name: '',
        world: 'opentibia',
        hunted_level: 350,
        alert_poke: false,
        channel_friend_list: '',
        channel_neutral_list: '',
        channel_hunted_list: '',
        channel_huntedmaker_list: '',
        channel_ally_list: '',
        channel_enemy_list: '',
        channel_death_list: '',
        channel_news_list: ''
    });

    const { data: botData, isLoading } = useQuery({
        queryKey: ['tibiabot', serverId],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/tibiabot`);
            return response.data.data;
        }
    });

    const { data: channels, isLoading: loadingChannels } = useQuery({
        queryKey: ['ts-channels', serverId],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/channels`);
            return response.data.data;
        },
        enabled: isEditing
    });

    const { data: listsData, isLoading: loadingLists } = useQuery({
        queryKey: ['tibiabot-lists', serverId],
        queryFn: async () => {
            const response = await axios.get(`/api/v1/teamspeak/${serverId}/tibiabot/lists`);
            return response.data.data;
        },
        enabled: !!botData?.config && !isEditing
    });

    useEffect(() => {
        if (botData?.config) {
            setFormData({
                tibia_api_id: botData.config.tibia_api_id || '',
                guild_name: botData.config.guild_name || '',
                world: botData.config.world || 'opentibia',
                hunted_level: botData.config.hunted_level || 350,
                alert_poke: !!botData.config.alert_poke,
                channel_friend_list: botData.config.channel_friend_list || '',
                channel_neutral_list: botData.config.channel_neutral_list || '',
                channel_hunted_list: botData.config.channel_hunted_list || '',
                channel_huntedmaker_list: botData.config.channel_huntedmaker_list || '',
                channel_ally_list: botData.config.channel_ally_list || '',
                channel_enemy_list: botData.config.channel_enemy_list || '',
                channel_death_list: botData.config.channel_death_list || '',
                channel_news_list: botData.config.channel_news_list || ''
            });
        }
    }, [botData]);

    const saveMutation = useMutation({
        mutationFn: (data) => axios.post(`/api/v1/teamspeak/${serverId}/tibiabot`, data),
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries(['tibiabot', serverId]);
            alert('Configurações do BOT salvas com sucesso!');
        }
    });

    if (isLoading) return <div className="flex justify-center py-10"><RefreshCw className="animate-spin text-blue-600" /></div>;

    const { config, apis } = botData;

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    if (!config && !isEditing) {
        return (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-6">
                <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                    <Bot size={40} />
                </div>
                <div className="max-w-sm mx-auto">
                    <h3 className="text-xl font-black text-gray-900">Configurar Tibia BOT</h3>
                    <p className="text-gray-500 mt-2">Ative o monitoramento automático para o seu TeamSpeak agora mesmo.</p>
                </div>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition shadow-lg shadow-blue-100"
                >
                    Configurar Agora
                </button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center">
                        <Settings size={18} className="mr-2 text-blue-600" />
                        Configurações do BOT
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase">Cancelar</button>
                </div>
                <form onSubmit={handleSave} className="p-8 space-y-10 font-inter">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b pb-2">Informações da Guild</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Servidor / API</label>
                                    <select 
                                        value={formData.tibia_api_id}
                                        onChange={(e) => setFormData({...formData, tibia_api_id: e.target.value})}
                                        required
                                        className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    >
                                        <option value="">Selecione...</option>
                                        {apis?.map(api => (
                                            <option key={api.id} value={api.id}>{api.server_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Guild</label>
                                    <input 
                                        type="text"
                                        value={formData.guild_name}
                                        onChange={(e) => setFormData({...formData, guild_name: e.target.value})}
                                        required
                                        className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mundo (World)</label>
                                        <input 
                                            type="text"
                                            value={formData.world}
                                            onChange={(e) => setFormData({...formData, world: e.target.value})}
                                            required
                                            className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Level Hunted</label>
                                        <input 
                                            type="number"
                                            value={formData.hunted_level}
                                            onChange={(e) => setFormData({...formData, hunted_level: e.target.value})}
                                            className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <input 
                                        type="checkbox"
                                        id="alert_poke"
                                        checked={formData.alert_poke}
                                        onChange={(e) => setFormData({...formData, alert_poke: e.target.checked})}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="alert_poke" className="text-xs font-bold text-blue-900 cursor-pointer">Ativar Pokes de Hunted Online</label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b pb-2">Mapeamento de Salas (TS3)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'channel_friend_list', label: 'Friends List', icon: <Users size={14} /> },
                                    { id: 'channel_hunted_list', label: 'Hunted List', icon: <Sword size={14} /> },
                                    { id: 'channel_neutral_list', label: 'Neutral List', icon: <Hash size={14} /> },
                                    { id: 'channel_huntedmaker_list', label: 'Hunted Makers', icon: <UserMinus size={14} /> },
                                    { id: 'channel_ally_list', label: 'Ally List', icon: <Shield size={14} /> },
                                    { id: 'channel_enemy_list', label: 'Enemy List', icon: <Zap size={14} /> },
                                    { id: 'channel_death_list', label: 'Death Log', icon: <Skull size={14} /> },
                                    { id: 'channel_news_list', label: 'News List', icon: <Newspaper size={14} /> },
                                ].map(chan => (
                                    <div key={chan.id}>
                                        <label className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            {chan.icon} <span className="ml-1">{chan.label}</span>
                                        </label>
                                        <select 
                                            value={formData[chan.id]}
                                            onChange={(e) => setFormData({...formData, [chan.id]: e.target.value})}
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-gray-900 transition"
                                        >
                                            <option value="">Desativado</option>
                                            {channels?.map(c => (
                                                <option key={c.cid} value={c.cid}>{c.channel_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                        <button 
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl shadow-blue-200 flex items-center space-x-2"
                        >
                            {saveMutation.isPending ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                            <span>Salvar Configuração</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Bot Overview Header */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Bot size={20} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{config.guild_name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 font-bold text-xs">
                        <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center">
                            <Globe size={14} className="mr-2 text-blue-400" /> {config.world}
                        </span>
                        <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center">
                            <Trophy size={14} className="mr-2 text-yellow-400" /> Level {config.hunted_level}+
                        </span>
                        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/20 flex items-center">
                            <CheckCircle size={14} className="mr-2" /> Bot Ativo
                        </span>
                    </div>
                </div>
                <div className="relative z-10 flex gap-4">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition hover:bg-gray-100"
                    >
                        Configurar Salas
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Real-time Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-inter">
                {/* Friends / Makers List */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 bg-green-50/30 flex items-center justify-between">
                        <h4 className="font-black text-green-800 uppercase tracking-widest text-[10px] flex items-center">
                            <Users size={14} className="mr-2" /> Makers & Friends
                        </h4>
                        <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {listsData?.friends?.filter(p => p.status === 'online').length || 0} Online
                        </span>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto max-h-[500px] space-y-2">
                        {loadingLists ? (
                            [1,2,3,4].map(n => <div key={n} className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>)
                        ) : !listsData?.friends?.length ? (
                            <p className="text-center py-10 text-xs text-gray-400 italic">Nenhum jogador encontrado.</p>
                        ) : (
                            listsData?.friends?.map((player, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                                            {player.vocation ? player.vocation.substring(0,2) : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{player.name}</p>
                                            <p className="text-[10px] text-gray-400 font-black">LVL {player.level}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Hunted List */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 bg-red-50/30 flex items-center justify-between">
                        <h4 className="font-black text-red-800 uppercase tracking-widest text-[10px] flex items-center">
                            <Sword size={14} className="mr-2" /> Hunted List
                        </h4>
                        <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            {listsData?.neutrals?.filter(p => p.level >= config.hunted_level).length || 0} Targeted
                        </span>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto max-h-[500px] space-y-2">
                         {loadingLists ? (
                            [1,2,3,4].map(n => <div key={n} className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>)
                        ) : !listsData?.neutrals?.filter(p => p.level >= config.hunted_level).length ? (
                            <p className="text-center py-10 text-xs text-gray-400 italic">Nenhum hunted online.</p>
                        ) : (
                            listsData?.neutrals?.filter(p => p.level >= config.hunted_level).map((player, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-red-50/50 rounded-2xl transition group border border-transparent hover:border-red-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                                            {player.vocation ? player.vocation.substring(0,2) : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{player.name}</p>
                                            <p className="text-[10px] text-red-500 font-black italic">LVL {player.level}</p>
                                        </div>
                                    </div>
                                    <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Death Log */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 bg-gray-900 flex items-center justify-between">
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center">
                            <Skull size={14} className="mr-2 text-white" /> Recent Deaths
                        </h4>
                        <Clock size={14} className="text-gray-600" />
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto max-h-[500px] space-y-3">
                        {loadingLists ? (
                            [1,2,3,4].map(n => <div key={n} className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>)
                        ) : !listsData?.deaths?.length ? (
                            <p className="text-center py-10 text-xs text-gray-400 italic">Nenhuma morte recente.</p>
                        ) : (
                            listsData?.deaths?.map((death, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-black text-gray-900 leading-tight">{death.name}</p>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(death.hours).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed italic">{death.reason?.replace(/<[^>]*>?/gm, '')}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
