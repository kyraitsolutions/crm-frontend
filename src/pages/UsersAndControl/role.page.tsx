import { Users } from "lucide-react"
import { useState } from "react"
import PermissionManager from "./permissionManager";


type RoleKey = "admin" | "manager" | "editor" | "viewer";

type RoleType = {
    id: string;
    name: string;
    key: RoleKey;
    createdAt: string;
};



const Roles: RoleType[] = [
    {
        id: "690f5bbcf994f739c8865ee9",
        name: "WorkSpace Admin",
        key: "admin",
        createdAt: "22 Mar 2026, 12:14 AM"
    },
    {
        id: "690f5bd1f994f739c8865eea",
        name: "Manager",
        key: "manager",
        createdAt: "22 Mar 2026, 12:14 AM"
    },
    {
        id: "6921aabc4dddba5a1b2b7b4d",
        name: "Lead Manager",
        key: "editor",
        createdAt: "22 Mar 2026, 12:14 AM"
    },
    {
        id: "690f5c09f994f739c8865eeb",
        name: "Viewer",
        key: "viewer",
        createdAt: "22 Mar 2026, 12:14 AM"
    },
]
const Role = () => {
    const [active, setActive] = useState<RoleKey>();

    return (
        <div>
            {!active && <div className="">
                {Roles.map((role) => (
                    <div onClick={() => setActive(role.key)} key={role.id} className="cursor-pointer flex border-0.5 border-b  items-center gap-6 px-10 py-5">
                        <div>
                            <Users size={30} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-lg">{role.name}</p>
                            <p className="text-xs">Created at {role.createdAt}</p>
                        </div>

                    </div>
                ))}
            </div>}
            {active &&
                <PermissionManager
                    active={active}
                    setActive={setActive}
                    roles={Roles}
                />
            }


        </div>
    )
}

export default Role