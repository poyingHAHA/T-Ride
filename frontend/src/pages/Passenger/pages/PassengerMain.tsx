import React from 'react'
import { Form, useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return (
        <main className="bg-gray-300 flex flex-col items-center h-screen">
            <iframe className="flex-1 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d-74.0059418!3d40.7127847!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus"
                title="Google Maps Location View"
            >
            </iframe>
            <Form method="post" className="flex-1 bg-white flex w-full h-screen flex-col px-10 pb-20 pt-10">

                <input
                    type="datetime-local"
                    className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select a time" required
                />

                <input type="text" id="location-input" className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6" placeholder="Pickup location" required />

                <input type="text" id="location-input" className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6" placeholder="Where to?" required />

                <input type="number" id="default-search" className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6" placeholder="How many passengers?" required />

                <button
                    className="text-white text-xl bg-black p-3 mb-0 items-center mt-6 rounded-xl max-md:mb-2.5"
                    type="button"
                    onClick={() => {
                        navigate("/passenger/Tripinfo")
                    }}

                >Confirm</button>
            </Form>

        </main>
    )
}
