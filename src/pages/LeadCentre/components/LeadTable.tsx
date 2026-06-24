import DataLoader from "@/components/Loader/data-loader";
import { Pagination } from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LEADS_PATHS } from "@/constants/routes/leads.path";
import useDebounce from "@/hooks/useDebounce";
import { Instagram } from "@/icons/icons";
import {
  useConfigurationStore,
  type ConfigurationItem,
} from "@/pages/Settings/configuration/store/configuration.store";
import { useAuthStore } from "@/stores";
import { formatDate } from "@/utils/date-utils";
import {
  ArrowRightCircleIcon,
  Clock3,
  Import,
  Mail,
  Phone,
  Shapes,
  Webhook,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { FaGoogle } from "react-icons/fa";
import { MdWhatsapp } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useLeadsStore } from "../store/lead.store";
const LeadTable = () => {
  const navigate = useNavigate();
  // new Integration using zustand
  const { accountId } = useAuthStore((state) => state);

  const {
    leads,
    fetchLeads,
    currentPage,
    setCurrentPage,
    totalPages,
    loadingLeads,
    updateLeadField,
  } = useLeadsStore((state) => state);

  useEffect(() => {
    fetchLeads(String(accountId));
  }, [accountId, currentPage]);

  const { getConfigurationByType } = useConfigurationStore((state) => state);

  // const [searchQuery, setSearchQuery] = useState("");
  const [leadStages, setLeadStages] = useState<ConfigurationItem[] | []>([]);

  // const { permissions } = useAccountAccessStore((state) => state);

  const debouncedSearchQuery = useDebounce("", 500);
  // Filters and search query state

  const handleStatusChange = async (leadId: string, value: string) => {
    await updateLeadField(
      String(accountId),
      String(leadId),
      "stage" as any,
      value,
    );
  };

  useEffect(() => {
    // getLeads();
    // calculateBasicNumber()
  }, [currentPage, debouncedSearchQuery]);

  const getLeadStages = async () => {
    const values = await getConfigurationByType("lead-status");
    setLeadStages(values);
  };

  useEffect(() => {
    getLeadStages();
  }, []);

  const getIconForSource: Record<string, JSX.Element> = {
    website: <Shapes className="size-4 text-muted-foreground" />,
    google_ads: <FaGoogle className="size-4 text-muted-foreground" />,
    whatsapp: <MdWhatsapp className="size-4 text-muted-foreground" />,
    facebook: <Shapes className="size-4 text-muted-foreground" />,
    instagram: <Instagram />,
    webform: <Shapes className="size-4 text-muted-foreground" />,
    manual: <TbManualGearbox className="size-4 text-muted-foreground" />,
    webhook: <Webhook className="size-4 text-muted-foreground" />,
    import: <Import className="size-4 text-muted-foreground" />,
  };

  if (loadingLeads) {
    return (
      <div className="h-[75dvh] flex justify-center items-center">
        <DataLoader className="h-[75dvh]" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex h-125 w-full items-center justify-center">
        <div className="text-center">
          <img
            src="/src/assets/nochathistoryfound_CnSlq9EOHBW59HI8RYjeSpZ_WbWyQz9RmyNcvToLwGw4g31mlf1rnCox3Y3F-6xk_.svg"
            rel="preload"
            fetchPriority="high"
            alt="No chats yet"
            className="w-75"
          />
          <h3 className="text-sm mt-2 font-semibold text-gray-800">
            No leads yet
          </h3>

          <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
            Start managing leads,{" "}
            <Link
              to="/dashboard/settings/webhook"
              className="text-blue-600 underline flex items-center gap-1"
            >
              {" "}
              setup webhook <ArrowRightCircleIcon size={14} />
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overlead-hidden hide-scrollbar bg-white rounded-xl">
      <Table className="border-b">
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3">
              #
            </TableHead>
            {[
              "Date added",
              "Name",
              "Phone",
              "Email",
              "Stage",
              "Source",
              "Status",
              "Last Activity",
            ].map((header) => (
              <TableHead
                key={header}
                className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads?.map((lead, index) => (
            <TableRow
              key={lead.id}
              onClick={() =>
                navigate(LEADS_PATHS.getLeadDetail(String(accountId), lead.id))
              }
              className="group border-b  border-gray-200 transition-colors hover:bg-muted/20 odd:bg-gray-100/40"
            >
              <TableCell className="">
                <p className="flex items-center gap-4">
                  {(index + 1).toString().padStart(2, "0")}
                </p>
              </TableCell>
              {/* Date added */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />

                  {formatDate(lead.createdAt)}
                </div>
              </TableCell>
              {/* lead Name*/}

              <TableCell className="">
                <div className="flex items-center gap-4">
                  <div className="flex size-7 items-center justify-center text-primary rounded-2xl border bg-primary/10">
                    {/* nb <Worklead className="size-4 text-primary" /> */}
                    {lead?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold">{lead?.name}</h3>

                    <p className=" truncate text-xs text-muted-foreground">
                      {lead?.message?.slice(0, 50) || "No message"}
                    </p>
                  </div>
                </div>
              </TableCell>
              {/* Phone */}
              <TableCell className="">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  <h3 className="font-semibold">{lead?.phone}</h3>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  <h3 className="font-medium">{lead?.email}</h3>
                </div>
              </TableCell>

              {/* Stage */}
              <TableCell>
                <Select
                  value={lead?.stage}
                  onValueChange={(value: any) =>
                    handleStatusChange(lead.id, value)
                  }
                >
                  <SelectTrigger
                    className="border-none shadow-none"
                    onClick={(e: any) => e.stopPropagation()}
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {leadStages?.map((stage) => (
                      <SelectItem
                        key={stage._id}
                        value={stage.key}
                        className="capitalize"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`capitalize border-none rounded-2xl px-2 text-xs py-0.5 text-white`}
                            style={{ background: stage.color }}
                          >
                            {stage.label}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Source */}
              <TableCell>
                <div className="flex items-center gap-2 capitalize font-medium">
                  {getIconForSource[lead.source?.name || ""] || (
                    <Shapes className="size-4 text-muted-foreground" />
                  )}

                  {lead.source?.name || "Unknown"}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="flex items-center gap-2  capitalize font-medium">
                  {/* <GitBranch className="size-4 text-muted-foreground" /> */}

                  {lead.status || "Unknown"}
                </div>
              </TableCell>

              {/* Last Activity */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />

                  {formatDate(lead.updatedAt)}
                </div>
              </TableCell>

              {/* ACTIONS */}
              {/* <TableCell>
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="opacity-60 transition-opacity group-hover:opacity-100"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/settings/chatleads/${lead.id}/lead-builder`,
                                                    )
                                                }
                                            >
                                                <Pencil className="mr-2 size-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-500 focus:text-red-500"
                                                onClick={() => handleDeletelead(lead.id)}
                                            >
                                                <Trash2 className="mr-2 size-4" />
                                                Delet
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
};

export default LeadTable;
