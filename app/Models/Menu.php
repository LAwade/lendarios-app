<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory;

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    static function findStruture($value)
    {
        $menu = Menu::join('pages', 'menus.id', '=', 'pages.menu_id')
            ->selectRaw("menus.id as menu_id, menus.name as menu_name, menus.icon, pages.*")
            ->where('pages.perm_min', '<=', $value)
            ->where('pages.perm_max', '>=', $value)
            ->where('menus.is_active', true)
            ->where('pages.is_active', true)
            ->orderBy('menus.name')
            ->orderBy('pages.name')
            ->get();

        return $menu;
    }
}
