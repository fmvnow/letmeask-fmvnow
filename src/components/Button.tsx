import { useState } from "react";

type ButtonProps = {
  children?: string;
}
export function Button(props: ButtonProps) {
  const [counter, setCounter] = useState(0);

  function increment() {
    setCounter(counter + 1);
    console.log('counter: ', counter)
  }

  return (
    <button onClick={increment}>{counter}</button>
  )
}
