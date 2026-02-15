<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\OrderApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Autenticação (Pública)
    Route::post('registrar', [App\Http\Controllers\AuthController::class, 'store']);
    Route::post('autenticar', [App\Http\Controllers\AuthController::class, 'verify']);

    // Produtos e Categorias (Pública)
    Route::get('products', [ProductApiController::class, 'index']);
    Route::get('products/featured', [ProductApiController::class, 'featured']);
    Route::get('products/{id}', [ProductApiController::class, 'show']);
    Route::get('categories', [CategoryApiController::class, 'index']);
    Route::get('categories/{id}', [CategoryApiController::class, 'show']);

    // Rotas Protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', function (Request $request) {
            return $request->user();
        });

        // Pedidos
        Route::get('orders', [OrderApiController::class, 'index']);
        Route::post('orders', [OrderApiController::class, 'store']);
        Route::get('orders/{id}', [OrderApiController::class, 'show']);
    });
});
