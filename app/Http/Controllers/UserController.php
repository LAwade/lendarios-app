<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{

    public function index()
    {
        return view('pages.user.index', [
            'users' => User::join('permissions', 'permissions.id', '=', 'users.permission_id')
                ->selectRaw('users.*, permissions.name as permission_name')
                ->orderBy('id')->get()
        ]);
    }
}
