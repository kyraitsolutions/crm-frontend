import LeadListHeader from "./components/LeadListHeader"
import LeadTable from "./components/LeadTable"
import Sort from "./components/Sort"
import Toolbar from "./components/Toolbar"
import { useLeadsStore } from "./store/lead.store"

const LeadCenter = () => {
    const { openSort, setOpenSort } = useLeadsStore((state) => state);

    // useEffect(()=>{

    // },[])

    return (
        <div className='py-2 relative'>
            <h1 className='text-xl font-semibold border-b pb-2 px-5 '>Leads</h1>

            {/* Status Section */}
            <LeadListHeader />
            <Toolbar />
            <LeadTable />

            {openSort && <Sort />}

        </div>
    )
}

export default LeadCenter