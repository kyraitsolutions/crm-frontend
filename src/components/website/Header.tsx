import { Link } from "react-router-dom";

const Header = () => {
    return (
        <nav className="w-full border-b-2 border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-1">
                                <div>
                                    <span className=" !text-[#16A34A]/90 text-5xl font-bold">K</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-800  text-xl font-bold">Kyra</span>
                                    <span className="text-gray-800 text-xs whitespace-nowrap uppercase font-semibold">IT Solution</span>

                                </div>

                            </Link>
                        </div>
                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="" className="text-gray-700 hover:text-[#16A34A] text-sm font-medium transition-colors">
                                Product
                            </Link>
                            <Link to="/pricing" className="text-gray-700 hover:text-[#16A34A] text-sm font-medium transition-colors">
                                Pricing
                            </Link>
                            <Link to="#review" className="text-gray-700 hover:text-[#16A34A] text-sm font-medium transition-colors">
                                Review
                            </Link>
                        </div>
                    </div>
                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                window.location.href =
                                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                                // "http://localhost:3000/api/auth/google";
                            }}
                            className="text-gray-700 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Login →
                        </button>
                        <button
                            onClick={() => {
                                window.location.href =
                                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                            }}
                            className="bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                        >
                            Start for FREE →
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header