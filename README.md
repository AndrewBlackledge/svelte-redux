# svelte-redux
Svelte enhancer to connect to a redux store.

Install the svelte enhancer with

```sh
bun install @ourway/svelte-redux
```

then use the following `store.ts` to enhance your reducer.  This example
uses a reducer called counter (see below).

`${lib}/store.ts`

```ts
import { configureSvelteStore } from "@ourway/svelte-redux";
import type { Writable } from "svelte/store";
import { counter } from "./counter";

const reducer = {
  counter,
};

const reduxStore = configureSvelteStore(reducer);

type ReduxStore = typeof reduxStore;
type GlobalState = ReturnType<typeof reduxStore.getState>;
type SvelteStore = Writable<GlobalState>;

export const store = reduxStore as ReduxStore & SvelteStore;
```

`${lib}/counter.ts`

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

export interface CounterState {
  value: number;
}

export const increment = createAction("increment");
export const decrement = createAction("decrement");

export const initialState: CounterState = {
  value: 0,
};

export const counter = createReducer(initialState, (r) => {
  r.addCase(increment, (state, action) => {
    state.value++;
  });
  r.addCase(decrement, (state, action) => {
    state.value = Math.max(state.value - 1, 0);
  });
});
```

From svelte code, use $store to access the redux store.

`${src}/routes/+page.svelte`

```ts
<script lang="ts">
    import { decrement, increment } from "$lib/counter";
    import { store } from "$lib/store";

    function inc() {
        store.dispatch(increment())
    }
    function dec() {
        store.dispatch(decrement())
    }

    function processValue() {
        console.log($store.counter.value, printoutCounter);
    }

    let printoutCounter = 0;

    $: if($store.counter.value > 5) {
        processValue();
    }
</script>

<h1>Redux Store Example</h1>

<p>
<button on:click={inc}>+</button>
<button on:click={dec}>-</button>
Counter: {$store.counter.value}
</p>

<p>
<button on:click={() => printoutCounter++}>+</button>
<button on:click={() => printoutCounter--}>-</button>
2ndCounter: {printoutCounter}
</p>
```

