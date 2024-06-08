@extends('adminlte::page')

@section('title', 'Categorias')

@section('content_header')
    <h1>Categoria dos Produtos</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"></h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm float-right">
                            @livewire('category-modal')
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($categories))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($categories as $category)
                                <tr>
                                    <td>{{ $category->id }}</td>
                                    <td>{{ $category->name }}</td>
                                    <td>{{ $category->description }}</td>
                                    <td>
                                        @if ($category->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($category->updated_at)->format('d/m/Y H:i:s') ?? '-' }}
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($category->created_at)->format('d/m/Y H:i:s') ?? '-' }}
                                    </td>
                                    <td>
                                        @livewire('category-modal', ['category' => $category], key($category->id))
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
