"use client";
import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReconnect } from "wagmi";

export function ConnectButton() {
  const ref = useRef(null);
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setOpen] = useState(false);
  const { reconnect } = useReconnect();

  useEffect(() => {
    reconnect();
  }, []);

  if (address) {
    return <button onClick={() => disconnect()}>Disconnect</button>;
  }
  return (
    <div>
      <button onClick={() => setOpen(true)}>Connect</button>

      <dialog ref={ref} open={isOpen} className="border p-4 space-y-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            className="block"
            onClick={() => (connect({ connector }), setOpen(false))}
          >
            {connector.name}
          </button>
        ))}
      </dialog>
    </div>
  );
}
