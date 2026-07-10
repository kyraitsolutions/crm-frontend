import { CheckCircle, Lock, Trash2 } from 'lucide-react'
import { useState } from 'react';

const TwoFactorAuth = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  return (
    <div className="w-sm rounded-xl border border-gray-300 bg-white p-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-2">
        <div className='flex items-center gap-2'>

          <div className="">
            <Lock className="h-4  w-4 text-black" />
          </div>

          <h2 className="text-md font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Add an extra layer of security to your account.
        </p>
      </div>

      {/* Disable Button */}
      {twoFactor ? <button onClick={() => setTwoFactor(false)} className="mt-5 rounded bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">
        Disable
      </button> :
        <button onClick={() => setTwoFactor(true)} className="mt-5 rounded bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
          Enable
        </button>
      }

      <hr className="my-6 border-gray-200" />

      {/* Another Email */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Another E-Mail</h3>
            <p className="text-sm mt-2 text-gray-500">
              To send verification code
            </p>
          </div>

          <Trash2 className="h-5 w-5 cursor-pointer text-black hover:text-red-500" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 fill-black text-white" />
          <span className="text-sm text-gray-800">
            mrssihelaicals@digitalspace.com
          </span>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* SMS Recovery */}
      <div className=' flex flex-col gap-2'>
        <h3 className="font-semibold text-sm text-gray-900">Whatsapp Recovery</h3>
        <p className="text-xs text-gray-500">Add your whatsapp number</p>

        <button className="w-fit mt-2 rounded border border-gray-400 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          Setup
        </button>
      </div>
    </div>
  )
}

export default TwoFactorAuth