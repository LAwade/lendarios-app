<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(){
        return view('pages.permission.index', [
            'permissions' => Permission::orderBy('value', 'desc')->get()
        ]);
    }
}
