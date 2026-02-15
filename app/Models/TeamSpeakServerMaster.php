<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamSpeakServerMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'host',
        'query_port',
        'username',
        'password',
        'is_active'
    ];

    protected $hidden = [
        'password'
    ];

    public function virtualServers()
    {
        return $this->hasMany(TeamSpeakVirtualServer::class, 'master_id');
    }
}
