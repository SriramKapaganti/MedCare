import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import axios from 'axios'
import 'react-calendar/dist/Calendar.css'
import { FaRegCalendarAlt } from 'react-icons/fa'

const BookingForm = () => {
  const { id: doctorId } = useParams()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [message, setAlert] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !selectedDate || !time) {
      setAlert('"Please fill all fields"')
      return
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]

    try {
      await axios.post('https://med-care-gilt.vercel.app/appointments', {
        doctorId: parseInt(doctorId),
        name,
        email,
        date: formattedDate,
        time,
      },{withCredentials: true})
      setShowSuccessModal(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      setAlert('"Error booking appointment"')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
      <img
        src="/bg.jpg"
        alt="Medical Poster"
        className="w-[400px] h-auto rounded-xl shadow-lg hidden md:block"
      />

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 mt-8 md:mt-0 md:ml-10">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Book an Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Selected Date:</label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate.toISOString().split('T')[0]}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-pointer"
              />
              <FaRegCalendarAlt
                className="absolute right-4 top-3.5 text-gray-500 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              />
            </div>
            {showCalendar && (
              <div className="absolute z-50 bg-white p-2 mt-2 rounded shadow-xl">
                <Calendar
                  onChange={(date) => {
                    setSelectedDate(date)
                    setShowCalendar(false)
                  }}
                  value={selectedDate}
                />
              </div>
            )}
          </div>

          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Book Appointment
          </button>
            {message && <p className='text-red-900 font-bold text-sm text-center text-lg'>{message}</p>}
          
        </form>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Appointment Booked!</h3>
              <p className="text-gray-700 mb-6">Your appointment has been successfully scheduled.</p>
              <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setShowSuccessModal(false)
              navigate('/')
            }}
          >
        Go to Home
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  )
}

export default BookingForm
