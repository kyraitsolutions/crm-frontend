import { formatDateTime } from "@/utils/date-utils";
import { Funnel, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useContactStore } from "./Contact/store/contact.store";
import { useAuthStore } from "@/stores";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import ContactFilter from "./Contact/components/ContactFilter";
import DataLoader from "@/components/Loader/data-loader";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/pagination";
import { BroadcastChannelDialog } from "./Contact/components/BroadcastChannelDialog";
import { EmailBroadcastDialog } from "./Contact/components/EmailBroadcastDialog";
import { WhatsAppBroadcastDialog } from "./Contact/components/WhatsAppBroadcastDialog";
import type { TContact } from "./Contact/types/contact.type";

const contactId = (contact: TContact) => String(contact.id || contact._id || "");

const Contacts = () => {
  const {
    loadingContacts,
    contactQuery,
    setContactQuery,
    contacts,
    fetchContacts,
    setOpen,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
  } = useContactStore((state) => state);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const { accountId } = useAuthStore((state) => state);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(contactQuery.search, 1000);
  const pageIds = useMemo(() => contacts.map(contactId).filter(Boolean), [contacts]);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedContacts.includes(id));
  const someOnPageSelected = pageIds.some((id) => selectedContacts.includes(id));
  const selectedCount = selectAllMatching ? totalItems : selectedContacts.length;
  const audienceFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    if (contactQuery.source) filters.source = contactQuery.source;
    if (contactQuery.status) filters.status = contactQuery.status;
    return filters;
  }, [contactQuery.source, contactQuery.status]);

  useEffect(() => {
    fetchContacts(String(accountId || ""));
  }, [accountId, currentPage, JSON.stringify({ ...contactQuery, search: "" }), debouncedSearchQuery]);

  useEffect(() => {
    setSelectedContacts([]);
    setSelectAllMatching(false);
  }, [contactQuery.search, contactQuery.source, contactQuery.status, JSON.stringify(contactQuery.tags)]);

  const statusColor = {
    subscribed: "bg-green-100 text-green-700",
    unsubscribed: "bg-gray-100 text-gray-600",
    bounced: "bg-red-100 text-red-700",
  } as const;

  const handleSelectedContact = (id: string) => {
    setSelectAllMatching(false);
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((contactIdValue) => contactIdValue !== id) : [...prev, id],
    );
  };

  const toggleSelectPage = () => {
    if (allOnPageSelected) {
      setSelectAllMatching(false);
      setSelectedContacts((prev) => prev.filter((id) => !pageIds.includes(id)));
      return;
    }
    setSelectedContacts((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  return (
    <div className="px-6 py-2 ">
      <div className="flex justify-between gap-2 items-center my-5">
        <div className="flex items-center gap-3 w-full">
          <div className="flex gap-2 items-center w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="Search name, phone, email"
                value={contactQuery.search}
                onChange={(e) => setContactQuery({ search: e.target.value })}
                className="input-field"
              />
              <div className="absolute right-3  top-1/2 -translate-y-1/2">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                    }}
                    className="text-[#847971] mt-1 hover:text-[#37322F] transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <Search className="h-4 w-4 text-[#847971]" />
                )}
              </div>
            </div>
            <div className="relative">
              <ButtonWithTitle
                onClick={() => setOpenFilter(!openFilter)}
                className="flex items-center gap-2 rounded-2xl px-3 py-2.5 hover:bg-gray-100 transition"
              >
                <Funnel size={16} />
                <span className="text-sm font-medium">Filter</span>
              </ButtonWithTitle>
              {openFilter && <ContactFilter openFilter={openFilter} setOpenFilter={setOpenFilter} />}
            </div>
          </div>
        </div>

        <div className="flex whitespace-normal items-center justify-end gap-2 w-full">
          {selectedCount > 0 && (
            <ButtonWithTitle
              onClick={() => setChannelOpen(true)}
              className="border border-primary bg-primary hover:bg-primary/90 text-white text-sm px-3 py-1.5 rounded font-medium transition"
            >
              BROADCAST ({selectedCount})
            </ButtonWithTitle>
          )}
          <ButtonWithTitle
            title="Add Single Contact"
            onClick={() => setOpen(true)}
            className="border flex  items-center  gap-2 border-primary hover:bg-primary/10 text-primary text-sm px-3 py-1.5 rounded font-medium transition"
          >
            <Plus size={16} /> Add Contact
          </ButtonWithTitle>
        </div>
      </div>

      {allOnPageSelected && !selectAllMatching && totalItems > pageIds.length && (
        <div className="mb-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          All {pageIds.length} on this page are selected.{" "}
          <button
            type="button"
            className="text-primary font-medium"
            onClick={() => setSelectAllMatching(true)}
          >
            Select all {totalItems} contacts
          </button>
        </div>
      )}
      {selectAllMatching && (
        <div className="mb-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          All {totalItems} contacts matching this list are selected.{" "}
          <button
            type="button"
            className="text-primary font-medium"
            onClick={() => setSelectAllMatching(false)}
          >
            Clear
          </button>
        </div>
      )}

      {!loadingContacts ? (
        <div className="border rounded-2xl! overflow-hidden">
          <table className="w-full text-sm ">
            <thead className="bg-muted text-muted-foreground">
              <tr className="text-primary">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAllMatching || allOnPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = !selectAllMatching && someOnPageSelected && !allOnPageSelected;
                    }}
                    onChange={toggleSelectPage}
                  />
                </th>
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Phone</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Tags</th>
                <th className="p-3 text-left font-medium">Source</th>
                <th className="p-3 text-left font-medium">Added</th>
                <th className="p-3 text-left font-medium">Last Activity</th>
              </tr>
            </thead>

            <tbody>
              {contacts?.map((contact) => {
                const id = contactId(contact);
                return (
                  <tr key={id} className="even:bg-muted capitalize">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectAllMatching || selectedContacts.includes(id)}
                        onChange={() => handleSelectedContact(id)}
                      />
                    </td>
                    <td className="p-3 font-medium capitalize">{contact.name}</td>
                    <td className="p-3 font-medium capitalize whitespace-nowrap">{contact.phone}</td>
                    <td className="p-3 lowercase">{contact.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[contact.status as keyof typeof statusColor]}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags?.map((tag: any) => (
                          <span key={tag} className="bg-muted px-2 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">{contact.source}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {formatDateTime(String(contact.createdAt))}
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {formatDateTime(String(contact.lastActivity))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <DataLoader />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={(page) => {
          setCurrentPage(page);
        }}
      />

      <BroadcastChannelDialog
        open={channelOpen}
        count={selectedCount}
        onClose={() => setChannelOpen(false)}
        onSelectEmail={() => {
          setChannelOpen(false);
          setEmailOpen(true);
        }}
        onSelectWhatsApp={() => {
          setChannelOpen(false);
          setWhatsappOpen(true);
        }}
      />
      <EmailBroadcastDialog
        open={emailOpen}
        accountId={String(accountId || "")}
        contactIds={selectedContacts}
        selectAllMatching={selectAllMatching}
        audienceFilters={audienceFilters}
        onClose={() => setEmailOpen(false)}
      />
      <WhatsAppBroadcastDialog
        open={whatsappOpen}
        accountId={String(accountId || "")}
        contactIds={selectedContacts}
        selectAllMatching={selectAllMatching}
        audienceFilters={audienceFilters}
        selectedCount={selectedCount}
        onClose={() => setWhatsappOpen(false)}
      />
    </div>
  );
};

export default Contacts;
