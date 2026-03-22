import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, Edit } from 'lucide-react'; // Using Lucide for the icons



type PermissionRow = {
  actionName: string;
  permissions: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    export?: boolean;
    launch?: boolean;
    viewReport?: boolean;
  };
};

type PermissionSection = {
  title: string;
  columns: string[];
  rows: PermissionRow[];
};

const managerData: PermissionSection[] = [
  {
    title: "CONTACTS AND LISTS",
    columns: ["Create", "Edit", "Delete", "View", "Export"],
    rows: [
      { actionName: "Contacts", permissions: { create: true, edit: true, delete: true, view: true, export: true } },
      { actionName: "Mailing Lists", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
      { actionName: "Segments", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
      { actionName: "Tags", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
    ],
  },
  {
    title: "LEAD GENERATION",
    columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
    rows: [
      { actionName: "Signup Forms", permissions: { create: true, edit: true, delete: true, view: true, launch: true, viewReport: true } },
    ],
  },
  {
    title: "MARKETING CHANNELS",
    columns: ["Create", "Edit", "Delete", "View", "Export", "Launch", "View Report"],
    rows: [
      { actionName: "Regular and Advanced Campaigns", permissions: { create: true, edit: true, delete: true, view: true, export: true, launch: true, viewReport: true } },
      { actionName: "SMS", permissions: { create: true, edit: true, delete: true, view: true, export: false, launch: true, viewReport: true } },
      { actionName: "Workflows", permissions: { create: true, edit: true, delete: true, view: true, export: false, launch: true, viewReport: true } },
    ],
  },
];
const adminData: PermissionSection[] = [
  {
    title: "CONTACTS AND LISTS",
    columns: ["Create", "Edit", "Delete", "View", "Export"],
    rows: [
      { actionName: "Contacts", permissions: { create: true, edit: true, delete: true, view: true, export: true } },
      { actionName: "Mailing Lists", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
      { actionName: "Segments", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
      { actionName: "Tags", permissions: { create: true, edit: true, delete: true, view: true, export: false } },
    ],
  },
  {
    title: "LEAD GENERATION",
    columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
    rows: [
      { actionName: "Signup Forms", permissions: { create: true, edit: true, delete: true, view: true, launch: true, viewReport: true } },
    ],
  },
  {
    title: "MARKETING CHANNELS",
    columns: ["Create", "Edit", "Delete", "View", "Export", "Launch", "View Report"],
    rows: [
      { actionName: "Regular and Advanced Campaigns", permissions: { create: true, edit: true, delete: true, view: true, export: true, launch: true, viewReport: true } },
      { actionName: "SMS", permissions: { create: true, edit: true, delete: true, view: true, export: false, launch: true, viewReport: true } },
      { actionName: "Workflows", permissions: { create: true, edit: true, delete: true, view: true, export: false, launch: true, viewReport: true } },
    ],
  },
];
const editorData: PermissionSection[] = [
  {
    title: "CONTACTS AND LISTS",
    columns: ["Create", "Edit", "Delete", "View", "Export"],
    rows: [
      { actionName: "Contacts", permissions: { create: false, edit: true, delete: false, view: true, export: true } },
      { actionName: "Mailing Lists", permissions: { create: false, edit: true, delete: false, view: true, export: false } },
      { actionName: "Segments", permissions: { create: false, edit: true, delete: false, view: true, export: false } },
      { actionName: "Tags", permissions: { create: false, edit: true, delete: false, view: true, export: false } },
    ],
  },
  {
    title: "LEAD GENERATION",
    columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
    rows: [
      { actionName: "Signup Forms", permissions: { create: false, edit: true, delete: false, view: true, launch: false, viewReport: true } },
    ],
  },
  {
    title: "MARKETING CHANNELS",
    columns: ["Create", "Edit", "Delete", "View", "Export", "Launch", "View Report"],
    rows: [
      { actionName: "Regular and Advanced Campaigns", permissions: { create: false, edit: true, delete: false, view: true, export: false, launch: false, viewReport: true } },
      { actionName: "SMS", permissions: { create: false, edit: true, delete: false, view: true, export: false, launch: false, viewReport: true } },
      { actionName: "Workflows", permissions: { create: false, edit: true, delete: false, view: true, export: true, launch: false, viewReport: true } },
    ],
  },
];
const viewerData: PermissionSection[] = [
  {
    title: "CONTACTS AND LISTS",
    columns: ["Create", "Edit", "Delete", "View", "Export"],
    rows: [
      { actionName: "Contacts", permissions: { create: false, edit: false, delete: false, view: true, export: false } },
      { actionName: "Mailing Lists", permissions: { create: false, edit: false, delete: false, view: true, export: false } },
      { actionName: "Segments", permissions: { create: false, edit: false, delete: false, view: true, export: false } },
      { actionName: "Tags", permissions: { create: false, edit: false, delete: false, view: true, export: false } },
    ],
  },
  {
    title: "LEAD GENERATION",
    columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
    rows: [
      { actionName: "Signup Forms", permissions: { create: false, edit: false, delete: false, view: true, launch: false, viewReport: true } },
    ],
  },
  {
    title: "MARKETING CHANNELS",
    columns: ["Create", "Edit", "Delete", "View", "Export", "Launch", "View Report"],
    rows: [
      { actionName: "Regular and Advanced Campaigns", permissions: { create: false, edit: false, delete: false, view: true, export: false, launch: false, viewReport: true } },
      { actionName: "SMS", permissions: { create: false, edit: false, delete: false, view: true, export: false, launch: false, viewReport: true } },
      { actionName: "Workflows", permissions: { create: false, edit: false, delete: false, view: true, export: false, launch: false, viewReport: true } },
    ],
  },
];


const PermissionManager = ({ active, setActive, roles }: any) => {

  console.log("active", active);
  let permissionData: PermissionSection[] = [];
  switch (active) {
    case "admin":
      permissionData = adminData;
      break;

    case "manager":
      permissionData = managerData;
      break;
    case "editor":
      permissionData = editorData;
      break;

    case "viewer":
      permissionData = viewerData;
      break;

    default:
      permissionData = [];
      break;
  }
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-4 bg-white px-6 py-3 border-b border-slate-200">
        <div className='flex items-center gap-4'>
          <ArrowLeft onClick={() => setActive(null)} className="w-5 h-5 cursor-pointer hover:text-primary-600" />
          <h1 className="text-lg font-medium text-primary capitalize">{active}</h1>
        </div>
        {/* {active !== "admin" && active !== "manager" && <div>
          <Button className='rounded'><Edit />Edit</Button>
        </div>} */}
      </header>

      <main className="p-6 space-y-8">
        {permissionData?.map((section, idx) => (
          <div key={idx} className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            {/* Section Title */}
            <div className="bg-[#fcfdfe] px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
                {section.title}
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="px-4 py-3 text-sm font-bold text-slate-700 w-1/4">Action</th>
                    {section.columns.map((col) => (
                      <th key={col} className="px-4 py-3 table-fixed text-sm font-bold text-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {section.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-slate-600">
                        {row.actionName}
                      </td>
                      {section.columns.map((col) => {
                        // Logic to match column header to the specific permission key
                        const key = col.toLowerCase().replace(" ", "") as keyof typeof row.permissions;
                        const hasAccess = row.permissions[key];

                        return (
                          <td key={col} className="px-4 py-4">
                            {hasAccess === true ? (
                              <Check className="w-5 h-5 text-green-500 stroke-[2px]" />
                            ) : hasAccess === false ? (
                              <span className="text-slate-300">—</span>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PermissionManager;