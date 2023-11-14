## Redux data flow diagram

![data flow diagram](./images/ReduxDataFlowDiagram.gif)
Copy from: <https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow>

## Best practice

- **A standard Redux application should only have a single Redux store instance, which will be used by the whole application**.
- **Do Not Put Non-Serializable Values in State or Actions：Avoid putting non-serializable values such as Promises, Symbols, Maps/Sets, functions, or class instances into the Redux store state or dispatched actions**.
- **Reducers Must Not Have Side Effects：They must not execute any kind of asynchronous logic (AJAX calls, timeouts, promises), generate random values (`Date.now()`, `Math.random()`), modify variables outside the reducer, or run other code that affects things outside the scope of the reducer function**.
- **Do Not Mutate State：**
[Example](https://medium.com/@kkranthi438/dont-mutate-state-in-react-6b25d5e06f42)<br>
Remember not to directly change state, always use `setState()` function, because React will use `===` to detect change. And some mutable instances will not be detected since their memory address are same after mutating.

## RTK Query

[document Link](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#rtk-query-overview)
![](./images/ReduxAsyncDataFlowDiagram.gif)
