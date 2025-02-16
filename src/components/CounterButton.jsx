import React, { useState } from "react";

const CounterButton = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click Me!</button>
      <p>Count: {count}</p>
    </div>
  );
};

export default CounterButton;
