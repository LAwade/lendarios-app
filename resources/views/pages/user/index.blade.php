@extends('adminlte::page')

@section('title', 'Usuários')

@section('content_header')
    <h1>Gerênciar Usuários</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Permissão</th>
                                <th>Email</th>
                                <th>Email Verificado</th>
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($users))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($users as $user)
                                <tr>
                                    <td>{{ $user->id }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->permission_name }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ \Carbon\Carbon::parse($user->email_verified_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @if ($user->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($user->updated_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>{{ \Carbon\Carbon::parse($user->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @livewire('user-modal', ['user' => $user], key($user->id))
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <x-message></x-message>
@stop