<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::select(
            'orders.id',
            'orders.status_id',
            'status.id as status_id',
            'status.name',
            DB::raw('SUM(itens.quantity) AS qtd'),
            DB::raw('SUM(products.price * products.unity) AS amount'),
            'orders.created_at',
            'orders.updated_at'
        )
            ->join('itens', 'orders.id', '=', 'itens.order_id')
            ->join('products', 'products.id', '=', 'itens.product_id')
            ->join('status', 'status.id', '=', 'orders.status_id')
            ->where('orders.user_id', auth()->id())
            ->groupBy('orders.id', 'orders.status_id', 'orders.created_at', 'orders.updated_at', 'status.id', 'status.name')
            ->get();
        return view('pages.order.index', ['orders' => $orders]);
    }
}
