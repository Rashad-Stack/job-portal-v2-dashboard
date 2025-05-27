import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { updateUser, getUserById } from '../../api/auth';
import Swal from 'sweetalert2';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        setUser(response.data);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
        navigate('/setting/manage_moderator');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateUser(id, user);
      Swal.fire('Success', 'User updated successfully', 'success');
      navigate('/setting/manage_moderator');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading user data...</div>;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Edit User</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
              minLength="2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({...user, role: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="HR">HR</option>
              <option value="MODERATOR">Moderator</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/setting/manage_moderator')}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1  bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}