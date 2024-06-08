@extends('adminlte::page')

@section('title', 'Menus')

@section('content_header')
    <h1>Menus do Sistema</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"></h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm float-right">
                            @livewire('menu-modal')
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Icone</th>
                                <th>Posição</th>
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($menus))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($menus as $menu)
                                <tr>
                                    <td>{{ $menu->id }}</td>
                                    <td>{{ $menu->name }}</td>
                                    <td>{{ $menu->icon }}</td>
                                    <td>{{ $menu->position }}</td>
                                    <td>
                                        @if ($menu->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($menu->updated_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>{{ \Carbon\Carbon::parse($menu->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @livewire('menu-modal', ['menu' => $menu], key($menu->id))
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
