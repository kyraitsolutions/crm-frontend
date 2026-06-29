import LeadListHeader from "../LeadCentre/components/LeadListHeader"
import Toolbar from "../LeadCentre/components/Toolbar"
import DealsPipeline from "./components/DealsPipeline"

export const Deals = () => {
    return (
        <div className="relative">
            <h1 className="text-xl font-semibold border-b py-2 px-5 ">Deals</h1>

            {/* Status Section */}
            <LeadListHeader />
            <Toolbar />
            <DealsPipeline />

            {/* {openSort && <Sort />} */}
        </div>
    )
}
