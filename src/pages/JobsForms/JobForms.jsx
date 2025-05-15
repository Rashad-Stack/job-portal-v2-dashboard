import { Link } from "react-router";
import Button from "../../components/button/Button";

export default function JobForms() {
  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
          All Forms
        </h1>

        <div className="flex justify-end my-6 w-full">
          <Link to="/jobs/forms/create">
            <Button label="Add New" variant="success" className="font-normal" />
          </Link>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:ml-6 mt-3 sm:mt-0">
            <span className="text-lg text-left font-semibold text-gray-800 dark:text-white">
              Frontend Developer
            </span>
          </div>

          <div className="flex gap-2">
            <Button label="Use" variant="success" />
            <Button label="Edit" variant="primary" />
            <Button label="Delete" variant="danger" />
          </div>
        </div>
      </div>
    </div>
  );
}
