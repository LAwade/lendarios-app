<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function registrar()
    {
        return view('pages.user.registrar');
    }

    public function autenticar()
    {
        return view('pages.user.autenticar');
    }

    public function store(Request $request)
    {
        $messages = [
            'name.required' => 'O :attribute não pode ser vazio.',
            'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
            ###
            'email.required' => 'O :attribute não pode ser vazio.',
            'email.email' => 'Por favor, informe um email válido para o registro.',
            'email.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'email.max' => 'O :attribute não pode ter mais que :max caracteres.',
            ###
            'password.required' => 'O :attribute não pode ser vazio.',
            'password.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'password.max' => 'O :attribute não pode ter mais que :max caracteres.',
            'password.confirmed' => 'A confirmação de senha não são iguais.',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:50',
            'email' => 'required|string|email|min:6|max:100|unique:users',
            'password' => 'required|string|min:6|max:20|confirmed',
        ], $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'permission_id' => 3,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['success' => true, 'message' => 'Usuário registrado com sucesso!', 'data' => $user,], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Não foi possível registrar o usuário!',
                'data' => $e->getMessage()
            ], 400);
        }
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Por favor, informe o :attribute!',
            'email.email' => 'Preencha corretamente o :attribute formato inválido!',
            'password.required' => 'Por favor, informe a :attribute!',
        ]);

        if (Auth::attempt($request->only(['email', 'password']))) {
            $user = Auth::user();
            return response()->json(['success' => true, 'message' => "Seja bem-vindo ao sistema {$user->name}!"], 201);
        }

        return response()->json(['success' => false, 'message' => 'Não foi possível autenticar o usuário!'], 403);
    }
}
