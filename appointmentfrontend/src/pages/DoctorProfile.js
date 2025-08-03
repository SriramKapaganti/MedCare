import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    axios.get(`https://med-care-srirams-projects-4f261a65.vercel.app/doctors/${id}`, {withCredentials: true})
      .then(res => {setDoctor(res.data) 
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
        navigate('/') 
      })
  }, [id, navigate])

  if (!doctor) {
    return <div className="p-6 text-center">Loading doctor details...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <img
        src={doctor.profile_image || 'https://via.placeholder.com/100'}
        alt={doctor.name}
        className="w-24 h-24 object-cover rounded-full mb-4 mx-auto"
      />
      <h2 className="text-2xl font-bold text-center">{doctor.name}</h2>
      <p className="text-center text-gray-600">{doctor.specialization}</p>
      <p className="text-center mt-2 font-medium text-blue-600">{doctor.status}</p>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate(`/book/${doctor.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </div>
    </div>
  )
}

export default DoctorProfile
