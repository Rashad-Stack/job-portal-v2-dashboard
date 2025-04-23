import { Link } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import useDeviceSize from '../../hooks/useDeviceSize';

export default function SettingsNavbar({ toggleSidebar }) {
  const isMobile = useDeviceSize();

  function handleOnClick() {
    if (isMobile) {
      toggleSidebar(false);
    }
  }

  return (
    <nav>
      <ul className="pl-6 mt-2 space-y-2">
        <li>
          <Link
            to="/settings/change-password"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <RiLockPasswordLine />
            <span className="ms-3">Change Password</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
