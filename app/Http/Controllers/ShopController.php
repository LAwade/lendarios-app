<?php

namespace App\Http\Controllers;

use App\Models\Item;

class ShopController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('pages.shop.index');
    }

    public function checkout(int $id)
    {
        $order = Item::join('orders', 'orders.id', '=', 'itens.order_id')
            ->where('orders.id', $id)
            ->where('orders.user_id', auth()->id())
            ->first();

        if (!$order) {
            abort(403);
        }

        return view('pages.shop.checkout', [
            'order_id' => $id
        ]);
    }
}
