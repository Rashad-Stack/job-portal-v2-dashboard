import React from "react";

export default function CatalogTable({ changeLogData }) {
  const parseJSON = (data) => {
    try {
      return JSON.parse(data) || {};
    } catch {
      return {};
    }
  };

  return (
    <div>
      {/* Desktop/Large Screen Table */}
      <div className="hidden lg:block w-full shadow-md sm:rounded-lg overflow-x-auto">
        <table
          id="ChangeLogTable"
          className="w-full text-sm text-gray-500 dark:text-gray-400"
        >
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr className="border-b border-gray-800 dark:border-gray-700 font-extrabold">
              <th className="px-6 py-3 w-auto bg-gray-50 dark:bg-gray-800">
                TYPE
              </th>
              <th className="w-auto px-6 py-3">Created By</th>
              <th className="px-6 w-[100px] py-3 bg-gray-50 dark:bg-gray-800">
                Data
              </th>
              <th className="px-6 py-3">Job Post Title</th>

              <th className="w-auto px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {changeLogData?.length > 0 ? (
              [...changeLogData].reverse().map((item, index) => {
                const oldData = parseJSON(item.oldValue);
                const newData = parseJSON(item.newValue);
                const hasOldData = oldData.title || oldData.category?.name;
                const hasNewData = newData.title || newData.category?.name;

                // If both exist, show both rows
                if (hasOldData && hasNewData) {
                  return (
                    <React.Fragment key={item.id || index}>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th
                          scope="row"
                          rowSpan={2}
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                        >
                          <p className="px-2 py-0.5 rounded-2xl ">
                            {item.action}
                          </p>
                        </th>

                        <td rowSpan={2} className="px-6 py-4">
                          {item.user?.name || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-[#e85d04] bg-gray-50 dark:bg-gray-800">
                          Old:
                        </td>
                        <td className="px-6 py-4">{oldData.title || "N/A"}</td>

                        <td
                          rowSpan={2}
                          className="px-6 py-4 bg-gray-50 dark:bg-gray-800"
                        >
                          {new Date(item.timestamp).toLocaleDateString()}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 text-[#219ebc] bg-gray-50 dark:bg-gray-800">
                          New:
                        </td>

                        <td className="px-6 py-4">{newData.title || "N/A"}</td>
                      </tr>
                    </React.Fragment>
                  );
                }

                // Show only old data row
                if (hasOldData) {
                  return (
                    <tr
                      key={`old-${item.id || index}`}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        {item.action}
                      </th>
                      <td className="px-6 py-4">{item.user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-[#e85d04] bg-gray-50 dark:bg-gray-800">
                        Old:
                      </td>
                      <td className="px-6 py-4">{oldData.title || "N/A"}</td>

                      <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                }

                // Show only new data row
                if (hasNewData) {
                  return (
                    <tr
                      key={`new-${item.id || index}`}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        {item.action}
                      </th>
                      <td className="px-6 py-4">{item.user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-[#219ebc] bg-gray-50 dark:bg-gray-800">
                        New:
                      </td>
                      <td className="px-6 py-4">{newData.title || "N/A"}</td>

                      <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                }
                return null;
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden h-[600px] space-y-4 overflow-auto my-4">
        {changeLogData?.length > 0 ? (
          changeLogData.map((item) => {
            const oldData = parseJSON(item.oldValue);
            const newData = parseJSON(item.newValue);

            return (
              <div
                key={item.id}
                className="bg-white text-left dark:bg-gray-800 p-4 my-8 rounded-lg shadow-md"
              >
                <p
                  className={`px-2 py-0.5 rounded-2xl text-center ${
                    item.action === "EDIT"
                      ? "bg-[#457b9d] text-white"
                      : item.action === "DELETE"
                      ? "bg-[#ff595e] text-black"
                      : item.action === "ADD"
                      ? "bg-[#006b54] text-white"
                      : "bg-[#219ebc] text-black"
                  }`}
                >
                  {item.action}
                </p>
                <p className="my-2">
                  <span className="font-semibold">Created By:</span>{" "}
                  {item.user?.name || "N/A"}
                </p>

                {/* Conditionally Render Old Data */}
                {oldData.title && oldData.title !== "N/A" && (
                  <p className="my-2">
                    <span className="font-semibold">Old Data:</span>{" "}
                    {oldData.title}
                  </p>
                )}

                {/* Conditionally Render New Data */}
                {newData.title && newData.title !== "N/A" && (
                  <p className="my-2">
                    <span className="font-semibold">New Data:</span>{" "}
                    {newData.title}
                  </p>
                )}

                <p className="my-2">
                  <span className="font-semibold">Updated At:</span>{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">No data available</div>
        )}
      </div>
    </div>
  );
}
