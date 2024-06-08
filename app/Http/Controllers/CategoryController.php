<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view(
            'pages.category.index',
            [
                'categories' => Category::all()
            ]
        );
    }
}
