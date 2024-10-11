import { OverviewPageTitle, PendingReviewList, ReadyToSubmitList } from "./components";

export const OverviewPage = () => {
  // we will have some logic to fetch
  return (
    <div className="flex flex-col gap-8">
      <OverviewPageTitle />
      <ReadyToSubmitList />
      <PendingReviewList />
    </div>
  );
};
