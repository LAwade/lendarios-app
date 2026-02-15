<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductApiController extends Controller
{
    /**
     * Listar todos os produtos ativos
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category')
            ->where('is_active', true);
        
        // Filtrar por categoria se especificada
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Buscar por nome se especificado
        if ($request->has('search')) {
            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }
        
        $products = $query->orderBy('name')->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
    
    /**
     * Obter detalhes de um produto específico
     */
    public function show($id): JsonResponse
    {
        $product = Product::with('category')
            ->where('is_active', true)
            ->find($id);
            
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }
    
    /**
     * Listar produtos populares/em destaque
     */
    public function featured(): JsonResponse
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}