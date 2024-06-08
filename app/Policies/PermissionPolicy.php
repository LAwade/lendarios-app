<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Route;

class PermissionPolicy
{
    use HandlesAuthorization;

    public function hasPermission(?User $user)
    {

        if (!$user) {
            abort(403);
        }

        if ('livewire/update' == Route::current()->uri()) {
            return true;
        }

        $permission = Permission::find($user->permission_id);
        $page = Page::where('perm_max', '>=', $permission->value)
            ->where('perm_min', '<=', $permission->value)
            ->where('path', Route::current()->uri())
            ->first();

        if (!$page) {
            abort(403);
        }

        return true;
    }
}
