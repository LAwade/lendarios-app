import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Package, ShoppingCart, Check, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addedId, setAddedId] = useState(null);
    const { addToCart } = useCart();

    const { data: categories, isLoading: loadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/categories');
            return response.data.data;
        }
    });

    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ['products', selectedCategory],
        queryFn: async () => {
            const url = selectedCategory 
                ? `/api/v1/products?category_id=${selectedCategory}` 
                : '/api/v1/products';
            const response = await axios.get(url);
            return response.data.data;
        }
    });

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-4">Loja Lendários</h1>
                    <p className="text-blue-100 text-lg">Selecione os melhores planos de servidores e bots. Ativação automática e suporte 24h.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 rotate-12 transform translate-x-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-2 mb-6 font-bold text-gray-900">
                            <Filter size={18} />
                            <span>Categorias</span>
                        </div>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${!selectedCategory ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Todas as Categorias
                            </button>
                            {categories?.map(category => (
                                <button 
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loadingProducts ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products?.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all group">
                                    <div className="h-48 bg-gray-50 flex items-center justify-center p-8 relative">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="object-contain w-full h-full transform group-hover:scale-110 transition duration-500" />
                                        ) : (
                                            <Package size={64} className="text-gray-200" />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-gray-600">
                                            {product.category?.name}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                        <div className="text-gray-500 text-sm mb-6 flex-grow">
                                            <ul className="space-y-2">
                                                {product.description?.split(';').map((spec, i) => (
                                                    <li key={i} className="flex items-start space-x-2">
                                                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                                                        <span>{spec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-auto border-t pt-6">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">A partir de</p>
                                                    <div className="text-2xl font-black text-gray-900">
                                                        R$ {Number(product.price * product.unity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 font-medium">/ mês</div>
                                            </div>
                                            <button 
                                                onClick={() => handleAddToCart(product)}
                                                className={`w-full flex items-center justify-center space-x-2 font-bold py-4 px-4 rounded-xl transition shadow-lg ${addedId === product.id ? 'bg-green-500 text-white shadow-green-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}`}
                                            >
                                                {addedId === product.id ? (
                                                    <>
                                                        <Check size={18} />
                                                        <span>Adicionado!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={18} />
                                                        <span>Contratar Plano</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
