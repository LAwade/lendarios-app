<?php

namespace App\Http\Controllers;

use App\Models\Product;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index(){

        $products = Product::join('categories', 'categories.id', '=', 'products.category_id')
        ->selectRaw('products.*, categories.name as category_name')->get();

        return view('pages.product.index', [
            'products' => $products
        ]);
    }
}
