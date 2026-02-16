<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'order_id',
        'payment_date',
        'due_date',
        'status_id'
    ];

    protected $appends = ['paid_at'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    // Alias para compatibilidade
    public function getPaidAtAttribute()
    {
        return $this->payment_date;
    }
}
