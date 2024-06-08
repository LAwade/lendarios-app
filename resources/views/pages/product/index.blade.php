@extends('adminlte::page')

@section('title', 'Produtos')

@section('content_header')
    <h1>Produtos</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"></h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm float-right">
                            @livewire('product-modal')
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Unidade</th>
                                <th>Valor</th>
                                <th>Descrição</th>
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($products))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($products as $product)
                                <tr>
                                    <td>{{ $product->id }}</td>
                                    <td>{{ $product->name }}</td>
                                    <td>{{ $product->category_name }}</td>
                                    <td>{{ $product->price }}</td>
                                    <td>{{ $product->unity }}</td>
                                    <td>R$ {{ number_format($product->price * $product->unity, 2, ',', '.') }}</td>
                                    <td>{{ $product->description }}</td>
                                    <td>
                                        @if ($product->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($product->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @livewire('product-modal', ['product' => $product], key($product->id))
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
