import { useState } from 'react';
import ProfileEdit from '../../components/profile/ProfileEdit';
import ProfileView from '../../components/profile/ProfileView';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Software Developer at XYZ Company',
    mobile: +8801626416432,
    avatar:
      'https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1727654400&semt=ais_hybrid',
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <>
      <div>
        <h1 className="sm:text-2xl sm:mt-0 mt-2 mb-4 text-xl font-semibold text-gray-600">
          Profile
        </h1>
        {isEditing ? (
          <ProfileEdit profile={profile} onSave={handleSave} onCancel={handleEditToggle} />
        ) : (
          <ProfileView profile={profile} onEdit={handleEditToggle} />
        )}
      </div>
    </>
  );
};

export default Profile;
