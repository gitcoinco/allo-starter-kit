"use client";
import {
  ApplicationDetails,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
  useRoundById,
} from "@allo-team/kit";

export default function ApplicationPage({
  params: { chainId = 0, applicationId = "", roundId = "" },
}) {
  const round = useRoundById(roundId, { chainId });
  return (
    <section className="space-y-8">
      <ApplicationDetails
        id={applicationId}
        chainId={chainId}
        roundId={roundId}
        action={
          <div>
            <Dialog>
              <DialogTrigger>
                <Button>Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Application</DialogTitle>
                  <DialogDescription>
                    TODO: The UX of opening a dialog hides the Application
                    description. Ideally we want to be able to read the
                    application and write the review simultaneously.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <h3 className="font-semibold">Round eligibility criteria</h3>
                  <ul className="list-decimal space-y-4 list-outside pl-4 text-sm">
                    {round.data?.eligibility.requirements?.map((req) => (
                      <li>{req.requirement}</li>
                    ))}
                  </ul>
                </div>
                <div className="">
                  <Textarea rows={10} placeholder="Write your review..." />
                </div>
                <div className="flex justify-end gap-4 items-center">
                  <Button variant="outline">
                    Automatic review with Checker
                  </Button>
                  <span>or</span>
                  <Button>Submit Review</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
    </section>
  );
}
