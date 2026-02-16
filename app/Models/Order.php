<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'status_id'];

    protected $appends = ['total', 'status_name'];

    public function itens()
    {
        return $this->hasMany(Item::class, 'order_id');
    }

    public function product()
    {
        // Retorna o primeiro produto do pedido (através dos itens)
        return $this->hasOneThrough(
            Product::class,
            Item::class,
            'order_id',    // Foreign key on items table
            'id',          // Foreign key on products table
            'id',          // Local key on orders table
            'product_id'   // Local key on items table
        );
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'order_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function getTotalAttribute()
    {
        return $this->itens->sum(function($item) {
            return $item->quantity * ($item->product->price ?? 0);
        });
    }

    public function getStatusNameAttribute()
    {
        $statuses = [
            1 => 'completed',
            2 => 'pending',
            3 => 'cancelled'
        ];
        return $statuses[$this->status_id] ?? 'pending';
    }
}
