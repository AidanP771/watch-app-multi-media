import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CounterButton from "./components/CounterButton";
import Navbar from "./components/NavBar";

function App() {
  return (
    <div>
      <Navbar />
      <h1>This is a test</h1>
      <CounterButton />
    </div>
  );
}

export default App;
