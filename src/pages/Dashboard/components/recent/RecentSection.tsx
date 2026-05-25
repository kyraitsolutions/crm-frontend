import RecentConversation from "./RecentConversation";
import RecentLeads from "./RecentLead";

const RecentSection = () => {
  return (
    <section className="grid md:grid-cols-2 gap-3">
      <RecentLeads />
      <RecentConversation />
    </section>
  );
};

export default RecentSection;
