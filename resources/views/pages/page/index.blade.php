@extends('adminlte::page')

@section('title', 'Páginas')

@section('content_header')
    <h1>Páginas do Sistema</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"></h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm float-right">
                            @livewire('page-modal')
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Caminho</th>
                                <th>Menu</th>
                                <th>Permissão Mínima</th>
                                <th>Permissão Máxima</th>
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($pages))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($pages as $page)
                                <tr>
                                    <td>{{ $page->id }}</td>
                                    <td>{{ $page->name }}</td>
                                    <td>{{ $page->path }}</td>
                                    <td>{{ $page->menu_name }}</td>
                                    <td>{{ $page->perm_min }}</td>
                                    <td>{{ $page->perm_max }}</td>
                                    <td>
                                        @if ($page->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($page->updated_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>{{ \Carbon\Carbon::parse($page->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @livewire('page-modal', ['page' => $page], key($page->id))
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
