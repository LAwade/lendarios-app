<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamSpeakBackup extends Model
{
    use HasFactory;

    protected $table = 'teamspeak_backups';

    protected $fillable = [
        'virtual_server_id',
        'user_id',
        'snapshot',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relação com o servidor virtual
     */
    public function virtualServer()
    {
        return $this->belongsTo(TeamSpeakVirtualServer::class, 'virtual_server_id');
    }

    /**
     * Relação com o usuário
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
