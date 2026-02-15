import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, X, Plus, Minus, Trash2, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen flex flex-col">
            <header className="bg-lendarios-dark text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/imagem/lendariosteam-branco.png" alt="Lendarios" className="h-8" />
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="hover:text-blue-400 transition font-medium">Início</Link>
                        <Link to="/shop" className="hover:text-blue-400 transition font-medium">Loja</Link>
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
                                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                                        {user?.name?.substring(0, 2)}
                                    </div>
                                    <span className="text-sm font-bold hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-gray-900 z-[70]">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Minha Conta</p>
                                        </div>
                                        <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 transition text-sm font-medium">
                                            <LayoutDashboard size={16} className="text-gray-400" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 text-red-600 transition text-sm font-bold"
                                        >
                                            <LogOut size={16} />
                                            <span>Sair do Sistema</span>
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

            {/* Cart Drawer Overlay (mesma lógica anterior) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md">
                            <div className="h-full flex flex-col bg-white shadow-2xl">
                                <div className="flex-1 py-8 overflow-y-auto px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-2xl font-black text-gray-900">Carrinho</h2>
                                        <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition">
                                            <X size={28} />
                                        </button>
                                    </div>

                                    <div className="mt-10">
                                        {cart.length === 0 ? (
                                            <div className="text-center py-20">
                                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                                    <ShoppingCart size={32} />
                                                </div>
                                                <p className="text-gray-500 font-medium">Seu carrinho está vazio.</p>
                                                <button 
                                                    onClick={() => setIsCartOpen(false)}
                                                    className="mt-6 text-blue-600 font-black hover:underline"
                                                >
                                                    Continuar navegando
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="space-y-6">
                                                {cart.map((item) => (
                                                    <li key={item.id} className="flex bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center">
                                                            <img src={item.image || '/imagem/box.png'} alt={item.name} className="max-h-full max-w-full object-contain" />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition">
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between mt-2">
                                                                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2">
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-blue-600"><Minus size={12} /></button>
                                                                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-blue-600"><Plus size={12} /></button>
                                                                </div>
                                                                <p className="text-sm font-black text-gray-900">
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
                                    <div className="border-t border-gray-100 p-8 space-y-6 bg-gray-50/30">
                                        <div className="flex justify-between items-center text-gray-900">
                                            <span className="font-medium text-gray-500 text-lg">Total estimado</span>
                                            <span className="text-3xl font-black italic">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <Link
                                            to="/checkout"
                                            onClick={() => setIsCartOpen(false)}
                                            className="w-full flex justify-center items-center py-5 rounded-2xl shadow-xl shadow-blue-100 text-lg font-black text-white bg-blue-600 hover:bg-blue-700 transition"
                                        >
                                            Finalizar Compra
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <img src="/imagem/lendariosteam-branco.png" alt="Lendarios" className="h-6 mx-auto mb-8 opacity-40" />
                    <p className="text-sm max-w-lg mx-auto leading-relaxed">
                        Lendários TeaM &copy; {new Date().getFullYear()}. Todos os direitos reservados. 
                        A plataforma definitiva para gerenciamento de TeamSpeak 3 e integração com Tibia.
                    </p>
                </div>
            </footer>
        </div>
    );
}
