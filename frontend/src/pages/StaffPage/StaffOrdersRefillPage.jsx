import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffOrdersWalkin.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import searchIcon from '../../assets/staff/stafficons/staff-orders-search-icon.png';
import calendarIcon from '../../assets/staff/stafficons/staff-orders-calendar-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StaffModalOrdersWalkinEditComponent from '../../components/StaffComponents/StaffOrdersWalkin/StaffModalOrdersWalkinEditComponent';
import { orderDate } from '../../utils/OrderUtils';
import DatePicker from "react-multi-date-picker";
import { isSameDay } from 'date-fns';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';

function StaffOrdersRefillPage() {
    const [orderWalkins, setOrderWalkins] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const {staff} = useContext(StaffContext);


    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedOrder(null);
    };

    const fetchOrderWalkins = async() => {
        try {
            const response = await axios.get('/staffOrderRefill/getAllOrderRefillStaff');
            const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrderWalkins(sortedData);
            setFilteredOrders(sortedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrderWalkins();
    }, []);


    const handleDateChange = (dates) => {
        setSelectedDates(dates);
        if(dates && dates.length){
            const filtered = orderWalkins.filter(order => 
                dates.some(date => isSameDay(new Date(order.createdAt), date.toDate()))
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orderWalkins);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        const filtered = orderWalkins.filter(order => 
            order._id.includes(e.target.value) || 
            order.items.some(item => item.productName.toLowerCase().includes(e.target.value.toLowerCase()))
        );
        setFilteredOrders(filtered);
    };

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOrdersPerPageChange = (e) => {
        setOrdersPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    //define aggregateOrders function first
    const aggregateOrders = (orders) => {
        return orders.map(order => {
            const aggregatedItems = order.items.map(item => item.productName).join(', ');
            const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalPrice = order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
            return {
                ...order,
                aggregatedItems,
                totalQuantity,
                totalPrice,
            };
        });
    };

    const aggregatedOrders = aggregateOrders(currentOrders);

  return (
    <div className='staff-orders-walkin-container'>
        <StaffModalOrdersWalkinEditComponent
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            selectedOrder={selectedOrder}
            fetchOrderWalkins={fetchOrderWalkins}
        />

        <div className='staff-orders-walkin-header'>
            <ul className='staff-orders-walkin-nav'>
                {/* <li className='active'>All Orders</li> */}
                {/* <li>On Delivery</li>
                <li>Delivered</li>
                <li>Canceled</li> */}
            </ul>
        </div>
        <div className='staff-orders-walkin-search'>
            <form action=''>
                <button type='submit' className='search-button'>
                    <img src={searchIcon} alt='Search Icon' />
                </button>
                <input 
                    type='text' 
                    placeholder='Search by ID, product, or others...' 
                    className='search-input'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </form>
            <div className='date-picker-container'>
                <img src={calendarIcon} alt='Calendar Icon' />
                <DatePicker
                    value={selectedDates}
                    onChange={handleDateChange}
                    placeholder='Select dates'
                    multiple
                    format='MMM DD'
                    className='date-picker-input'
                    maxDate={new Date()}
                />
            </div>
        </div>
        <table className='staff-orders-walkin-table'>
            <thead>
                <tr>
                    {/* <th><input type='checkbox' onClick={handleCheckboxClick} /></th> */}
                    <th>Orders Id</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    aggregatedOrders.length > 0 ? aggregatedOrders.map(order => (
                        <tr key={order._id} className='clickable-row'
                        onClick={() => navigate(`/staff/order-summary/${order._id}`)}
                        >
                            <td>#{order._id}</td>
                            <td>{order.aggregatedItems || "N/A"}</td>
                            <td>{order.totalQuantity || 0}</td>
                            {/* <td>-</td> */}
                            <td>{`₱${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                            <td>{`₱${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                            <td>{orderDate(order.createdAt)}</td>
                        </tr>
                    )) : <tr><td colSpan="8">No results found</td></tr>
                }
            </tbody>
        </table>
        <div className='staff-orders-walkin-footer'>
            <div className='show-result'>
                <span>Show result: </span>
                <select value={ordersPerPage} onChange={handleOrdersPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className='pagination'>
                <span 
                onClick={() => handlePageChange(currentPage - 1)} 
                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </span>
                {
                    Array.from({ length: totalPages }, (_, index) => (
                        <span 
                        key={index} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={currentPage === index + 1 ? 'active' : ''}
                        style={{ cursor: 'pointer' }}
                        >
                            {index + 1}
                        </span>
                    ))
                }
                <span 
                onClick={() => handlePageChange(currentPage + 1)} 
                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </span>
            </div>
        </div>
    </div>
  )
}

export default StaffOrdersRefillPage
