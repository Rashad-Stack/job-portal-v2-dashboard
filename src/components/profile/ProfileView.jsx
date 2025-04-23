import Button from './Button';
import { FaRegUser } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { MdWorkOutline } from 'react-icons/md';

const ProfileView = ({ profile, onEdit }) => {
  return (
    <div className="p-4 sm:max-w-4xl bg-white shadow rounded-[8px]">
      <div className="sm:flex gap-[60px] justify-start items-center p-10 grid grid-cols-2 divide-x-2">
        <div className="sm:mb-0 mb-10 ">
          <img
            src={profile.avatar}
            className="w-[200px] h-[200px] rounded-full "
            alt="profile image"
          />
        </div>
        <div className="pl-[60px]">
          <div className="flex gap-2 items-center text-lg">
            <FaRegUser />
            <p>{profile.name}</p>
          </div>
          <div className="flex gap-2 items-center text-lg">
            <IoCallOutline />
            <p>{profile.mobile}</p>
          </div>
          <div className="flex gap-2 items-center text-lg">
            <MdOutlineAlternateEmail />
            <p>{profile.email}</p>
          </div>
          <div className="flex gap-2 items-center text-lg">
            <MdWorkOutline />
            <p>{profile.bio}</p>
          </div>

          <Button onClick={onEdit} className="mt-4 bg-[#E5383B] text-lg">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
