<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamSpeakVirtualServer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardApiController extends Controller
{
    /**
     * Retorna os dados resumidos para o Dashboard do Cliente
     */
    public function index(): JsonResponse
    {
        $userId = Auth::id();

        // 1. Servidores Ativos
        $services = TeamSpeakVirtualServer::with(['master', 'product'])
            ->where('user_id', $userId)
            ->get();

        // 2. Estatísticas rápidas
        $stats = [
            'active_servers' => $services->where('status', 'online')->count(),
            'pending_invoices' => \App\Models\Invoice::whereHas('order', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })->where('status_id', 2)->count(), // Assumindo 2 como pendente
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'services' => $services,
                'stats' => $stats
            ]
        ]);
    }
}
