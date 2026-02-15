<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamSpeakVirtualServer extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_id',
        'user_id',
        'product_id',
        'virtual_port',
        'sid',
        'status', // online, offline, suspended
        'expires_at'
    ];

    public function master()
    {
        return $this->belongsTo(TeamSpeakServerMaster::class, 'master_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
