import { useState } from 'react';
import Button from './Button';

const ProfileEdit = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mobile</label>
          <input
            type="number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Avatar</label>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" className="bg-green-600">
            Save
          </Button>
          <Button type="button" onClick={onCancel} className="bg-[#E5383B]">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
