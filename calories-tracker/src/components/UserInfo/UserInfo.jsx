import React from 'react'

function UserInfo({info, value, unit, bg_color, openChange}) {

    return (
        <div className={`flex justify-between items-center p-4 ${bg_color} rounded-xl text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}>
            <p className="text-lg font-medium">{info}</p>
            <p className="text-lg font-semibold">
                {value} <span className="text-sm text-gray-500">{unit}</span>
            </p>
        </div>
    )
}

export default UserInfo