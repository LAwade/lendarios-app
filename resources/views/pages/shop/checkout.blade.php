@extends('adminlte::page')

@section('title', 'Checkout')

@section('content_header')
    <h1>Checkout</h1>
@stop

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Informações do(s) Produto(s)</h3>
        </div>
        <div class="card-body ">
            <div class="row">
                @livewire('checkout', ['order_id' => $order_id])
            </div>
        </div>
    </div>
@stop
