import { Button } from '@/components/ui/button'
const Navhandle = ({ step, isSelected, handleStep }: { step: any, isSelected?: any, handleStep: any }) => {
    return (
        <div className="flex items-center justify-end gap-3 px-20">
            <Button
                disabled={step === 0}
                onClick={() => handleStep("sub")}
                className="rounded-xl border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
                Prev
            </Button>

            <Button
                disabled={!isSelected}
                onClick={() => handleStep("add")}
                className="rounded-xl bg-primary px-6 py-2 font-medium text-white"
            >
                Next
            </Button>
        </div>
    )
}

export default Navhandle