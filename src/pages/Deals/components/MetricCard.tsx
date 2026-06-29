const MetricCard = ({ title, value, }: { title: string; value: string; }) => {
    return (
        <div className="bg-white rounded-xl border p-5">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    )
}

export default MetricCard