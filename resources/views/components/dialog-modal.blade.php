@props(['id' => null, 'maxWidth' => null])

<x-modal :id="$id" :maxWidth="$maxWidth" {{ $attributes }}>
    <div class="py-2">
        <div>
            {{ $title }}
        </div>

        <div>
            {{ $content }}
        </div>

        <div>
            {{ $footer }}
        </div>
    </div>
</x-modal>
