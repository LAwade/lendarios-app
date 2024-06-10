@extends('adminlte::page')

@section('title', 'Pedidos')

@section('content_header')
    <h1>Pedidos</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body table-responsive p-0" style="height: 100%">
                    <table class="table table-striped">
                        <thead>
                            <tr align="center">
                                <th>ID</th>
                                <th>Quantidade</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                                <th>Criado</th>
                                <th>Modificado</th>
                                <th colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($orders))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($orders as $order)
                                <tr align="center">
                                    <td>{{ $order->id }}</td>
                                    <td>{{ $order->qtd }}</td>
                                    <td>R$ {{ number_format($order->amount, 2, ',', '.') }}</td>
                                    <td>{{ $order->name }}</td>
                                    <td>{{ \Carbon\Carbon::parse($order->updated_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @if($order->status_id != 6)
                                            <a class="btn btn-success btn-sm" href="/store/checkout/{{$order->id}}">
                                                <i class="fa fa-credit-card" aria-hidden="true"></i> &nbsp; Pagamento
                                            </a>
                                        @endif
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
