"use client";
import { ApplicationReviewTable } from "@allo/kit";
import { BackButton, RoundDetails } from "@allo/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  console.log({ roundId, chainId });
  return (
    <section className="space-y-8">
      <RoundDetails
        id={roundId}
        opts={{ chainId }}
        backAction={
          <Link href={`/admin/rounds`}>
            <BackButton />
          </Link>
        }
      />

      <ApplicationReviewTable
        roundId={roundId}
        chainId={chainId}
        tabs={[
          {
            key: "APPROVED",
            label: "Approved",
          },
          {
            key: "PENDING",
            label: "Pending",
          },
          {
            key: "REJECTED",
            label: "Rejected",
          },
        ]}
        renderItem={({ status }) => (
          <ApplicationItem
            action={(() => {
              switch (status) {
                case "APPROVED":
                  return null;
              }
            })()}
          />
        )}
      />
    </section>
  );
}

function ApplicationItem() {
  return null;
}
