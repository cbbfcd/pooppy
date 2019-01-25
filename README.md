# poppy

> A state management portfolio for personal use only

⚠️:

> need 16.8.0-alpha.1 for react and react-dom, then use hooks happy!

This is a project that is a combination of some on-site projects or ideas in the issue. 

The main purpose is to make it easier for me to use in the project without introducing multiple libraries. 

Of course, I will gradually combine these excellent libraries to do some interesting combinations.

## how to use

> name is poopy!!!

```js
yarn add pooppy
```

> let's do it

only use createContainer:

```jsx
import { createContainer } from "pooppy";

function useCounter() {
  const [count, updater] = React.useState(0);
  const increment = (dep = 1) => {
    updater(count + 1);
  };

  const decrement = (dep = 1) => {
    updater(count - 1);
  };

  const asyncIncrement = (dep = 1) => {
    setTimeout(() => {
      updater(count + 1);
    }, 2000);
  };

  return React.useMemo(
    () => ({
      count,
      increment,
      decrement,
      asyncIncrement
    }),
    [count]
  );
}

const { Provider, Context } = createContainer(useCounter);

function Count() {
  const { count } = React.useContext(Context);
  return <span>{count}</span>;
}

function Button() {
  const { increment, decrement, asyncIncrement } = React.useContext(Context);
  return (
    <div>
      <button onClick={increment}> + </button>
      <button onClick={decrement}> - </button>
      <button onClick={asyncIncrement}> async + </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Provider>
        <Count />
        <Button />
      </Provider>
    </div>
  );
}
```

[demo01](https://codesandbox.io/s/yw98wxmozx)

use immer and nest:

```jsx
import { useImmer, nest, createContainer } from "pooppy";

let uuid = () =>
  Math.random()
    .toString(16)
    .slice(3);

function todoContainer() {
  const [todos, updater] = useImmer([
    {
      msg: "this is a default todos",
      key: "default",
      finish: false
    }
  ]);

  const addTodos = msg => {
    updater(draft => {
      draft.push({
        msg,
        key: uuid(),
        finish: false
      });
    });
  };

  const deleteTodos = uuid => {
    updater(draft => {
      const index = draft.findIndex(item => item.key === uuid);
      if (index >= 0) draft.splice(index, 1);
    });
  };

  const finished = uuid => {
    updater(draft => {
      draft.forEach(todo => {
        if (todo.key === uuid && todo.finish === false) {
          todo.finish = true;
        }
      });
    });
  };

  return React.useMemo(
    () => ({
      todos,
      addTodos,
      deleteTodos,
      finished
    }),
    [todos]
  );
}

const { Provider, Context } = createContainer(todoContainer);

function ToDos() {
  const { todos } = React.useContext(Context);
  return (
    <ul>
      {todos.map(todo => {
        return (
          <li key={todo.key}>
            <span>
              {todo.msg} | {todo.finish ? "done" : "undone"}
            </span>
            <Button uuid={todo.key} />
          </li>
        );
      })}
    </ul>
  );
}

function AddTodo() {
  const { addTodos } = React.useContext(Context);
  const [msg, setMsg] = React.useState("");
  const handleOnchange = e => {
    setMsg(e.target.value);
  };
  return (
    <>
      <input onChange={handleOnchange} value={msg} />
      <button onClick={() => addTodos(msg)}>add</button>
    </>
  );
}

function Button(props) {
  const { deleteTodos, finished } = React.useContext(Context);
  return (
    <>
      <button onClick={() => deleteTodos(props.uuid)}> delete </button>
      <button onClick={() => finished(props.uuid)}> finish </button>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Provider>
        <ToDos />
        <AddTodo />
      </Provider>
    </div>
  );
}
```

[demo02](https://codesandbox.io/s/32vz8mnkq6)

about nest

```jsx
// just like this
const { Provider } = createContainer(someCounter)

const NestComponent = nest(Provider, SomeChildUnStateComponent)
```

## Reference

[1. nest](https://github.com/diegohaz/constate/issues/61#issuecomment-447558713)</br>
[2. immer](https://github.com/mweststrate/immer)</br>
[3. constate](https://github.com/diegohaz/constate)</br>
[4. use-immer](https://github.com/mweststrate/use-immer/blob/master/index.js)</br>