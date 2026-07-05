import { AnalyticsService } from "@/services/analytics.service";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";

interface SearchProps {
  search: string;
  openSearch: boolean;
  setOpenSearch: any;
}
const GlobalSearch = ({ search, openSearch, setOpenSearch }: SearchProps) => {
  const { accountId } = useAuthStore((state) => state);
  const analyticsService = new AnalyticsService()

  const [searchResult, setSearchResult] = useState<{
    leads: any[];
    contacts: any[];
  }>({
    leads: [],
    contacts: [],
  });

  const [loading, setLoading] = useState(false);

  console.log(accountId);

  const getSearchResult = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true);
      const response = await analyticsService.getSearch(
        String(accountId),
        search,
      );
      console.log("response", response.data);
      setSearchResult({
        leads: response?.data?.doc?.leads || [],
        contacts: response?.data?.doc?.contacts || [],
      });
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearchResult();
  }, [accountId, search]);

  if (!openSearch) return null;
  return (
    <div
      onClick={() => setOpenSearch(false)}
      className="absolute top-16 left-0 h-[92dvh] w-screen z-50 flex items- justify-center bg-black/40 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-b-xl bg-white shadow-2xl p-6 max-h-[40vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Search Results</h2>

        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* Leads */}
            {searchResult.leads.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Leads</h3>

                <div className="space-y-2">
                  {searchResult?.leads?.map((lead: any) => (
                    <div
                      key={lead._id}
                      className="border rounded-xl p-3 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                          <p className="text-sm text-gray-500">{lead.phone}</p>
                        </div>

                        <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Lead
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts */}
            {searchResult?.contacts?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Contacts</h3>

                <div className="space-y-2">
                  {searchResult?.contacts?.map((contact: any) => (
                    <div
                      key={contact._id}
                      className="border rounded-xl p-3 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500">
                            {contact.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contact.phone}
                          </p>
                        </div>

                        <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          Contact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResult.leads.length === 0 &&
              searchResult.contacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No results found
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
