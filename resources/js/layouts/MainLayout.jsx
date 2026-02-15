import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, X, Plus, Minus, Trash2, LogOut, LayoutDashboard, LifeBuoy, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function MainLayout() {
    const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <header className="bg-lendarios-dark text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Logo light={true} />
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="hover:text-blue-400 transition font-bold text-sm uppercase tracking-widest">Início</Link>
                        <Link to="/shop" className="hover:text-blue-400 transition font-bold text-sm uppercase tracking-widest">Loja</Link>
                        {isAuthenticated && (
                            <Link to="/tickets" className="hover:text-blue-400 transition font-bold text-sm uppercase tracking-widest flex items-center">
                                <LifeBuoy size={16} className="mr-1.5 text-blue-500" />
                                Suporte
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 hover:bg-gray-800 rounded-full transition"
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-lendarios-dark">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition border border-gray-700"
                                >
                                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black uppercase">
                                        {user?.name?.substring(0, 2)}
                                    </div>
                                    <span className="text-sm font-black hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 text-gray-900 z-[70] overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logado como</p>
                                            <p className="text-sm font-bold truncate italic text-blue-600">{user?.email}</p>
                                        </div>
                                        <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition text-sm font-bold">
                                            <LayoutDashboard size={18} className="text-gray-400" />
                                            <span>Dashboard</span>
                                        </Link>
                                        {user?.permission_id === 1 && (
                                            <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition text-sm font-black text-blue-600">
                                                <ShieldCheck size={18} />
                                                <span>Painel Admin</span>
                                            </Link>
                                        )}
                                        <Link to="/tickets" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition text-sm font-bold">
                                            <LifeBuoy size={18} className="text-gray-400" />
                                            <span>Tickets de Suporte</span>
                                        </Link>
                                        <div className="h-px bg-gray-50 my-2"></div>
                                        <button 
                                            onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-red-600 transition text-sm font-black"
                                        >
                                            <LogOut size={18} />
                                            <span>Encerrar Sessão</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl transition text-sm font-black shadow-lg shadow-blue-900/20 text-white">
                                <User size={16} />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsCartOpen(false)}></div>
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md">
                            <div className="h-full flex flex-col bg-white shadow-2xl">
                                <div className="flex-1 py-8 overflow-y-auto px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Carrinho</h2>
                                        <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition">
                                            <X size={32} />
                                        </button>
                                    </div>

                                    <div className="mt-12">
                                        {cart.length === 0 ? (
                                            <div className="text-center py-20">
                                                <div className="bg-gray-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200">
                                                    <ShoppingCart size={40} />
                                                </div>
                                                <p className="text-gray-500 font-bold text-lg">Seu carrinho está vazio.</p>
                                                <button 
                                                    onClick={() => setIsCartOpen(false)}
                                                    className="mt-6 bg-blue-50 text-blue-600 px-8 py-3 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    Explorar Loja
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="space-y-6">
                                                {cart.map((item) => (
                                                    <li key={item.id} className="flex bg-gray-50/50 p-5 rounded-[32px] border border-gray-100 group transition">
                                                        <div className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl border border-gray-200 p-3 flex items-center justify-center group-hover:border-blue-200 transition shadow-sm">
                                                            <img src={item.image || '/imagem/box.png'} alt={item.name} className="max-h-full max-w-full object-contain" />
                                                        </div>

                                                        <div className="ml-5 flex-1 flex flex-col">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm leading-tight">{item.name}</h3>
                                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between mt-4">
                                                                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 shadow-sm">
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-blue-600 transition"><Minus size={14} /></button>
                                                                    <span className="px-4 text-sm font-black italic">{item.quantity}</span>
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-blue-600 transition"><Plus size={14} /></button>
                                                                </div>
                                                                <p className="text-lg font-black text-gray-900 italic">
                                                                    R$ {(item.price * item.unity * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {cart.length > 0 && (
                                    <div className="border-t border-gray-100 p-8 space-y-6 bg-gray-50/50">
                                        <div className="flex justify-between items-center text-gray-900">
                                            <span className="font-black text-gray-400 uppercase tracking-widest text-xs">Total Estimado</span>
                                            <span className="text-4xl font-black italic tracking-tighter">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <Link
                                            to="/checkout"
                                            onClick={() => setIsCartOpen(false)}
                                            className="w-full flex justify-center items-center py-6 rounded-[32px] shadow-2xl shadow-blue-200 text-xl font-black text-white bg-blue-600 hover:bg-blue-700 transition uppercase tracking-widest"
                                        >
                                            Check-out Seguro
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow container mx-auto px-4 py-12">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-gray-400 py-20 border-t border-gray-800 font-inter">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <Logo light={true} className="mx-auto opacity-30 h-10" />
                    <p className="text-sm max-w-lg mx-auto leading-relaxed font-medium">
                        Lendários TeaM &copy; {new Date().getFullYear()}. Tecnologia de ponta para 
                        comunidades gamer, gerenciamento de TeamSpeak 3 e inteligência Tibia.
                    </p>
                    <div className="h-px bg-gray-800 w-20 mx-auto"></div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-600 italic">
                        The Ultimate Gaming Infrastructure
                    </p>
                </div>
            </footer>
        </div>
    );
}
