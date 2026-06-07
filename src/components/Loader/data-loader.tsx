const DataLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[#f4f4f4]">
            <div className="relative text-xl font-medium tracking-wide uppercase">
                {/* Gray Base Text */}
                <span className="text-gray-300">
                    LOADING...
                </span>

                {/* Animated Fill */}
                <span className="loading-fill absolute top-0 left-0">
                    LOADING...
                </span>
            </div>
        </div>
    );
};

export default DataLoader;