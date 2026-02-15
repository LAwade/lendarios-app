import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Package, ShoppingCart, Info } from 'lucide-react';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nossa Loja</h1>
                    <p className="text-gray-600">Escolha o melhor plano para o seu servidor.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                    >
                        Todos
                    </button>
                    {categories?.map(category => (
                        <button 
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {loadingProducts ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products?.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="h-40 bg-gray-100 flex items-center justify-center">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                ) : (
                                    <Package size={48} className="text-gray-300" />
                                )}
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                                    {product.category?.name}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                                    {product.description}
                                </p>
                                <div className="mt-auto">
                                    <div className="text-2xl font-bold text-gray-900 mb-4">
                                        R$ {Number(product.price * product.unity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        <span className="text-sm font-normal text-gray-500"> /mês</span>
                                    </div>
                                    <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">
                                        <ShoppingCart size={18} />
                                        <span>Contratar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
