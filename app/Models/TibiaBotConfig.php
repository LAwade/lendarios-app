<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TibiaBotConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'virtual_server_id',
        'tibia_api_id',
        'guild_name',
        'world',
        'hunted_level',
        'alert_poke',
        'channel_friend_list',
        'channel_neutral_list',
        'channel_hunted_list',
        'channel_huntedmaker_list',
        'channel_ally_list',
        'channel_enemy_list',
        'channel_death_list',
        'channel_news_list'
    ];

    public function virtualServer()
    {
        return $this->belongsTo(TeamSpeakVirtualServer::class);
    }

    public function api()
    {
        return $this->belongsTo(TibiaApi::class, 'tibia_api_id');
    }

    public function hunteds()
    {
        return $this->hasMany(TibiaBotHunted::class);
    }
}
