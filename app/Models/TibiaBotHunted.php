<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TibiaBotHunted extends Model
{
    use HasFactory;

    protected $fillable = ['tibia_bot_config_id', 'name_hunted'];

    public function config()
    {
        return $this->belongsTo(TibiaBotConfig::class, 'tibia_bot_config_id');
    }
}
