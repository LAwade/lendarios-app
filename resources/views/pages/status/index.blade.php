@extends('adminlte::page')

@section('title', 'Status')

@section('content_header')
    <h1>Status</h1>
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
                                <th>Ativo</th>
                                <th>Atualizado</th>
                                <th>Criado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!count($status))
                                <tr align="center">
                                    <td colspan="20">Nenhum resultado foi encontrado!</td>
                                </tr>
                            @endif
                            @foreach ($status as $st)
                                <tr>
                                    <td>{{ $st->id }}</td>
                                    <td>{{ $st->name }}</td>
                                    <td>
                                        @if ($st->is_active)
                                            <span class="badge badge-success">Ativo</span>
                                        @else
                                            <span class="badge badge-danger">Inativo</span>
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($st->updated_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>{{ \Carbon\Carbon::parse($st->created_at)->format('d/m/Y H:i:s') ?? '-' }}</td>
                                    <td>
                                        @livewire('status-modal', ['status' => $st], key($st->id))
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
