// import React, { useEffect, useState } from 'react'
// import '../../../CSS/AdminCSS/AdminReports/InventoryReport.css';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import logoDepot from '../../../assets/icons/logo-depot.png';
// import logoDepot2 from '../../../assets/icons/logo-3.png';

// const fetchBase64 = async (filename) => {
//     const response = await fetch(filename);
//     const text = await response.text();
//     return text.trim();
// };

// function InventoryReport() {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [leftLogoBase64, setLeftLogoBase64] = useState('');
//     const [rightLogoBase64, setRightLogoBase64] = useState('');
//     const [selectedDates, setSelectedDates] = useState('');
//     const [filteredReports, setFilteredReports] = useState([]);

//     useEffect(() => {
//         //set default selectedDates to today's date
//         const today = new Date().toISOString().split('T')[0];
//         setSelectedDates(today);

//         const fetchLogos = async() => {
//             const leftLogo = await fetchBase64('/baseLogo.txt');
//             const rightLogo = await fetchBase64('/baseLogo2.txt');
//             setLeftLogoBase64(leftLogo);
//             setRightLogoBase64(rightLogo);
//         };

//         fetchLogos();
//         fetchReports();
//     }, []);

//     useEffect(() => {
//         //filter reports based on selected date
//         const filtered = reports.filter(report => {
//             const reportDate = new Date(report.reportDate).toLocaleDateString();
//             return reportDate === new Date(selectedDates).toLocaleDateString();
//         });
//         setFilteredReports(filtered);
//     }, [selectedDates, reports]);

//     const fetchReports = async() => {
//         try {
//             const response = await axios.get('/adminReports/getInventoryReportsAdmin');
//             setReports(response.data);
//             setLoading(false);
//         } catch (error) {
//             setError(error);
//             setLoading(false);
//         }
//     };

//     const handleGenerateReport = () => {
//         const doc = new jsPDF();
//         doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
//         doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
//         doc.setFontSize(14).setTextColor(0, 0, 0).setFont(undefined, 'bold');
//         doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
//         doc.setFontSize(10).setFont(undefined, 'normal');
//         doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
//         doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
//         doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
//         doc.setFontSize(12).setFont(undefined, 'bold');
//         doc.text('FINISHED GOODS PRODUCTION REPORT', 14, 47);
//         const now = new Date();
//         const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
//         doc.setFontSize(10).setFont(undefined, 'normal');
//         doc.text(`DATE: ${formattedDate}`, 14, 52);

//         doc.autoTable({
//             startY: 60,
//             head: [['PRODUCTS', 'UCM', 'QTY', 'REMARKS']],
//             body: filteredReports.map(report => [
//                 report.productName,
//                 report.sizeUnit,
//                 report.quantity,
//                 report.remarks
//             ]),
//             styles: { fontSize: 10, halign: 'center' },
//             headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
//             bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
//         });

//         doc.setFontSize(10);
//         doc.text('Prepared by:', 14, doc.autoTable.previous.finalY + 10);
//         doc.text('Checked by:', 80, doc.autoTable.previous.finalY + 10);
//         doc.text('Received by:', 150, doc.autoTable.previous.finalY + 10);

//         doc.text('___________________', 14, doc.autoTable.previous.finalY + 20);
//         doc.text('___________________', 80, doc.autoTable.previous.finalY + 20);
//         doc.text('___________________', 150, doc.autoTable.previous.finalY + 20);

//         doc.save('Inventory_Report.pdf');
//     };

//   return (
//     <div className='admin-inventory-report-container'>
//         <div className='admin-inventory-report-header'>
//             <button onClick={handleGenerateReport}>Download</button>
//         </div>
//         <input
//             type="date"
//             value={selectedDates}
//             onChange={(e) => setSelectedDates(e.target.value)}
//         />
//         {
//             loading ? (
//                 <p>Loading...</p>
//             ) : error ? (
//                 <p>Error loading products.</p>
//             ) : (
//                 <div className='admin-inventory-report-content'>
//                     <div className='report-header'>
//                         <div>
//                             <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
//                         </div>
//                         <div className='report-title'>
//                             <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
//                             <p>Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte</p>
//                             <p>(084) 309-2454/0930-8970769</p>
//                             <p>FB Page: Sabon Depot - Mindanao</p>
//                         </div>
//                         <div>
//                             <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
//                         </div>
//                     </div>
//                     <div className='admin-inventory-report-details'>
//                         <h2>FINISHED GOODS PRODUCTION REPORT</h2>
//                         <p>Date: {selectedDates ? new Date(selectedDates).toLocaleDateString() : ''}</p>
//                     </div>
//                     <table className='admin-inventory-report-table'>
//                         <thead>
//                             <tr>
//                                 <th>PRODUCTS</th>
//                                 <th>UCM</th>
//                                 <th>QTY</th>
//                                 <th>REMARKS</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 filteredReports.length > 0 ? (
//                                     filteredReports.map((report) => (
//                                         <tr key={report._id}>
//                                             <td>{report.productName}</td>
//                                             <td>{report.sizeUnit || 'N/A'}</td>
//                                             <td>{report.quantity}</td>
//                                             <td>{report.remarks}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <p>No inventory report this day.</p>
//                                 )
//                             }
//                         </tbody>
//                     </table>
//                     <div className='admin-inventory-report-footer'>
//                         <div>
//                             <p>Prepared by:</p>
//                             <p>____________________</p>
//                         </div>
//                         <div>
//                             <p>Checked by:</p>
//                             <p>____________________</p>
//                         </div>
//                         <div>
//                             <p>Received by:</p>
//                             <p>____________________</p>
//                         </div>
//                     </div>
//                     <div className='production-staff'>
//                         <p>PRODUCTION STAFF</p>
//                     </div>
//                 </div>
//             )
//         }
//     </div>
//   )
// }

// export default InventoryReport
import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminReports/InventoryReport.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-multi-date-picker';
import logoDepot from '../../../assets/icons/logo-depot.png';
import logoDepot2 from '../../../assets/icons/logo-3.png';

const fetchBase64 = async(filename) => {
    const response = await fetch(filename);
    const text = await response.text();
    return text.trim();
};

function InventoryReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [rightLogoBase64, setRightLogoBase64] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [preparedBy, setPreparedBy] = useState('');
    const [checkedBy, setCheckedBy] = useState('');
    const [receivedBy, setReceivedBy] = useState('');

    // useEffect(() => {
    //     //set default selectedDates to today's date
    //     const today = new Date().toISOString().split('T')[0];
    //     setSelectedDates(today);

    //     const fetchLogos = async() => {
    //         const leftLogo = await fetchBase64('/baseLogo.txt');
    //         const rightLogo = await fetchBase64('/baseLogo2.txt');
    //         setLeftLogoBase64(leftLogo);
    //         setRightLogoBase64(rightLogo);
    //     };

    //     fetchLogos();
    //     fetchReports();
    // }, []);
    useEffect(() => {
        const fetchLogos = async() => {
            try {
                const leftLogo = await fetchBase64('/baseLogo.txt');
                const rightLogo = await fetchBase64('/baseLogo2.txt');
                setLeftLogoBase64(leftLogo);
                setRightLogoBase64(rightLogo);
            } catch (error) {
                console.error('Error fetching logos:', error);
            }
        };

        fetchLogos();
        fetchReports();
    }, []);

    // useEffect(() => {
    //     //filter reports based on selected date
    //     const filtered = reports.filter(report => {
    //         const reportDate = new Date(report.reportDate).toLocaleDateString();
    //         return reportDate === new Date(selectedDates).toLocaleDateString();
    //     });
    //     setFilteredReports(filtered);
    // }, [selectedDates, reports]);
    useEffect(() => {
        const filtered = reports.filter((report) => {
            const reportDate = new Date(report.reportDate).toISOString().split('T')[0];
            const [startDate, endDate] = selectedDates.map((date) =>
                new Date(date).toISOString().split('T')[0]
            );

            return reportDate >= startDate && reportDate <= endDate;
        });
        setFilteredReports(filtered);
    }, [selectedDates, reports]);

    const getHighlightedDates = () => {
        if(selectedDates.length < 2) return [];
        const [startDate, endDate] = selectedDates.map((date) => new Date(date));
        const highlighted = [];
        const currentDate = new Date(startDate);

        while(currentDate <= endDate){
            highlighted.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return highlighted;
    };

    const fetchReports = async() => {
        try {
            const response = await axios.get('/adminReports/getInventoryReportsAdmin');
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const handleUpdateNames = async(reportId) => {
        try {
            const response = await axios.post('/adminReports/updateInventoryReportNames', {
                reportId,
                preparedBy,
                checkedBy,
                receivedBy
            });
            alert(response.data.message); 
            fetchReports();
        } catch (error) {
            setError(error);
            alert('Error updating report');
        }
    };

    const handleGenerateReport = () => {
        const doc = new jsPDF();
        doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
        doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
        doc.setFontSize(14).setTextColor(0, 0, 0).setFont(undefined, 'bold');
        doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
        doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
        doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('FINISHED GOODS PRODUCTION REPORT', 14, 47);
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(`DATE: ${formattedDate}`, 14, 52);

        doc.autoTable({
            startY: 60,
            head: [['PRODUCTS', 'UCM', 'QTY', 'REMARKS']],
            body: filteredReports.map(report => [
                report.productName,
                report.sizeUnit,
                report.quantity,
                report.remarks
            ]),
            styles: {fontSize: 10, halign: 'center'},
            headStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0]},
            bodyStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0]},
        });

        doc.setFontSize(10);
        doc.text(`Prepared by: ${preparedBy}`, 14, doc.autoTable.previous.finalY + 10);
        doc.text(`Checked by: ${checkedBy}`, 80, doc.autoTable.previous.finalY + 10);
        doc.text(`Received by: ${receivedBy}`, 150, doc.autoTable.previous.finalY + 10);

        doc.text('___________________', 14, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 80, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 150, doc.autoTable.previous.finalY + 20);

        doc.save('Inventory_Report.pdf');
    };

    return (
        <div className='admin-inventory-report-container'>
            <div className='admin-inventory-report-header'>
                <button onClick={handleGenerateReport}>Download</button>
            </div>
            <DatePicker
            value={selectedDates}
            onChange={setSelectedDates}
            placeholder='Select dates'
            range={true}
            format='MMM DD, YYYY'
            className='date-picker-input'
            maxDate={new Date()}
            highlight={getHighlightedDates()}
            />
            {
                loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading products.</p>
                ) : (
                    <div className='admin-inventory-report-content'>
                        <div className='report-header'>
                            <div>
                                <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
                            </div>
                            <div className='report-title'>
                                <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                                <p>Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte</p>
                                <p>(084) 309-2454/0930-8970769</p>
                                <p>FB Page: Sabon Depot - Mindanao</p>
                            </div>
                            <div>
                                <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
                            </div>
                        </div>
                        <div className='admin-inventory-report-details'>
                            <h2>FINISHED GOODS PRODUCTION REPORT</h2>
                            <p>Date: {selectedDates ? new Date(selectedDates).toLocaleDateString() : ''}</p>
                        </div>
                        <table className='admin-inventory-report-table'>
                            <thead>
                                <tr>
                                    <th>PRODUCTS</th>
                                    <th>UCM</th>
                                    <th>QTY</th>
                                    <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredReports.length > 0 ? (
                                        filteredReports.map((report) => (
                                            <tr key={report._id}>
                                                <td>{report.productName}</td>
                                                <td>{report.sizeUnit || 'N/A'}</td>
                                                <td>{report.quantity}</td>
                                                <td>{report.remarks}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <p>No inventory report this day.</p>
                                    )
                                }
                            </tbody>
                        </table>
                        <div className='admin-inventory-report-footer'>
                            <div>
                                <p>Prepared by:</p>
                                <input 
                                    type="text" 
                                    className='input-line' 
                                    value={preparedBy} 
                                    onChange={(e) => setPreparedBy(e.target.value)} 
                                    placeholder="Enter name" 
                                />
                            </div>
                            <div>
                                <p>Checked by:</p>
                                <input 
                                    type="text" 
                                    className='input-line' 
                                    value={checkedBy} 
                                    onChange={(e) => setCheckedBy(e.target.value)} 
                                    placeholder="Enter name" 
                                />
                            </div>
                            <div>
                                <p>Received by:</p>
                                <input 
                                    type="text" 
                                    className='input-line' 
                                    value={receivedBy} 
                                    onChange={(e) => setReceivedBy(e.target.value)} 
                                    placeholder="Enter name" 
                                />
                            </div>
                        </div>
                        <div className='production-staff'>
                            <p>PRODUCTION STAFF</p>
                        </div>
                        <button 
                            onClick={() => {
                                if (filteredReports.length > 0) {
                                    handleUpdateNames(filteredReports[0]._id);
                                } else {
                                    alert('No reports available to update.');
                                }
                            }}
                        >
                            Update Names
                        </button>

                    </div>
                )
            }
        </div>
    );
}

export default InventoryReport;
