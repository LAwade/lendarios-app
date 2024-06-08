<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index(){
        return view('pages.page.index', [
            'pages' => Page::join('menus', 'menus.id', '=', 'pages.menu_id')
            ->selectRaw('pages.*, menus.name as menu_name')
            ->orderBy('menu_id')->get()
        ]);
    }
}
