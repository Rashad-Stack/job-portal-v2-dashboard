
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { fetchAllChangeLog } from '../../api/changeLog';
// import TableData from '../../components/jobIndex/tableData';
import CatalogTable from '../../components/jobIndex/CatelogTable';

const ChangeLog = ({ setShowModal2, title }) => {
    const [ChangeLog, setChangeLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchChangeLog = async () => {
            try {
                setLoading(true);
                const { data } = await fetchAllChangeLog();
                setChangeLog(data);
            } catch (err) {
                console.error('Failed to fetch change log:', err.message);
                setError('Failed to fetch change log. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchChangeLog();
    }, []);
    // console.log(ChangeLog);

    return (
        <div className="w-full mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-[#00ab0c] to-[#008f0a] relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                        {title.heading}
                    </h2>
                    <button
                        onClick={() => setShowModal2(false)}
                        className="text-white hover:text-gray-200 cursor-pointer absolute right-6 top-6 font-extrabold transition-colors"
                    >
                        <RxCross2 className="text-2xl" />
                    </button>
                </div>
                {/* <TableData changeLogData={ChangeLog} /> */}

                <CatalogTable changeLogData={ChangeLog} />
            </div>
        </div>
    );
};

export default ChangeLog;
