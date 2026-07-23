import { getCountries, getCountryCallingCode } from "react-phone-number-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ICountryCodeSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export const CountryCodeSelect = ({
  value,
  onChange,
}: ICountryCodeSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="input-field">
        <SelectValue placeholder="Country Code" />
      </SelectTrigger>

      <SelectContent className="max-h-80">
        {getCountries().map((country) => (
          <SelectItem key={country} value={country}>
            {country} (+{getCountryCallingCode(country)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
