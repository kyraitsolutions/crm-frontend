import LeadListHeader from "./components/LeadListHeader"
import LeadTable from "./components/LeadTable"
import Toolbar from "./components/Toolbar"

const LeadCenter = () => {

    return (
        <div className='py-2'>
            <h1 className='text-xl font-semibold border-b pb-2 px-5 '>Leads</h1>

            {/* Status Section */}
            <LeadListHeader />
            <Toolbar />
            <LeadTable />
        </div>
    )
}

export default LeadCenter