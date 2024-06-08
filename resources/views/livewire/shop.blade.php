<div>
    <hr />
    <div class="mb-3">
        <div class="row">
            <div class="col">
                <h5>Categorias:</h5>
                <select class="custom-select custom-select-lg col-md-4" aria-label=".form-select-lg example">
                    @foreach ($categories as $category)
                        <option wire:click="showCategory({{ $category->id }})" value="{{ $category->id }}">
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col">
                <div class="col-md-4 col-sm-6 col-12 float-right">
                    <div class="info-box">
                        <div class="info-box-content">
                            <span class="info-box-text">Meu Carrinho</span>
                            <h5><b>{{ count($cart) }}</b> iten(s) adicionado(s)</h5>
                            <div class="row align-items-start">
                                <div class="col">
                                    @livewire('cart-modal', ['cart' => $cart])
                                </div>
                                @if (count($cart))
                                    <div class="col">
                                        <button class="w-100 btn btn-sm btn-success mb-2" wire:click="confirm()">
                                            <i class="fa fa-check-circle"></i> Finalizar
                                        </button>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />

    <div class="row row-cols-1 row-cols-md-4 mb-4 text-center">
        @foreach ($products as $product)
            <div class="col">
                <div class="card mb-4 rounded-3 shadow-sm">
                    <div class="card-header py-3">
                        <h4 class="my-0 fw-normal">{{ $product->name }}</h4>
                    </div>
                    <div class="card-body">
                        <h1>
                            R$ {{ number_format($product->price * $product->unity, 2, ',', '.') }}
                            <small class="text-muted fw-light">/mês</small>
                        </h1>
                        <button type="button" wire:click="addCart({{ $product->id }})"
                            class="w-100 btn btn-lg btn-primary mb-2">Contratar</button>
                        <hr>
                        @php
                            $descriptions = explode(';', $product->description);
                        @endphp
                        <p>
                            <strong>Especificações:</strong>
                        </p>
                        @foreach ($descriptions as $key => $description)
                            @if ($key < 6)
                                <p>- {{ $description }}</p>
                            @endif
                        @endforeach

                        @if (count($descriptions) > 6)
                            <div class="collapse multi-collapse" id="multiCollapse{{ $product->id }}">
                                @foreach ($descriptions as $key => $description)
                                    @if ($key > 6)
                                        <p>- {{ $description }}</p>
                                    @endif
                                @endforeach
                            </div>
                            @livewire('collapse-component', ['id' => $product->id], key($product->id))
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
