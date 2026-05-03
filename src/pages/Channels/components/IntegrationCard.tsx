import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
const IntegrationCard = ({ data }: any) => {
    const Icon = data.icon

    const handleWhatsapp = () => {
        alert(`Redirecting to ${data.name}`)
    }
    return (
        <div className=" mt-5 bg-gray-100 min-h-screen bg-white">
            <div className="w-full rounded-xl">
                <div className="p-6">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`${data.color} p-2 rounded-xl`}>
                                <Icon className="text-white w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-semibold">
                                {data.name}
                            </h2>
                        </div>

                        <Button onClick={handleWhatsapp} className={`${data.buttonColor} text-white`}>
                            Integrate
                        </Button>
                    </div>

                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                        {data.description}
                    </p>

                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            Key Features
                        </h3>


                        <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                            {data.features.map((feature: string) => (
                                <li>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Resources
                        </h3>

                        <Link
                            to="#"
                            className="text-blue-600 text-sm hover:underline"
                        >
                            {data.resourceText}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default IntegrationCard