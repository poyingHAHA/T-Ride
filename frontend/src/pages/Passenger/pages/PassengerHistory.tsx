import React from 'react'

export default function PassengerHistory() {
    return (
        <div>
            <div className="bg-white">
                <div className="p-4">
                    <h2 className="text-lg font-bold">Upcoming Trips</h2>
                </div>
                <div className="space-y-4 p-4">
                    <div className="bg-cover bg-center h-40 rounded-lg" style={{ backgroundImage: `url('path_to_image.jpg')` }}>
                        <div className="p-4 flex justify-between items-end h-full bg-gradient-to-t from-black to-transparent rounded-lg">
                            <div>
                                <h3 className="text-white font-bold">Los Angeles trip</h3>
                                <p className="text-gray-300">3 days away</p>
                            </div>
                            <p className="text-sm text-white">Mon 16 - Sat 21</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4">
                    <h2 className="text-lg font-bold">Past Orders</h2>
                </div>
                <div className="space-y-4 p-4">
                    <div className="bg-cover bg-center h-40 rounded-lg" style={{ backgroundImage: `url('path_to_image.jpg')` }}>
                        <div className="p-4 flex justify-between items-end h-full bg-gradient-to-t from-black to-transparent rounded-lg">
                            <div>
                                <h3 className="text-white font-bold">Los Angeles trip</h3>
                                <p className="text-gray-300">3 days away</p>
                            </div>
                            <p className="text-sm text-white">Mon 16 - Sat 21</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
