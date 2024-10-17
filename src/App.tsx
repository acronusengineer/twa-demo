import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "./hooks/useCounterContract";

function App() {
  const { value, address } = useCounterContract();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Counter Address</h1>
      <div className="card">
        <b>Counter Address</b>
        <p>{address?.slice(0, 30) + "..."}</p>
      </div>
      <div className="card">
        <b>Counter Value</b>
        <p>{value ?? "Loading..."}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <TonConnectButton />
    </div>
  );
}

export default App;
