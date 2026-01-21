import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const QRManagement = ({ locationSettings }) => {
    const [tableNumber, setTableNumber] = useState('1');
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [menu, setMenu] = useState([]);
    const [testSelectedItems, setTestSelectedItems] = useState([]);
    const qrCodeContainerRef = React.useRef(null);
    const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isQrCodeScriptLoaded, setIsQrCodeScriptLoaded] = useState(false);

    // Use localhost for dev, but can be changed to actual IP for production
    const BASE_QR_ORDER_URL = `${window.location.protocol}//localhost:3000`;

    useEffect(() => {
        fetch('http://localhost:3001/api/menu')
            .then(res => res.json())
            .then(setMenu);
    }, []);

    useEffect(() => {
        const checkQRCodeLoaded = () => {
            if (window.QRCode) {
                setIsQrCodeScriptLoaded(true);
            } else {
                const timer = setTimeout(checkQRCodeLoaded, 100);
                return () => clearTimeout(timer);
            }
        };
        checkQRCodeLoaded();
    }, []);

    useEffect(() => {
        if (qrCodeContainerRef.current) {
            qrCodeContainerRef.current.innerHTML = '';
        }
        if (isQrCodeScriptLoaded && qrCodeContainerRef.current) {
            generateQrCodeValue(tableNumber);
        } else {
            setIsQrCodeGenerated(false);
        }
    }, [tableNumber, isQrCodeScriptLoaded]);

    const generateQrCodeValue = (tableNum) => {
        setIsQrCodeGenerated(false);
        // Simplified URL format - just tableId parameter
        const url = `${BASE_QR_ORDER_URL}/?tableId=${tableNum}`;
        setQrCodeValue(url);

        if (isQrCodeScriptLoaded && qrCodeContainerRef.current) {
            qrCodeContainerRef.current.innerHTML = '';
            try {
                // qrcodejs expects a DOM element, not a canvas
                new window.QRCode(qrCodeContainerRef.current, {
                    text: url,
                    width: 256,
                    height: 256,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: window.QRCode.CorrectLevel.H
                });
                setIsQrCodeGenerated(true);
            } catch (error) {
                console.error('QR Code generation error:', error);
                setIsQrCodeGenerated(false);
                setNotification({ message: "Failed to generate QR code. Check console for details.", type: "error" });
                setTimeout(() => setNotification(null), 3000);
            }
        } else {
            console.warn("QRCode library not available or container not ready. Cannot generate QR code.");
        }
    };

    const handleTableNumberChange = (e) => {
        const num = e.target.value;
        setTableNumber(num);
    };

    const handleDownloadQR = () => {
        if (qrCodeContainerRef.current && isQrCodeGenerated) {
            const img = qrCodeContainerRef.current.querySelector('img') || qrCodeContainerRef.current.querySelector('canvas');
            if (img) {
                const url = img.src || img.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `table-${tableNumber}-qrcode.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                setNotification({ message: "QR code not ready for download. Please wait and try again.", type: "error" });
                setTimeout(() => setNotification(null), 3000);
            }
        } else {
            setNotification({ message: "QR code not ready for download. Please wait and try again.", type: "error" });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleTestQR = () => {
        if (qrCodeValue && isQrCodeGenerated) {
            window.open(qrCodeValue, '_blank');
        } else {
            setNotification({ message: "QR code not generated yet. Cannot test.", type: "error" });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">QR Ordering System Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Generate QR Code</h3>
                    <div className="mb-6 w-full max-w-sm">
                        <label htmlFor="tableNumber" className="block text-gray-700 text-sm font-bold mb-2">
                            Table Number
                        </label>
                        <input
                            type="text"
                            id="tableNumber"
                            value={tableNumber}
                            onChange={handleTableNumberChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g., 1, Takeaway"
                        />
                    </div>
                    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-inner mb-6">
                        {isQrCodeScriptLoaded ? (
                            <div id="qrCodeContainer" ref={qrCodeContainerRef} style={{ width: 256, height: 256 }}></div>
                        ) : (
                            <p className="text-gray-500">Loading QR code generator...</p>
                        )}
                        {!qrCodeValue && isQrCodeScriptLoaded && <p className="text-gray-500 mt-2">Enter table number to generate QR code.</p>}
                        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleDownloadQR}
                            disabled={!isQrCodeGenerated}
                            className={`bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform flex items-center
                            ${!isQrCodeGenerated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 hover:scale-105'}`}
                        >
                            Download QR
                        </button>
                        <button
                            onClick={handleTestQR}
                            disabled={!isQrCodeGenerated}
                            className={`btn-gradient px-4 py-2 ${!isQrCodeGenerated ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            Test QR
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Menu Preview</h3>
                    <div className="max-h-96 overflow-y-auto pr-4">
                        {menu.length === 0 ? (
                            <p className="text-gray-500">Loading menu...</p>
                        ) : (
                            <div>
                                {Object.entries(menu.reduce((acc, item) => {
                                    (acc[item.category] = acc[item.category] || []).push(item);
                                    return acc;
                                }, {})).map(([category, items]) => (
                                    <div key={category} className="mb-6">
                                        <h4 className="text-xl font-bold text-gray-800 mb-3">{category}</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    </div>
                                                    <div className="text-lg font-bold text-green-600">
                                                        {locationSettings.currencySymbol}{item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-8 border-t pt-6 border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Selected Items for Test</h3>
                        {testSelectedItems.length === 0 ? (
                            <p className="text-gray-500">No items selected.</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {testSelectedItems.map(item => (
                                    <li key={item.id}>{item.name} ({item.qty})</li>
                                ))}
                            </ul>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            (This section is for conceptual testing. In a real scenario, the "Test QR" button would take you to the actual customer ordering flow.)
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">How to Use:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Select a table number to generate a unique QR code.</li>
                    <li>Customers scan the QR code to view the menu and place orders.</li>
                    <li>You can download the QR code as an SVG for printing.</li>
                    <li>The menu preview allows you to see what customers will order.</li>
                </ul>
            </div>
        </div>
    );
};

export default QRManagement; 