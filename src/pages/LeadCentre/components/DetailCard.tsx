import { useState } from "react";
import { FieldRow } from "./FieldRow";
import type { ILead } from "../types/lead.type";

const DetailCard = ({ lead }: { lead: ILead | null }) => {
  const [hideDetails, setHideDetails] = useState(true);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div
        onClick={() => setHideDetails((prev) => !prev)}
        className={`${hideDetails && "border-b"} cursor-pointer  px-5 py-3 font-semibold text-md`}
      >
        Hide Details
      </div>
      {hideDetails && (
        <div>
          <div className="p-6">
            <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
              Lead Information
            </h2>

            <div className="grid xl:grid-cols-2 gap-x-24 max-w-4xl mx-auto">
              {/* Left */}
              <div>
                {/* <FieldRow
                  label="Lead Owner"
                  fieldKey="assignedTo"
                  value={lead?.assignedTo || "Assignee--"}
                  leadId={lead?.id}
                /> */}

                <FieldRow
                  label="Title"
                  value={lead?.title || "Sample Inquiry"}
                  fieldKey="title"
                  leadId={lead?.id}
                />

                {/* <FieldRow
                  label="Phone"
                  fieldKey="phone"
                  isPhone
                  value={lead?.phone || ""}
                  leadId={lead?.id}
                /> */}

                <FieldRow
                  label="Mobile"
                  value={lead?.mobile || ""}
                  isPhone
                  fieldKey="mobile"
                  leadId={lead?.id}
                />

                <FieldRow
                  label="Lead Source"
                  value={lead?.source?.name || ""}
                  fieldKey="source.name"
                  leadId={lead?.id}
                />
              </div>

              {/* Right */}
              <div>
                <FieldRow
                  label="Company"
                  fieldKey="company"
                  value={lead?.company || "Company name--"}
                  leadId={lead?.id}
                />

                <FieldRow
                  label="Lead Name"
                  value={lead?.name || ""}
                  fieldKey="name"
                  leadId={lead?.id}
                />

                {/* <FieldRow
                  label="Email"
                  value={lead?.email || ""}
                  fieldKey="email"
                  leadId={lead?.id}
                /> */}

                <FieldRow
                  label="Website"
                  value={lead?.website || ""}
                  fieldKey="website"
                  leadId={lead?.id}
                />

                {/* <FieldRow
                  label="Lead Status"
                  value={lead?.status || ""}
                  fieldKey="status"
                  leadId={lead?.id}
                /> */}
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
              Other Details
            </h2>
            <div className="grid xl:grid-cols-2 gap-x-24 max-w-4xl mx-auto">
              {Object.entries(lead?.customFields || {}).map(([key, value]) => (
                <FieldRow
                  key={key}
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  value={String(value || "-")}
                  fieldKey={`customFields.${key}`}
                  leadId={lead?.id}
                />
              ))}
            </div>
          </div>
          <div className="p-6">
            <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
              Address Information
            </h2>
            <div className="max-w-4xl mx-auto">
              <FieldRow
                label="Address"
                value={lead?.meta?.location?.address || "Mohali, India"}
                fieldKey="meta.location.address"
                leadId={lead?.id}
              />
              <FieldRow
                label="City"
                value={lead?.meta?.location?.city || "Mohali"}
                fieldKey="meta.location.city"
                leadId={lead?.id}
              />
              <FieldRow
                label="Country"
                value={lead?.meta?.location?.country || "India"}
                fieldKey="meta.location.country"
                leadId={lead?.id}
              />
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
              Message
            </h2>
            <div className="max-w-4xl mx-auto">
              <FieldRow
                label="Message"
                value={lead?.message || "No message provided."}
                fieldKey="message"
                leadId={lead?.id}
              />
            </div>
          </div>
          <div className="p-6">
            <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
              Description
            </h2>
            <div className="max-w-4xl mx-auto">
              <FieldRow
                label="Description"
                value={lead?.description || "No description provided."}
                fieldKey="description"
                leadId={lead?.id}
              />
            </div>
          </div>
          {/* <div className="p-6">
                    <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
                        Visit Summary
                    </h2>

                    <div className="grid xl:grid-cols-2 gap-x-24 max-w-4xl mx-auto">
                        <div>
                            <FieldRow

                                label="Most Recent Visit"
                                value={lead?.owner || "Assignee--"}
                            />

                            <FieldRow
                                label="Average Time Spent (Minutes)"
                                value={lead?.title || ""}
                            />

                            <FieldRow
                                label="Referrer"
                                value={lead?.phone || ""}
                                isPhone
                            />

                            <FieldRow
                                label="First Visit"
                                value={lead?.phone || ""}
                                isPhone
                            />

                        </div>

                        <div>
                            <FieldRow
                                label="First Page Visited"
                                value={lead?.company || ""}
                            />

                            <FieldRow
                                label="Number Of Chats"
                                value={lead?.name || ""}
                            />

                            <FieldRow
                                label="Visitor Score"
                                value={lead?.email || ""}
                            />

                            <FieldRow
                                label="Days Visited"
                                value={lead?.website || ""}
                            />

                        </div>
                    </div>
                </div> */}
        </div>
      )}
    </div>
  );
};

export default DetailCard;
