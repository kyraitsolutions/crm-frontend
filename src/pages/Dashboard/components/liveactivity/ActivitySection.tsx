import AlertCard from "../alertandnotification/AlertCard";
import PerformanceOverview from "../performance/PerformanceOverview";
import ActivityCard from "./LiveActivityCard";

const ActivitySection = () => {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-3">
      {/* Left */}
      <div className="last:lg:col-span-2 last:xl:col-span-1">
        <ActivityCard />
      </div>

      {/* Middle */}
      <div className="last:lg:col-span-2 last:xl:col-span-1">
        <PerformanceOverview />
      </div>

      {/* Right */}
      <div className="last:lg:col-span-2 last:xl:col-span-1">
        <AlertCard />
      </div>
    </section>
  );
};

export default ActivitySection;
