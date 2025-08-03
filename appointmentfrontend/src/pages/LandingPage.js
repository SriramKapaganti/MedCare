import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { TbLogout2 } from "react-icons/tb";

const LandingPage = () => {
  const [doctors, setDoctors] = useState([])
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
  const checkAuth = async () => {
    try {
      await axios.get("https://med-care-gilt.vercel.app/verify-token", {
        withCredentials: true,
      })
    } catch (err) {
      navigate("/login")
    }
  }

  checkAuth()

  axios.get('https://med-care-gilt.vercel.app/doctors', {withCredentials: true})
    .then(res => setDoctors(res.data))
    .catch(err => console.error(err))
}, [navigate])

  const filteredDoctors = doctors.filter(doc =>
  (doc.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
  (doc.specialization?.toLowerCase() || '').includes(searchText.toLowerCase())
)

  const logout =async() => {
     try {
          await axios.post("https://med-care-gilt.vercel.app/logout", {} , {
            withCredentials: true,
          })
          navigate("/login")
        } catch (err) {
        }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className='flex flex-row justify-between items-center w-1104 h-84 mb-6'>
        <h1 className="text-3xl font-bold  text-center font-[Roboto] italic self-center">Med Care</h1>
        <TbLogout2 className='text-black text-3xl item-center ' onClick={logout} />
      </div>
      <p className='text-xl font-bold-600 mb-6 font-[Roboto] italic'>At MedCare, we believe that access to quality healthcare should be simple, seamless, and stress-free. Whether you're looking to book an appointment with top specialists, consult online, or track your medical history — MedCare brings everything together in one place. 
         With experienced doctors, real-time booking, and personalized care, we make your health our priority.</p>
      <input
        type="text"
        placeholder="Search by name or specialization..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
          >
            <img
              src={doctor.profile_image || 'https://via.placeholder.com/100'}
              alt={doctor.name}
              className="w-24 h-24 object-cover rounded-full mb-3"
            />
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className={`text-sm mt-2 ${
              doctor.status === 'Available'
                ? 'text-green-600'
                : doctor.status === 'On Leave'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {doctor.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LandingPage
