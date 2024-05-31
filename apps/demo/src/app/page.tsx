"use client";
import { DiscoverRounds } from "@allo/ui";
import Link from "next/link";

export default function Home() {
  return (
    <DiscoverRounds
      /*
    DiscoverRounds is a pre-made component that does most of the heavy lifting
    in fething and displaying rounds.
    
    It fetches the rounds based on a provided query (with sane defaults) and
    renders it (as a grid by default but easy to customize with own components).
    */
      query={{
        /* 
      The query prop enables a powerful way to fetch data from the indexer. 
      
      For example:
      - only rounds with these strategies (deployed contract address)
      - order by when they were created, newest first
      - with skip and take we can paginate the results and decide how many to show
      */

        where: {
          chainId: { in: [10] },
          // tags: { contains: ["allo-v2"] },
          // donationsEndTime: { gte: new Date().toISOString() },
        },
        orderBy: { unique_donors_count: "desc" },
        skip: 0,
        take: 12,
      }}
      /*
      The renderItem function lets us change what component is rendered.
      
      For example:
        - Wrap the default RoundItem component in a link 

      */
      renderItem={(round, Component) => (
        <Link href={`/${round.chainId}/rounds/${round.id}`} key={round.id}>
          <Component {...round} />
        </Link>
      )}
      /*
        Columns let us choose how to render the rounds.

        For example:
          - 1 column on phones
          - 2 columns on small to medium
          - 3 columns on medium to large
          - 4 columns on large and above
        
        We could also set it to [1] to render as list on all screens
      */
      columns={[1, 2, 3]}
    />
  );
}
