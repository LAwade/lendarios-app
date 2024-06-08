<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public function items()
    {
        return $this->hasMany(Item::class);
    }
    
    static function findProductCart(array $cart)
    {
        $products = Product::whereIn('id', $cart)->get();
        if (!$products) {
            return null;
        }
        foreach ($products as $product) {
            foreach ($cart as $c) {
                if ($product->id == $c) {
                    $product->quantidade++;
                }
            }
        }
        return $products;
    }
}
