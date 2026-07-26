import { Button } from '@/components/ui/button'
import { MessageCircleHeartIcon, X } from 'lucide-react'

const SendTemplate = ({ open, setOpen }: { open: boolean, setOpen: any }) => {
  return (
    <div
      onClick={() => setOpen(false)}
      className="absolute top-0 left-0 h-screen w-screen z-50 flex items- justify-end bg-black/10"
    // className="absolute top-0 left-0 h-screen w-screen z-50 flex items- justify-end backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1055px] bg-white shadow-2xl max-h-screen overflow-y-auto"
      >


        {/* Header */}
        <div className='bg-teal-800 px-4 py-2 grid grid-cols-3 text-white'>
          <div className='flex gap-3 items-center col-span-2  uppercase'>
            <X onClick={() => setOpen(false)} size={22} /> <span className='h-7.5 w-7.5 flex items-center justify-center rounded-full bg-orange-600'>A</span>Abhijeet
          </div>
          <div className='flex justify-center'>
            Chatprofile
          </div>
        </div>
        <div className='grid grid-cols-3 text-white h-[95vh]'>
          <div className='flex flex-col gap-2 col-span-2 bg-amber-100/50  '>
            <div className='flex-1 text-black'>
              jkhjgf
            </div>
            <div className='bg-white py-4 flex justify-center'>
              <Button className='rounded-xl!'>
                <MessageCircleHeartIcon /> Send Template
              </Button>
            </div>
          </div>
          <div className=' flex justify-center shadow'>
            Chatprofile
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendTemplate