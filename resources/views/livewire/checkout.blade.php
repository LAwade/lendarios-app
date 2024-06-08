<div class="col-12 col-md-12 col-lg-4 order-1 order-md-2">
    <h5 class="my-1"><b>Código da Ordem #{{ $order_id }}</b></h5>
    <ul class="list-group mb-3">
        @foreach ($itens as $item)
            @php
                $amount += $item->price * $item->unity * $item->quantity;
            @endphp
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                    <h6 class="my-0">{{ $item->name }}</h6>
                    <small class="text-muted">Descrição: --</small>
                    <small class="text-muted">Quantidade: {{ $item->quantity }}</small>
                </div>
                <span class="text-muted">R$
                    {{ number_format($item->price * $item->unity * $item->quantity, 2, ',', '.') }}
                </span>
            </li>
        @endforeach

        @if ($code)
            <li class="list-group-item d-flex justify-content-between bg-light">
                <div class="text-success">
                    <h6 class="my-0">CUPOM DESCONTO</h6>
                    <small>{{ $code }}</small>
                </div>
                <span class="text-success">−$5</span>
            </li>
        @endif

        <li class="list-group-item d-flex justify-content-between">
            <span>Total (BRL)</span>
            <strong>R$ {{ $amount }}</strong>
        </li>
    </ul>
    <div class="input-group input-group-sm">
        <input type="text" class="form-control" placeholder="Código/Cupom" wire:model="code">
        <span class="input-group-append">
            <a class="btn btn-info btn-flat" wire:click="verifycode()">Aplicar</a>
        </span>
    </div>

    <div class="mt-5 mb-3">
        <a href="#" class="btn btn-lg btn-success">Realizar Pagamento (PIX)</a>
    </div>
</div>
