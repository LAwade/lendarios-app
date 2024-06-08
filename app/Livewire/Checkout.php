<?php

namespace App\Livewire;

use App\Models\Item;
use Livewire\Component;

class Checkout extends Component
{
    public $order_id;
    public $code;
    public $amount = 0;

    public function verifycode(){
        if($this->code == 'LENDARIOS'){
            $this->amount -=5;
        } else {
            $this->code = '';
        }
    }

    public function render()
    {
        $itens = Item::join('orders', 'orders.id', '=', 'itens.order_id')
            ->join('products', 'products.id', '=', 'itens.product_id')
            ->where('orders.id', $this->order_id)
            ->select('itens.*', 'products.*', 'orders.*')
            ->get();

        return view('livewire.checkout', [
            'itens' => $itens
        ]);
    }
}
