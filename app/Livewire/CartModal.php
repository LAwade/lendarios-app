<?php

namespace App\Livewire;

use App\Models\Product;
use Livewire\Component;

class CartModal extends Component
{
    public $amount = 0;
    public $show = false;
    public $cart = [];
    private $products = [];

    protected $listeners = ['cart'];

    public function openModal()
    {
        $this->show = true;
        $this->cart = session('cart');
        if ($this->cart) {
            $this->products = Product::findProductCart($this->cart);
        }
    }

    public function closeModal()
    {
        $this->show = false;
    }

    public function delete($id){
        foreach($this->cart as $k => $c){
            if($c == $id){
                unset($this->cart[$k]);
                break;
            }
        }
        session(['cart' => $this->cart]);
        $this->dispatch('update-cart');
        
        if(!empty($this->cart)){
            $this->products = Product::findProductCart($this->cart);
        }
    }

    public function render()
    {
        return view('livewire.cart-modal', [
            'products' => $this->products
        ]);
    }
}
