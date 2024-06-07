"use client";
import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReconnect } from "wagmi";
import { Button } from "./ui/button";

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
    return <Button onClick={() => disconnect()}>Disconnect</Button>;
  }
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Connect</Button>

      <dialog ref={ref} open={isOpen} className="space-y-2 border p-4">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            className="block"
            onClick={() => (connect({ connector }), setOpen(false))}
          >
            {connector.name}
          </Button>
        ))}
      </dialog>
    </div>
  );
}
