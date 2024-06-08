<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view(
            'pages.status.index',
            [
                'status' => Status::orderBy('name')->get()
            ]
        );
    }
}
