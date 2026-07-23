import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Country } from "country-state-city";
import { ChevronDown } from "lucide-react";
import { callService } from "../services/call.service";
import NumberTable from "../components/NumberTable";

const Buynumber = () => {
    const countries = Country.getAllCountries();
    const [loading, setLoading] = useState(true)

    const [selectedCountry, setSelectedCountry] = useState(countries[232]);
    const [numbers, setNumbers] = useState<any>([]);
    const getNumbers = async () => {
        setLoading(true)
        try {
            console.log(selectedCountry.flag)
            const response = await callService.getNumbers(selectedCountry.isoCode);
            setNumbers(response.data?.docs)
            console.log(response.data.docs)
        } catch (error) {

            setNumbers([])
            console.error("error", error)
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getNumbers()
    }, [selectedCountry.flag])
    console.log(selectedCountry)


    return (
        <div className="px-5">

            <div className="flex flex-col py-3">
                <h1 className="text-sm mb-2">Country</h1>
                <div>
                    {countries.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button
                                    className="flex items-center gap-2 rounded-xl w-80 justify-between border px-4 py-2 text-sm font-medium text-[#37322F]"
                                >
                                    <span>
                                        +{selectedCountry.phonecode} {selectedCountry.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="start"
                                className="w-72 max-h-80 overflow-y-auto rounded-xl"
                            >
                                {countries.map((country) => (
                                    <DropdownMenuItem
                                        key={country.isoCode}
                                        onClick={() => setSelectedCountry(country)}
                                        className={`cursor-pointer py-2 ${selectedCountry.isoCode === country.isoCode
                                            ? "bg-primary/10 text-primary"
                                            : ""
                                            }`}
                                    >
                                        +{country.phonecode} {country.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

            </div>




            <div>
                <NumberTable numbers={numbers} loading={loading} />
            </div>

        </div>
    );
};

export default Buynumber;