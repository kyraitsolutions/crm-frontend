import ConfigurationContent from "./components/tabs/ConfigurationContent";
import ConfigurationTabs from "./components/tabs/ConfigurationTabs";

const ConfigurationPage = () => {
  return (
    <div>
      {/* <ConfigurationHeader /> */}

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <div className="max-w-56 w-full border-r p-4">
          <ConfigurationTabs />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4">
          <ConfigurationContent />
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
