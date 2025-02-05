import React from 'react'

function OptionScan({IconComponent, title}) {
  return (
    <button className="flex flex-col items-center justify-center p-4 border rounded-lg w-[48%] bg-white">
        <IconComponent size={24} className="text-[#77c847]" />
        <span className="text-[#77c847]">{title}</span>
    </button>
  )
}

export default OptionScan