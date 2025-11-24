import { DataTable, type Column } from "@/components/common";
import { DASHBOARD_PATH } from "@/constants";
import { ToastMessageService } from "@/services";
import { LeadFormService } from "@/services/leadform.service";
import type { LeadFormListItem } from "@/types/leadform.type";
import { Plus } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function LeadFormPage() {
  const { accountId } = useParams();
  // const navigate = useNavigate();
  const leadFormService = new LeadFormService();
  const toastMessageService = new ToastMessageService();
  const [loading, setLoading] = useState(false);
  const [forms, setLeadForms] = useState<[]>([]);

  const columns: Column<LeadFormListItem>[] = [
    //   // {
    //   //   key: "id",
    //   //   header: "Id",
    //   //   className: "min-w-[200px]",
    //   //   render: (row) => (
    //   //     <div>
    //   //       <div className="font-medium text-gray-900">{row.id}</div>
    //   //     </div>
    //   //   ),
    //   // },
    {
      key: "name",
      header: "Form Title",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.formTitle}</div>
          <div className="text-sm text-gray-500">{row.formDescription}</div>
        </div>
      ),
    },
    {
      key: "createdDisplay",
      header: "Created",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {moment(row.createdAt).format("DD-MM-YYYY")}
          </div>
        </div>
      ),
    },
  ];
  const getLeadFormList = async () => {
    try {
      setLoading(true);
      const res: any = await leadFormService.getLeadFromsList(
        String(accountId)
      );
      setLeadForms(res.data.docs);
      console.log(res.data.docs);
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeadFormList();
  }, []);


  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Lead Form Directory
        </h1>
        <p className="text-muted-foreground">
          Manage deployment status, monitor engagement, and open detailed user
          insights.
        </p>
      </div>

      <div className="flex justify-end">
        {/* create button and redicrect on the /builder/:id */}
        <Link
          to={`${DASHBOARD_PATH?.getAccountPath(
            String(accountId)
          )}/lead-forms/create`}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <Plus size={18} />
          Create Form
        </Link>
      </div>

      <div className="grid grid-cols-[2fr_1fr]">
        <DataTable<LeadFormListItem>
          data={forms}
          columns={columns}
          pageSize={20}
          //   onRowClick={(row) => {
          //     console.log(row);
          //     navigate(
          //       `${DASHBOARD_PATH?.getAccountPath(String(accountId))}/form/${
          //         row.id
          //       }/builder`
          //     );
          //   }}
          // navigate(
          //   `/dashboard/account/690c79520e764af69f4302ed/chatbot/create`
          // )

          sortable={true}
          paginated={true}
          tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
          loading={loading}
        />

      </div>
    </div>
  );
}
