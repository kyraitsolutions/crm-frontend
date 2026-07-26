import CallFilter from "../components/CallFilter"
import CallTable from "../components/CallTable"
import MakeCall from "../components/MakeCall"

const Calls = () => {
    return (
        <div className="h-[calc(100vh-64px)]">
            <div className="flex gap-5 items-center w-full py-5 px-5">
                <MakeCall />
                <CallFilter />
            </div>
            <CallTable />
        </div>
    )
}

export default Calls