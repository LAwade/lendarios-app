import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, ShoppingCart, User, Menu } from 'lucide-react';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-lendarios-dark text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/imagem/lendariosteam-branco.png" alt="Lendarios" className="h-8" />
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="hover:text-blue-400 transition">Início</Link>
                        <Link to="/shop" className="hover:text-blue-400 transition">Loja</Link>
                        <Link to="/about" className="hover:text-blue-400 transition">Sobre</Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition">
                            <ShoppingCart size={20} />
                            <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                        </Link>
                        <Link to="/login" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-sm font-medium">
                            <User size={16} />
                            <span>Entrar</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Lendários TeaM. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
