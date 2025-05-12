import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CatalogTable({ changeLogData }) {
  const [statusNames, setStatusNames] = useState({});
  const [categoryNames, setCategoryNames] = useState({});

  const parseJSON = (data) => {
    try {
      return JSON.parse(data) || {};
    } catch {
      return {};
    }
  };

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("svaAuth");
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire("Copied!", "Text copied to clipboard.", "success");
    });
  };
  // Create axios instance with auth header
  const api = axios.create({
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });

  // Fetch status and category names for each ID
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const statusNamesTemp = {};
        const categoryNamesTemp = {};

        // Process all change log entries
        for (const item of changeLogData || []) {
          const oldData = parseJSON(item.oldValue);
          const newData = parseJSON(item.newValue);

          // Fetch status names
          if (oldData.statusId && !statusNamesTemp[oldData.statusId]) {
            try {
              const response = await api.get(
                `http://localhost:3000/api/v2/status/${oldData.statusId}`
              );
              // Access the nested data structure
              statusNamesTemp[oldData.statusId] = response.data.data.name;
            } catch (error) {
              console.error(
                `Error fetching status ${oldData.statusId}:`,
                error
              );
              statusNamesTemp[oldData.statusId] = "------";
            }
          }
          if (newData.statusId && !statusNamesTemp[newData.statusId]) {
            try {
              const response = await api.get(
                `http://localhost:3000/api/v2/status/${newData.statusId}`
              );
              // Access the nested data structure
              statusNamesTemp[newData.statusId] = response.data.data.name;
            } catch (error) {
              console.error(
                `Error fetching status ${newData.statusId}:`,
                error
              );
              statusNamesTemp[newData.statusId] = "------";
            }
          }

          // Fetch category names
          if (oldData.categoryId && !categoryNamesTemp[oldData.categoryId]) {
            try {
              const response = await api.get(
                `http://localhost:3000/api/v2/category/${oldData.categoryId}`
              );
              // Access the nested data structure
              categoryNamesTemp[oldData.categoryId] = response.data.data.name;
            } catch (error) {
              console.error(
                `Error fetching category ${oldData.categoryId}:`,
                error
              );
              categoryNamesTemp[oldData.categoryId] = "------";
            }
          }
          if (newData.categoryId && !categoryNamesTemp[newData.categoryId]) {
            try {
              const response = await api.get(
                `http://localhost:3000/api/v2/category/${newData.categoryId}`
              );
              // Access the nested data structure
              categoryNamesTemp[newData.categoryId] = response.data.data.name;
            } catch (error) {
              console.error(
                `Error fetching category ${newData.categoryId}:`,
                error
              );
              categoryNamesTemp[newData.categoryId] = "------";
            }
          }
        }

        setStatusNames(statusNamesTemp);
        setCategoryNames(categoryNamesTemp);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, [changeLogData]);

  const getStatusName = (statusId) => {
    return statusNames[statusId] || "------";
  };

  const getCategoryName = (categoryId) => {
    return categoryNames[categoryId] || "------";
  };

  return (
    <div>
      {/* Desktop/Large Screen Table */}
      <div className="hidden h-[70vh] lg:block w-full shadow-md sm:rounded-lg overflow-y-auto">
        <table
          id="ChangeLogTable"
          className="w-full text-sm text-gray-500 dark:text-gray-400 table-fixed"
        >
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr className="border-b border-gray-800 dark:border-gray-700 font-extrabold">
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 w-[100px]">
                TYPE
              </th>
              <th className="px-6 py-3 w-[150px]">Created By</th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 w-[80px]">
                Data
              </th>
              <th className="px-6 py-3 w-[150px]">Title</th>
              <th className="px-6 py-3 w-[200px]">Job Post</th>
              <th className="px-6 py-3 w-[200px]">Sheet Link</th>
              <th className="px-6 py-3 w-[200px]">Admin Access</th>
              <th className="px-6 py-3 w-[200px]">Candidate Form</th>
              <th className="px-6 py-3 w-[120px]">Status</th>
              <th className="px-6 py-3 w-[120px]">Category</th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 w-[120px]">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {changeLogData?.length > 0 ? (
              [...changeLogData].reverse().map((item, index) => {
                const oldData = parseJSON(item.oldValue);
                const newData = parseJSON(item.newValue);

                const hasOldData =
                  oldData.title ||
                  oldData.jobPost ||
                  oldData.sheetLink ||
                  oldData.adminAccess ||
                  oldData.candidateFormLink ||
                  oldData.statusId ||
                  oldData.categoryId;

                const hasNewData =
                  newData.title ||
                  newData.jobPost ||
                  newData.sheetLink ||
                  newData.adminAccess ||
                  newData.candidateFormLink ||
                  newData.statusId ||
                  newData.categoryId;

                if (hasOldData || hasNewData) {
                  return (
                    <React.Fragment key={item.id || index}>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th
                          scope="row"
                          rowSpan={2}
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                        >
                          <p className="px-2 py-0.5 rounded-2xl">
                            {item.action}
                          </p>
                        </th>
                        <td rowSpan={2} className="px-6 py-4">
                          {item.user?.name || "------"}
                        </td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                          Old:
                        </td>
                        <td className="px-6 py-4">
                          {oldData.title || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.jobPost)}
                          title={oldData.jobPost}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {oldData.jobPost || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.sheetLink)}
                          title={oldData.sheetLink}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {oldData.sheetLink || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.adminAccess)}
                          title={oldData.adminAccess}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {oldData.adminAccess || "------"}
                        </td>
                        <td
                          onClick={() =>
                            copyToClipboard(oldData.candidateFormLink)
                          }
                          title={oldData.candidateFormLink}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {oldData.candidateFormLink || "------"}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusName(oldData.statusId)}
                        </td>
                        <td className="px-6 py-4">
                          {getCategoryName(oldData.categoryId)}
                        </td>
                        <td
                          rowSpan={2}
                          className="px-6 py-4 bg-gray-50 dark:bg-gray-800"
                        >
                          {new Date(item.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                          New:
                        </td>
                        <td className="px-6 py-4">
                          {newData.title || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.jobPost)}
                          title={newData.jobPost}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {newData.jobPost || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.sheetLink)}
                          title={newData.sheetLink}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {newData.sheetLink || "------"}
                        </td>
                        <td
                          onClick={() => copyToClipboard(oldData.adminAccess)}
                          title={newData.adminAccess}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {newData.adminAccess || "------"}
                        </td>
                        <td
                          onClick={() =>
                            copyToClipboard(oldData.candidateFormLink)
                          }
                          title={newData.candidateFormLink}
                          className="px-6 py-4 truncate cursor-pointer w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                        >
                          {newData.candidateFormLink || "------"}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusName(newData.statusId)}
                        </td>
                        <td className="px-6 py-4">
                          {getCategoryName(newData.categoryId)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                }
              })
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  ------ available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile View */}
      <div className=" lg:hidden 645px:max-w-[100%] max-w-[400px] h-[600px] space-y-4 overflow-x-auto overflow-auto my-4 px-4">
        {changeLogData?.length > 0 ? (
          changeLogData.map((item) => {
            const oldData = parseJSON(item.oldValue);
            const newData = parseJSON(item.newValue);

            const hasOldData =
              oldData.title ||
              oldData.jobPost ||
              oldData.sheetLink ||
              oldData.adminAccess ||
              oldData.candidateFormLink ||
              oldData.statusId ||
              oldData.categoryId;

            const hasNewData =
              newData.title ||
              newData.jobPost ||
              newData.sheetLink ||
              newData.adminAccess ||
              newData.candidateFormLink ||
              newData.statusId ||
              newData.categoryId;

            if (hasOldData || hasNewData) {
              return (
                <div
                  key={item.id}
                  className="bg-white text-left dark:bg-gray-800 p-4 my-4 rounded-lg shadow-md"
                >
                  <p className="font-extrabold text-lg">{item.action}</p>
                  <p className="my-2">
                    <span className="font-semibold">Created By:</span>{" "}
                    {item.user?.name || "------"}
                  </p>
                  {hasOldData && (
                    <div className="my-2 px-4">
                      <p className="font-semibold text-[#e85d04]">Old Data:</p>
                      <p>Title: {oldData.title || "------"}</p>
                      <p
                        onClick={() => copyToClipboard(oldData.jobPost)}
                        title={oldData.jobPost}
                        className="cursor-pointer max-w-[100px]  hover:font-semibold"
                      >
                        Job Post: {oldData.jobPost || "------"}
                      </p>
                      <p
                        onClick={() => copyToClipboard(oldData.sheetLink)}
                        title={oldData.sheetLink}
                        className="cursor-pointer max-w-[100%] hover:font-semibold"
                      >
                        Sheet Link: {oldData.sheetLink || "------"}
                      </p>
                      <p
                        onClick={() => copyToClipboard(oldData.adminAccess)}
                        title={oldData.adminAccess}
                        className="cursor-pointer max-w-[100%]  hover:font-semibold"
                      >
                        Admin Access: {oldData.adminAccess || "------"}
                      </p>
                      <p
                        onClick={() =>
                          copyToClipboard(oldData.candidateFormLink)
                        }
                        title={oldData.candidateFormLink}
                        className="cursor-pointer max-w-[100%]  hover:font-semibold"
                      >
                        Candidate Form: {oldData.candidateFormLink || "------"}
                      </p>
                      <p>Status: {getStatusName(oldData.statusId)}</p>
                      <p>Category: {getCategoryName(oldData.categoryId)}</p>
                    </div>
                  )}

                  {hasNewData && (
                    <div className="my-2 px-4">
                      <p className="font-semibold text-green-700">New Data:</p>
                      <p>Title: {newData.title || "------"}</p>
                      <p
                        onClick={() => copyToClipboard(newData.jobPost)}
                        title={newData.jobPost}
                        className="cursor-pointer max-w-[100px]  hover:font-semibold"
                      >
                        Job Post: {newData.jobPost || "------"}
                      </p>
                      <p
                        onClick={() => copyToClipboard(newData.sheetLink)}
                        title={newData.sheetLink}
                        className="cursor-pointer max-w-[100%]  hover:font-semibold"
                      >
                        Sheet Link: {newData.sheetLink || "------"}
                      </p>
                      <p
                        onClick={() => copyToClipboard(newData.adminAccess)}
                        title={newData.adminAccess}
                        className="cursor-pointer max-w-[100%]  hover:font-semibold"
                      >
                        Admin Access: {newData.adminAccess || "------"}
                      </p>
                      <p
                        onClick={() =>
                          copyToClipboard(newData.candidateFormLink)
                        }
                        title={newData.candidateFormLink}
                        className="cursor-pointer max-w-[100%]  hover:font-semibold"
                      >
                        Candidate Form: {newData.candidateFormLink || "------"}
                      </p>
                      <p>Status: {getStatusName(newData.statusId)}</p>
                      <p>Category: {getCategoryName(newData.categoryId)}</p>
                    </div>
                  )}

                  <p className="my-2">
                    <span className="font-semibold">Updated At:</span>{" "}
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              );
            }
          })
        ) : (
          <div className="text-center py-4">------ available</div>
        )}
      </div>
    </div>
  );
}
