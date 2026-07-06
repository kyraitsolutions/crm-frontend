import { Search } from "lucide-react";
import * as React from "react";
import { Input } from "./input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { containerClassName, className, placeholder = "Search...", ...props },
    ref,
  ) => {
    return (
      <div className={`relative w-full ${containerClassName ?? ""}`}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          ref={ref}
          type="search"
          className={`w-full pl-10 py-2! input-field ${className ?? ""}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
