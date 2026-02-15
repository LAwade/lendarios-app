<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Item;
use App\Models\Product;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class OrderApiController extends Controller
{
    /**
     * Listar pedidos do usuário autenticado
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        
        $orders = Order::with(['status', 'itens.product'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Criar um novo pedido (Checkout) e gerar Fatura
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Criar o Pedido
                $order = new Order();
                $order->user_id = Auth::id();
                $order->status_id = 2; // Pendente
                $order->save();

                $totalAmount = 0;

                // 2. Adicionar Itens e calcular total
                foreach ($request->items as $itemData) {
                    $product = Product::find($itemData['product_id']);
                    
                    $item = new Item();
                    $item->order_id = $order->id;
                    $item->product_id = $product->id;
                    $item->quantity = $itemData['quantity'];
                    $item->save();

                    $totalAmount += ($product->price * $product->unity) * $itemData['quantity'];
                }

                // 3. Gerar a Fatura (Invoice) automaticamente
                $invoice = new Invoice();
                $invoice->order_id = $order->id;
                $invoice->amount = $totalAmount;
                $invoice->due_date = Carbon::now()->addDays(3); // Vencimento em 3 dias
                $invoice->status_id = 2; // Pendente/Aguardando
                $invoice->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Pedido e Fatura gerados com sucesso!',
                    'order_id' => $order->id,
                    'invoice_id' => $invoice->id,
                    'amount' => $totalAmount
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar checkout: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detalhes de um pedido específico
     */
    public function show($id): JsonResponse
    {
        $order = Order::with(['status', 'itens.product', 'invoice'])
            ->where('user_id', Auth::id())
            ->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pedido não encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
