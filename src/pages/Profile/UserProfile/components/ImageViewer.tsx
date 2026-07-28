import { X } from "lucide-react"

const ImageViewer = ({ url, setOpen }: { url: string, setOpen: any }) => {
    return (
        <div onClick={() => setOpen(false)} className="absolute top-0 left-0 z-10 w-full h-screen bg-black/30 backdrop-blur-xs flex justify-center items-center">
            <div onClick={(e) => e.stopPropagation()} className=" relative max-w-4xl h-[80vh] ">
                <div onClick={() => setOpen(false)} className="absolute -right-3 -top-2.5 rounded-full text-white bg-red-400 w-fit p-2">
                    <X size={16} />
                </div>
                <img src={url || ""} alt="" className="object-contain h-full w-full" />
            </div>
        </div>
    )
}

export default ImageViewer