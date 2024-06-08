<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $messages = [
            'name.required' => 'O :attribute não pode ser vazio.',
            'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
            ###
            'email.email' => 'Por favor, informe um email válido para o registro.',
            'email.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'email.max' => 'O :attribute não pode ter mais que :max caracteres.',
            ###
            'password.required' => 'O :attribute não pode ser vazio.',
            'password.min' => 'O :attribute não pode ter menos que :min caracteres.',
            'password.max' => 'O :attribute não pode ter mais que :max caracteres.',
            'password.confirmed' => 'A confirmação de senha não são iguais.',
        ];

        return Validator::make($data, [
            'name' => ['required', 'string', 'min:3', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6','max:20', 'confirmed'],
        ],$messages);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'permission_id' => 3,
            'password' => Hash::make($data['password']),
        ]);
    }
}
