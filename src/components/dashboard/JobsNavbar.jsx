import { Link } from 'react-router-dom';
import useDeviceSize from '../../hooks/useDeviceSize';
import { MdOutlineCreate } from 'react-icons/md';
import { IoReaderOutline } from 'react-icons/io5';

export default function JobsNavbar({ toggleSidebar }) {
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
            to="/jobs/create"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <MdOutlineCreate />
            <span className="ms-3">Job Create</span>
          </Link>
        </li>
        <li>
          <Link
            to="/jobs/read"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <IoReaderOutline />
            <span className="ms-3">All Jobs</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
