import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, ShieldCheck, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            // Envia para a API de Pedidos que criamos no Laravel
            const response = await axios.post('/api/v1/orders', { items });

            if (response.data.success) {
                clearCart();
                // Redireciona para uma página de sucesso ou dashboard (podemos criar depois)
                alert('Pedido realizado com sucesso! Você será redirecionado para o pagamento.');
                window.location.href = `/store/checkout/${response.data.order_id}`; // Usando a rota legado por enquanto para aproveitar o checkout pronto
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro ao processar seu pedido. Verifique se você está logado.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
                <Link to="/shop" className="text-blue-600 font-bold hover:underline">Voltar para a loja</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 font-medium transition">
                <ArrowLeft size={18} className="mr-2" />
                Voltar para a loja
            </Link>

            <h1 className="text-4xl font-black text-gray-900 mb-10">Finalizar Pedido</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Resumo dos Itens */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900">Itens do Pedido</h2>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <li key={item.id} className="p-6 flex items-center">
                                    <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border">
                                        <img src={item.image || '/imagem/box.png'} alt={item.name} className="h-10 w-10 object-contain" />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">{item.quantity}x • R$ {(item.price * item.unity).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <div className="text-right font-black text-gray-900">
                                        R$ {(item.price * item.unity * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start space-x-4">
                        <div className="bg-blue-600 text-white p-2 rounded-xl">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900">Compra 100% Segura</h4>
                            <p className="text-blue-700 text-sm">Seus dados de pagamento são criptografados e processados de forma segura pelos melhores gateways.</p>
                        </div>
                    </div>
                </div>

                {/* Pagamento / Checkout */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Resumo do Pagamento</h2>
                        
                        <div className="space-y-4 mb-8 text-lg">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxas</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4"></div>
                            <div className="flex justify-between text-2xl font-black text-gray-900">
                                <span>Total</span>
                                <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-lg font-black py-5 px-4 rounded-2xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-100"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    <span>Ir para o Pagamento</span>
                                </>
                            )}
                        </button>
                        
                        <p className="text-center text-gray-400 text-xs mt-6 font-medium uppercase tracking-widest">
                            Ativação imediata após confirmação
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
