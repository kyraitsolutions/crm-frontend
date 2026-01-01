import { DataTable, type Column } from "@/components/common";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { DASHBOARD_PATH } from "@/constants";
import { ToastMessageService } from "@/services";
import { LeadFormService } from "@/services/leadform.service";
import { alertManager } from "@/stores/alert.store";
import { LeadsStoreManager, useLeadsStore } from "@/stores/leads.store";
import type { ILeadFormListItem } from "@/types/leadform.type";
// import   LeadFormListItem } from "@/types/leadform.type";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function LeadFormPage() {
  const { accountId } = useParams();
  // const navigate = useNavigate();
  const leadFormService = new LeadFormService();
  const leadStoreManager = new LeadsStoreManager();
  const { leadForms } = useLeadsStore((state) => state);
  const toastMessageService = new ToastMessageService();
  const [loading, setLoading] = useState(false);
  // const [forms, setLeadForms] = useState<[]>([]);

  const columns: Column<ILeadFormListItem>[] = [
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
      key: "status",
      header: "Status",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: () => (
        <div>
          <Switch
            checked={true}
            className="cursor-pointer"
          // onClick={(e) => handleUpdateStatus(e, row.id)}
          />
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
    {
      key: "lastActivity",
      header: "Last Activity",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <div className="font-medium capitalize text-gray-900">
            {moment(row.updatedAt).fromNow()}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteForm(row.id);
            }}
            className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];
  const getLeadFormList = async () => {
    try {
      setLoading(true);
      const response = await leadFormService.getLeadFromsList(
        String(accountId)
      );
      if (response?.status === 200) {
        leadStoreManager.setLeadForm(response?.data?.docs || []);
      }
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = (formId: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      onConfirm: () => {
        handleDeleteFormById(formId);
      },
    });
  };

  const handleDeleteFormById = async (formId: string) => {
    const rollback = leadStoreManager.deleteLeadFormOptimistic(formId);
    try {
      const response = await leadFormService.deleteFormById(
        String(accountId),
        formId
      );

      if (response.status === 200) {
        toastMessageService.success("Form deleted successfully");
        // getLeadFormList();
      }
    } catch (error) {
      toastMessageService.apiError(error as any);
      rollback();
    }
  };

  useEffect(() => {
    getLeadFormList();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Lead Form Directory
          </h1>
          <p className="text-muted-foreground">
            Manage deployment status, monitor engagement, and open detailed user
            insights.
          </p>
        </div>

        {leadForms.length > 0 && <div className="flex justify-end">
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
        }
      </div>


      {leadForms.length > 0 ? <div className="">
        <DataTable<ILeadFormListItem>
          data={leadForms}
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
      </div> :

        <div className="flex w-full justify-center items-center h-[75vh]">
          <div className="flex flex-col justify-center items-center max-w-xl w-full gap-6 p-10 text-center shadow-sm rounded-2xl border border-dashed">
            {/* Plus Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-semibold">No lead form found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first Lead form for your website or app.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to={`${DASHBOARD_PATH?.getAccountPath(
                String(accountId)
              )}/lead-forms/create`}
              className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Create First Lead Form
            </Link>
          </div>
        </div>
      }
    </div>
  );
}
