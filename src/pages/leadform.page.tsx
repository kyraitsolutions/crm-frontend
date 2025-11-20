import { DataTable, type Column } from "@/components/common";
import { ToastMessageService } from "@/services";
import type { ChatBotListItem } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { DASHBOARD_PATH, WEBSOCKET_EVENTS, WEBSOCKET_URL } from "@/constants";
import { Plus } from "lucide-react";
import { LeadFormService } from "@/services/leadform.service";
import type { LeadFormListItem, TLead } from "@/types/leadform.type";
import WebSocketClient from "@/config/websocketClient";

export function LeadFormPage() {
  const wsRef = useRef<WebSocketClient | null>(null);
  const { accountId } = useParams();
  const navigate = useNavigate();
  const leadFormService = new LeadFormService();
  const toastMessageService = new ToastMessageService();
  const [loading, setLoading] = useState(false);
  const [forms, setLeadForms] = useState<[]>([]);
  const [leads, setLeads] = useState<TLead[] | []>([]);

  // const columns: Column<LeadFormListItem>[] = [
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
  //   {
  //     key: "name",
  //     header: "Form Title",
  //     className: "min-w-[200px]",

  //     render: (row) => (
  //       <div>
  //         <div className="font-medium text-gray-900">{row.formTitle}</div>
  //         <div className="text-sm text-gray-500">{row.formDescription}</div>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "createdDisplay",
  //     header: "Created",
  //     cellClassName: "whitespace-nowrap text-gray-700",
  //     render: (row) => (
  //       <div>
  //         <div className="font-medium text-gray-900">
  //           {moment(row.createdAt).format("DD-MM-YYYY")}
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];

  const columns: Column<TLead>[] = [
    {
      key: "name",
      header: "Name",
      className: "min-w-[200px]",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      className: "min-w-[200px]",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.email}</div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      className: "min-w-[200px]",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.phone}</div>
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

  const setLeadsList = async (lead: TLead) => {
    console.log(leads);
    try {
      const isLeadExist = leads.find((l: TLead) => l._id === lead._id);

      if (!isLeadExist) {
        setLeads((prevLeads) => [...prevLeads, lead]);
      } else {
        setLeads((prevLeads) =>
          prevLeads.map((l: TLead) => {
            if (l._id === lead._id) {
              return lead;
            }
            return l;
          })
        );
      }
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeadFormList();
  }, []);

  // Connect to websocket
  useEffect(() => {
    wsRef.current = new WebSocketClient(
      `${WEBSOCKET_URL}?accountId=${accountId}`
    );

    wsRef.current.connect((serverResponse) => {
      if (serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Created"]) {
        if (serverResponse.data?.lead?.accountId !== accountId) return;
        setLeads((prevLeads) => [...prevLeads, serverResponse.data?.lead]);
      } else if (
        serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Updated"]
      ) {
        if (serverResponse.data?.lead?.accountId !== accountId) return;
        setLeadsList(serverResponse.data?.lead);
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, [leads]);

  console.log(leads);

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
        {/* <DataTable<LeadFormListItem>
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
        /> */}

        <DataTable data={leads} columns={columns} />
      </div>
    </div>
  );
}
