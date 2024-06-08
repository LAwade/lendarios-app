@extends('adminlte::page')

@section('title', 'Permissão')

@section('content_header')
    <h1>Permissões</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"></h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm float-right">
                            @livewire('permission-modal')
                        </div>
                    </div>
                </div>
                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Valor</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($permissions))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($permissions as $permission)
                                <tr>
                                    <td>{{ $permission->id }}</td>
                                    <td>{{ $permission->name }}</td>
                                    <td>{{ $permission->value }}</td>
                                    <td>{{ \Carbon\Carbon::parse($permission->updated_at)->format('d/m/Y H:i:s') ?? '-' }}
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($permission->created_at)->format('d/m/Y H:i:s') ?? '-' }}
                                    </td>
                                    <td>
                                        @livewire('permission-modal', ['permission' => $permission], key($permission->id))
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
