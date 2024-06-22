"use client";
import { Button, ConnectButton, FundRound, RoundDetails } from "@allo/kit";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@allo/kit";

export default function ShareRoundPage({
  params: { roundId = "", chainId = "" },
}) {
  return (
    <div className="max-w-screen-md mx-auto">
      <header className="p-2 flex justify-between">
        <div></div>
        <ConnectButton />
      </header>
      <RoundDetails id={roundId} opts={{ chainId }} />
      <div className="flex justify-center">
        <Drawer>
          <DrawerTrigger>
            <Button>Fund Round</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerFooter>
              <FundRound id={roundId} opts={{ chainId }} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
