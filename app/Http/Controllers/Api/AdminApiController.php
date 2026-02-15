<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Invoice;
use App\Models\Ticket;
use App\Models\TeamSpeakVirtualServer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminApiController extends Controller
{
    /**
     * Estatísticas gerais para o Admin
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'active_servers' => TeamSpeakVirtualServer::where('status', 'online')->count(),
                'pending_invoices' => Invoice::where('status_id', 2)->count(),
                'open_tickets' => Ticket::where('status', 'open')->count(),
                'monthly_revenue' => Invoice::where('status_id', 1)->whereMonth('created_at', now()->month)->sum('amount'),
            ]
        ]);
    }

    /**
     * Listar todos os usuários
     */
    public function users(): JsonResponse
    {
        $users = User::withCount(['virtualServers', 'orders'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Listar todos os tickets pendentes
     */
    public function tickets(): JsonResponse
    {
        $tickets = Ticket::with('user')->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $tickets]);
    }
}
