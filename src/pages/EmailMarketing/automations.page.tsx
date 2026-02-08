import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const Automations = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
            <div className="max-w-lg w-full rounded-2xl shadow-xl border border-green-100">
                <CardContent className="p-8 text-center space-y-6">

                    {/* Badge */}
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                        Coming Soon
                    </span>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Something Awesome is on the Way
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600">
                        We’re building something powerful to help you grow faster.
                        Launching soon — stay tuned!
                    </p>

                    {/* Email Input */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1"
                        />
                        <Button className="bg-primary hover:bg-primary/80">
                            Notify Me
                        </Button>
                    </div>

                    {/* Footer text */}
                    <p className="text-xs text-gray-600">
                        No spam. Only launch updates
                    </p>
                </CardContent>
            </div>
        </div>
    )
}

export default Automations