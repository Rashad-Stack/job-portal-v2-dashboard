// import { Link } from "react-router";
import { Link } from "react-router";
import useDeviceSize from "../../hooks/useDeviceSize";
import { MdManageHistory } from "react-icons/md";
import { BsActivity } from "react-icons/bs";
import { CiShoppingTag } from "react-icons/ci";

export default function JobIndexBar({ toggleSidebar }) {
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
            to="/job-index/manage"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <MdManageHistory />
            <span className="ms-3">Manage</span>
          </Link>
        </li>
        <li>
          <Link
            to="/job-index/status"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <BsActivity />
            <span className="ms-3">Status</span>
          </Link>
        </li>
        <li>
          <Link
            to="/job-index/category"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <CiShoppingTag />
            <span className="ms-3">Category</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
