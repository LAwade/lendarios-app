<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TibiaApi extends Model
{
    use HasFactory;

    protected $fillable = ['server_name', 'api_type', 'api_url', 'is_active'];
}
