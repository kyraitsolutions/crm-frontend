import DataRow from "./DataRow";

const OrganizationInfo = ({ user }: any) => {
  return (
    <section className="bg-white rounded border mt-6">
      <div className="px-6 py-4 border-b">
        <h2>Manage Organization</h2>
      </div>

      <div className="p-6">
        <DataRow label="Organization ID" value={user?.organization?.id} />
      </div>
    </section>
  );
};

export default OrganizationInfo;
