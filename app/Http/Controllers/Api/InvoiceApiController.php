<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class InvoiceApiController extends Controller
{
    /**
     * Listar faturas do usuário
     */
    public function index(): JsonResponse
    {
        $invoices = Invoice::with(['order', 'status'])
            ->whereHas('order', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->orderBy('due_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * Ver detalhes de uma fatura específica
     */
    public function show($id): JsonResponse
    {
        $invoice = Invoice::with(['order.itens.product', 'status'])
            ->whereHas('order', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Fatura não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }
}
