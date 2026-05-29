const ConfigurationHeader = () => {
  return (
    <div className="flex h-[72px] items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-[24px] font-semibold text-[#111827]">
          Configuration
        </h1>

        <p className="mt-1 text-sm text-[#6B7280]">
          Manage CRM statuses and workflows
        </p>
      </div>

      <button className="rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-medium text-white transition-all hover:opacity-90">
        Save Changes
      </button>
    </div>
  );
};

export default ConfigurationHeader;
