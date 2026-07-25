import MessageTable from "../components/canned/MessageTable"

const CannedMessage = () => {
    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar">
            <MessageTable type="all" />
        </div>
    )
}

export default CannedMessage