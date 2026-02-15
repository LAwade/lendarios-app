<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\OrderApiController;
use App\Http\Controllers\Api\InvoiceApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\TeamSpeakApiController;
use App\Http\Controllers\Api\TicketApiController;
use App\Http\Controllers\Api\AdminApiController;

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
        Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);

        // Dashboard Cliente
        Route::get('dashboard', [DashboardApiController::class, 'index']);

        // TeamSpeak Management
        Route::get('teamspeak/{id}', [TeamSpeakApiController::class, 'show']);
        Route::post('teamspeak/{id}/token', [TeamSpeakApiController::class, 'generateToken']);
        Route::post('teamspeak/{id}/template', [TeamSpeakApiController::class, 'applyTemplate']);

        // Tickets de Suporte
        Route::get('tickets', [TicketApiController::class, 'index']);
        Route::post('tickets', [TicketApiController::class, 'store']);
        Route::get('tickets/{id}', [TicketApiController::class, 'show']);
        Route::post('tickets/{id}/reply', [TicketApiController::class, 'reply']);

        // Pedidos & Faturas
        Route::get('orders', [OrderApiController::class, 'index']);
        Route::post('orders', [OrderApiController::class, 'store']);
        Route::get('orders/{id}', [OrderApiController::class, 'show']);
        Route::get('invoices', [InvoiceApiController::class, 'index']);
        Route::get('invoices/{id}', [InvoiceApiController::class, 'show']);

        // --- ÁREA ADMINISTRATIVA ---
        Route::prefix('admin')->group(function () {
            Route::get('stats', [AdminApiController::class, 'stats']);
            Route::get('users', [AdminApiController::class, 'users']);
            Route::get('tickets', [AdminApiController::class, 'tickets']);
            Route::get('orders', [AdminApiController::class, 'orders']);
            Route::post('orders/{id}/confirm', [AdminApiController::class, 'confirmOrder']);
            Route::post('orders/{id}/cancel', [AdminApiController::class, 'cancelOrder']);
            
            // Configurações Globais do TS3 Query
            Route::get('query-settings', [AdminApiController::class, 'getQuerySettings']);
            Route::post('query-settings', [AdminApiController::class, 'updateQuerySettings']);
        });
    });
});
