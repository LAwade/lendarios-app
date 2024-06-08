<div>
    <button wire:click="openModal" class="w-100 btn btn-sm btn-info mb-2" data-toggle="modal" data-target="#modalCart">
        <i class="fa fa-shopping-bag"></i> Detalhes
    </button>

    <x-dialog-modal wire:model="show" id="modalCart">
        <x-slot name="title">
            <div class="modal-header">
                <h4 class="modal-title">Meu Carrinho de Compras</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" wire:click="closeModal">×</span>
                </button>
            </div>
        </x-slot>
        <x-slot name="content">
            <div class="modal-body">
                @if (empty($products))
                    <h5>Nenhum item na sua lista de compras</h5>
                @else
                    <div class="card-body table-responsive p-0" style="height: 550px;">
                        <table class="table table-head-fixed text-nowrap">
                            <thead>
                                <tr align="center">
                                    <th style="width: 20%">
                                        Produto
                                    </th>
                                    <th style="width: 30%">
                                        Quantidade
                                    </th>
                                    <th>
                                        Valor Parcial
                                    </th>
                                    <th style="width: 20%">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($products as $product)
                                    @php
                                        $amount += $product->price * $product->unity * $product->quantidade;
                                    @endphp
                                    <tr align="center">
                                        <td>{{ $product->name }}</td>
                                        <td>
                                            {{ $product->quantidade }}
                                        </td>
                                        <th>
                                            R$
                                            {{ number_format($product->price * $product->unity * $product->quantidade, 2, ',', '.') }}
                                        </th>
                                        <td class="project-actions text-right">
                                            <a class="btn btn-danger btn-sm" wire:click="delete({{ $product->id }})">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                        <hr />
                        <h5>Valor Total: R$ {{ number_format($amount, 2, ',', '.') }}</h5>
                    </div>
                @endif
            </div>
        </x-slot>
        <x-slot name="footer">
            <div class="modal-footer">
                <button type="button" class="btn btn-default" wire:click="closeModal"
                    data-dismiss="modal">Fechar</button>
            </div>
        </x-slot>
    </x-dialog-modal>
</div>
