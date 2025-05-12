
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        return localStorage.getItem('svaAuth');
    };

    // Create axios instance with auth header
    const api = axios.create({
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
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
                            console.error(`Error fetching status ${oldData.statusId}:`, error);
                            statusNamesTemp[oldData.statusId] = 'N/A';
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
                            console.error(`Error fetching status ${newData.statusId}:`, error);
                            statusNamesTemp[newData.statusId] = 'N/A';
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
                            console.error(`Error fetching category ${oldData.categoryId}:`, error);
                            categoryNamesTemp[oldData.categoryId] = 'N/A';
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
                            console.error(`Error fetching category ${newData.categoryId}:`, error);
                            categoryNamesTemp[newData.categoryId] = 'N/A';
                        }
                    }
                }

                setStatusNames(statusNamesTemp);
                setCategoryNames(categoryNamesTemp);
            } catch (error) {
                console.error('Error fetching names:', error);
            }
        };

        fetchNames();
    }, [changeLogData]);

    const getStatusName = (statusId) => {
        return statusNames[statusId] || 'N/A';
    };

    const getCategoryName = (categoryId) => {
        return categoryNames[categoryId] || 'N/A';
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
                            <th className="px-6 py-3 w-auto bg-gray-50 dark:bg-gray-800">TYPE</th>
                            <th className="w-auto px-6 py-3">Created By</th>
                            <th className="px-6 w-[100px] py-3 bg-gray-50 dark:bg-gray-800">
                                Data
                            </th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Job Post</th>
                            <th className="px-6 py-3">Sheet Link</th>
                            <th className="px-6 py-3">Admin Access</th>
                            <th className="px-6 py-3">Candidate Form</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Category</th>
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
                                                    <p className="px-2 py-0.5 rounded-2xl">
                                                        {item.action}
                                                    </p>
                                                </th>
                                                <td rowSpan={2} className="px-6 py-4">
                                                    {item.user?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-[#e85d04] bg-gray-50 dark:bg-gray-800">
                                                    Old:
                                                </td>
                                                <td className="px-6 py-4">
                                                    {oldData.title || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {oldData.jobPost || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {oldData.sheetLink || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {oldData.adminAccess || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {oldData.candidateFormLink || 'N/A'}
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
                                                <td className="px-6 py-4 text-[#219ebc] bg-gray-50 dark:bg-gray-800">
                                                    New:
                                                </td>
                                                <td className="px-6 py-4">
                                                    {newData.title || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {newData.jobPost || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {newData.sheetLink || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {newData.adminAccess || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {newData.candidateFormLink || 'N/A'}
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
                                            <td className="px-6 py-4">
                                                {item.user?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-[#e85d04] bg-gray-50 dark:bg-gray-800">
                                                Old:
                                            </td>
                                            <td className="px-6 py-4">{oldData.title || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                {oldData.jobPost || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {oldData.sheetLink || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {oldData.adminAccess || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {oldData.candidateFormLink || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusName(oldData.statusId)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getCategoryName(oldData.categoryId)}
                                            </td>
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
                                            <td className="px-6 py-4">
                                                {item.user?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-[#219ebc] bg-gray-50 dark:bg-gray-800">
                                                New:
                                            </td>
                                            <td className="px-6 py-4">{newData.title || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                {newData.jobPost || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {newData.sheetLink || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {newData.adminAccess || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {newData.candidateFormLink || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusName(newData.statusId)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getCategoryName(newData.categoryId)}
                                            </td>
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
                                <td colSpan="11" className="text-center py-4">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
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
                                        item.action === 'EDIT'
                                            ? 'bg-[#457b9d] text-white'
                                            : item.action === 'DELETE'
                                            ? 'bg-[#ff595e] text-black'
                                            : item.action === 'ADD'
                                            ? 'bg-[#006b54] text-white'
                                            : 'bg-[#219ebc] text-black'
                                    }`}
                                >
                                    {item.action}
                                </p>
                                <p className="my-2">
                                    <span className="font-semibold">Created By:</span>{' '}
                                    {item.user?.name || 'N/A'}
                                </p>
                                {oldData.title && (
                                    <div className="my-2">
                                        <p className="font-semibold text-[#e85d04]">Old Data:</p>
                                        <p>Title: {oldData.title || 'N/A'}</p>
                                        <p>Job Post: {oldData.jobPost || 'N/A'}</p>
                                        <p>Sheet Link: {oldData.sheetLink || 'N/A'}</p>
                                        <p>Admin Access: {oldData.adminAccess || 'N/A'}</p>
                                        <p>Candidate Form: {oldData.candidateFormLink || 'N/A'}</p>
                                        <p>Status: {getStatusName(oldData.statusId)}</p>
                                        <p>Category: {getCategoryName(oldData.categoryId)}</p>
                                    </div>
                                )}
                                {newData.title && (
                                    <div className="my-2">
                                        <p className="font-semibold text-[#219ebc]">New Data:</p>
                                        <p>Title: {newData.title || 'N/A'}</p>
                                        <p>Job Post: {newData.jobPost || 'N/A'}</p>
                                        <p>Sheet Link: {newData.sheetLink || 'N/A'}</p>
                                        <p>Admin Access: {newData.adminAccess || 'N/A'}</p>
                                        <p>Candidate Form: {newData.candidateFormLink || 'N/A'}</p>
                                        <p>Status: {getStatusName(newData.statusId)}</p>
                                        <p>Category: {getCategoryName(newData.categoryId)}</p>
                                    </div>
                                )}
                                <p className="my-2">
                                    <span className="font-semibold">Updated At:</span>{' '}
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
