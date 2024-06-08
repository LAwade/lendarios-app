<?php

namespace App\Livewire;

use App\Models\Category;
use App\Models\Item;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class Shop extends Component
{
    public $products;
    public $selectCategory = null;
    public array $cart = [];

    protected $listeners = ['update-cart' => 'updateCart'];

    public function confirm()
    {
        $this->cart = session('cart');
        $products = Product::findProductCart($this->cart);
        DB::beginTransaction();

        try {
            $order = new Order();
            $order->user_id = auth()->id();
            $order->status_id = 2;

            if (!$order->save()) {
                throw new Exception('Não foi possível criar a ordem de pedido.');
            }

            $itens = new Item();
            foreach ($products as $c) {
                $itens->order_id = $order->id;
                $itens->product_id = $c->id;
                $itens->quantity = $c->quantidade;
                if (!$itens->save()) {
                    throw new Exception("Não foi possível adicionar o item na ordem de pedido!");
                }
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            session()->flash('error', $e->getMessage());
        }

        unset($this->cart);
        session()->forget('cart');
        redirect('store/checkout/' . $order->id);
    }

    public function addCart($productId)
    {
        $this->cart[] = $productId;
        session(['cart' => $this->cart]);
    }

    public function showCategory($category)
    {
        $this->selectCategory = $category;
        $this->products = Product::orderBy('id')->where('category_id', $category)->get();
    }

    public function updateCart()
    {
        $this->cart = session('cart') ?? [];
    }

    public function mount()
    {
        if (!count($this->cart)) {
            $this->cart = session('cart') ?? [];
        }
    }

    public function render()
    {
        $data = [];
        $this->selectCategory = Product::min('category_id');
        $data['categories'] = Category::orderBy('name')
            ->where('is_active', 1)
            ->get();

        if (empty($this->products)) {
            $this->products = Product::where('category_id', $this->selectCategory)
                ->where('is_active', 1)
                ->get();
        }

        $data['products'] = $this->products;
        //$data['cart'] = $this->cart;
        return view('livewire.shop', $data);
    }
}
