
import React, { useState } from 'react';

export default function EnglishSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pets: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.pets) {
      alert('Please fill out all fields.');
      return;
    }
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxbRwVFWfGVYCqWCYNnTROeTitUwNLdrKZrH_Q-RQpCkC_uVkXGu1ujBspG161iFP7U/exec';
    await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="text-green-600 text-xl text-center mt-10">Thank you! We’ll be in touch soon 🐾</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7dec9] text-black p-6">
      <h1 className="text-3xl font-bold text-[#045b46] mb-6 text-center">Sign up for Moraqat 🐱</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input name="name" onChange={handleChange} value={formData.name} placeholder="Name" className="w-full p-3 border rounded" />
        <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" type="email" className="w-full p-3 border rounded" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone Number" className="w-full p-3 border rounded" />
        <input name="pets" onChange={handleChange} value={formData.pets} placeholder="Number of Pets" type="number" className="w-full p-3 border rounded" />
        <button type="submit" className="w-full bg-[#f86c2f] text-white p-3 rounded hover:bg-[#d95b1f]">Submit</button>
      </form>
    </div>
  );
}
