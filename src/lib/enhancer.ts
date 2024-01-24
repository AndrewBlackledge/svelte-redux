import { type ReducersMapObject, configureStore } from "@reduxjs/toolkit";

function svelteStoreEnhancer(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  createStoreApi: (arg0: any, arg1: any) => any,
) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function (reducer: any, initialState: any) {
    const reduxStore = createStoreApi(reducer, initialState);
    return {
      ...reduxStore,
      subscribe(fn: (arg0: ReturnType<typeof reduxStore.getState>) => void) {
        fn(reduxStore.getState());

        return reduxStore.subscribe(() => {
          fn(reduxStore.getState());
        });
      },
    };
  };
}

export function configureSvelteStore<S>(reducer: ReducersMapObject<S>) {
  return configureStore({
    reducer,
    enhancers: [svelteStoreEnhancer],
    devTools: { maxAge: 100000 },
  });
}
