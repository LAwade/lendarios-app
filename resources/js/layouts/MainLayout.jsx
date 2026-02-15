import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MainLayout() {
    const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-lendarios-dark text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/imagem/lendariosteam-branco.png" alt="Lendarios" className="h-8" />
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="hover:text-blue-400 transition">Início</Link>
                        <Link to="/shop" className="hover:text-blue-400 transition">Loja</Link>
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
                        <Link to="/login" className="hidden sm:flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition text-sm font-bold">
                            <User size={16} />
                            <span>Entrar</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md">
                            <div className="h-full flex flex-col bg-white shadow-xl">
                                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-bold text-gray-900">Carrinho de Compras</h2>
                                        <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-500">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="mt-8">
                                        {cart.length === 0 ? (
                                            <div className="text-center py-12">
                                                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                                                <p className="text-gray-500">Seu carrinho está vazio.</p>
                                                <button 
                                                    onClick={() => setIsCartOpen(false)}
                                                    className="mt-4 text-blue-600 font-bold hover:text-blue-700"
                                                >
                                                    Continuar comprando
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-gray-200">
                                                {cart.map((item) => (
                                                    <li key={item.id} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                                                            <img src={item.image || '/imagem/box.png'} alt={item.name} className="w-12 h-12 object-contain" />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-bold text-gray-900">
                                                                    <h3>{item.name}</h3>
                                                                    <p className="ml-4">
                                                                        R$ {(item.price * item.unity * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                    </p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">{item.category?.name}</p>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                <div className="flex items-center border rounded-lg">
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100"><Minus size={14} /></button>
                                                                    <span className="px-3 font-medium">{item.quantity}</span>
                                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100"><Plus size={14} /></button>
                                                                </div>
                                                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 flex items-center space-x-1 font-medium">
                                                                    <Trash2 size={14} />
                                                                    <span>Remover</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {cart.length > 0 && (
                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                        <div className="flex justify-between text-base font-bold text-gray-900">
                                            <p>Subtotal</p>
                                            <p>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">Impostos e taxas incluídos no checkout.</p>
                                        <div className="mt-6">
                                            <Link
                                                to="/checkout"
                                                onClick={() => setIsCartOpen(false)}
                                                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
                                            >
                                                Finalizar Compra
                                            </Link>
                                        </div>
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

            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <img src="/imagem/lendariosteam-branco.png" alt="Lendarios" className="h-6 mx-auto mb-6 opacity-50" />
                    <p className="text-sm">&copy; {new Date().getFullYear()} Lendários TeaM. A melhor plataforma de TeamSpeak Server.</p>
                </div>
            </footer>
        </div>
    );
}
