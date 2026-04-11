import { Link, useLocation } from "react-router-dom";

import { settingSections } from "@/constants/setting.constant";
import { getBreadcrumbs } from "@/helpers/breadcrumbs";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// interface NavItem {
//   label: string;
//   path: string;
//   icon: React.ElementType;
// }
const Header = () => {
  const location = useLocation();
  //   const NAV_ITEMS: NavItem[] = [
  //     { label: "Seting", path: "", icon: MdInsights },
  //   ];

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* <div className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-lg font-medium  flex  items-center gap-1 transition-colors 
                            ${
                              isActive
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-trasparent"
                            }`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </div> */}

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.link ? (
                <Link to={item.link} className="hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-medium">{item.label}</span>
              )}

              {index !== breadcrumbs.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </div>
          ))}

          {breadcrumbs.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2
                                rounded-[99px]
                                py-2
                                text-sm font-medium
                                text-[#37322F]
                                shadow-none
                                transition
                                "
                >
                  {/* {label || allLabel} */}
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="
                                rounded-xl
                                border-none
                                bg-white
                                shadow-lg
                                w-64
                                px-0!
                                h-75
                                "
              >
                <DropdownMenuItem
                  onClick={() => console.log("")}
                  className="rounded-md text-sm cursor-pointer"
                >
                  {""}
                </DropdownMenuItem>

                {settingSections.map((option) => (
                  <div className="flex flex-col">
                    <p className="text-sm! font-medium text-primary uppercase mb-1 px-3">
                      {option.title}
                    </p>
                    <div className="h-px w-full border-[.5] border-b" />
                    <div className="flex flex-col mb-4">
                      {option.items.map((item) => (
                        <Link
                          to={`${breadcrumbs[0].link}${item.link}`}
                          key={item.label}
                          // onClick={() => onSelect(option)}
                          className="rounded-md px-5 py-2 hover:bg-primary/10 hover:text-primary text-sm text-gray-600 cursor-pointer"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* <div className="ml-auto flex items-center gap-2">
                    <Button className=""><Plus size={20} color="#ffffff" /> Create New Campaign</Button>
                </div> */}
      </div>
    </header>
  );
};

export default Header;
