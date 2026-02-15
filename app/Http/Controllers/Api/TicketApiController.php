<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TicketApiController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'category' => 'nullable|string'
        ]);

        $ticket = Ticket::create([
            'user_id' => Auth::id(),
            'subject' => $request->subject,
            'priority' => $request->priority,
            'category' => $request->category,
            'status' => 'open'
        ]);

        TicketMessage::create([
            'ticket_id' => ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket aberto com sucesso!',
            'data' => $ticket
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $ticket = Ticket::with(['messages.user'])
            ->where('user_id', Auth::id())
            ->find($id);

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Ticket não encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ticket
        ]);
    }

    public function reply(Request $request, $id): JsonResponse
    {
        $ticket = Ticket::where('user_id', Auth::id())->find($id);
        
        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Ticket não encontrado'], 404);
        }

        $request->validate(['message' => 'required|string']);

        $message = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => false
        ]);

        $ticket->touch(); // Atualiza updated_at
        $ticket->update(['status' => 'open']); // Reabre se estava respondido

        return response()->json([
            'success' => true,
            'message' => 'Mensagem enviada com sucesso!',
            'data' => $message
        ], 201);
    }
}
