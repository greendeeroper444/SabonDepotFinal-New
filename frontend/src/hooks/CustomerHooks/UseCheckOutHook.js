import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

export default function UseCheckOutHook(customerId, selectedItems = [], navigate) {
    const [billingDetails, setBillingDetails] = useState({
        firstName: '',
        lastName: '',
        middleInitial: '',
        contactNumber: '',
        province: '',
        city: '',
        barangay: '',
        purokStreetSubdivision: '',
        emailAddress: '',
        clientType: '',
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [total, setTotal] = useState(0);
    const [showCashOnDeliveryModal, setShowCashOnDeliveryModal] = useState(false);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const { customer } = useContext(CustomerContext);

    useEffect(() => {
        setTotal(
            selectedItems.reduce((acc, item) => {
                const price =
                    customer?.isNewCustomer && new Date(customer?.newCustomerExpiresAt) > new Date()
                        ? item.productId.price * 0.7
                        : item.discountedPrice || item.productId.discountedPrice;
                return acc + price * item.quantity;
            }, 0)
        );
    }, [selectedItems, customer]);
    

    //
    useEffect(() => {
        const fetchCustomerData = async() => {
            try {
                const response = await axios.get(`/customerAuth/getDataUpdateCustomer/${customerId}`);
                const customer = response.data.customer;
                setBillingDetails(prevDetails => ({
                    ...prevDetails,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    middleInitial: customer.middleInitial,
                    contactNumber: customer.contactNumber,
                    province: customer.province,
                    city: customer.city,
                    barangay: customer.barangay,
                    purokStreetSubdivision: customer.purokStreetSubdivision,
                    emailAddress: customer.emailAddress,
                    clientType: customer.clientType,
                }));
            } catch (error) {
                console.error(error);
            }
        };

        if(customerId){
            fetchCustomerData();
        }
    }, [customerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails({ ...billingDetails, [name]: value });
    };

    const handlePaymentChange = (e) => {
        const { value } = e.target;
        setPaymentMethod(value);
        setShowCashOnDeliveryModal(value === 'Cash On Delivery');
        setShowPickupModal(value === 'Pick Up');
    };

    const handlePickupPayment = ({ pickupDate, pickupTime }) => {
        setSelectedDate(pickupDate);
        setSelectedTime(pickupTime);
        toast.success('Pick-up details saved successfully!');
    };

    const handlePlaceOrder = async () => {
        // Log to confirm billingDetails and paymentMethod
        console.log('Current billingDetails:', billingDetails);
        console.log('Payment Method:', paymentMethod);
    
        // Validate billing details
        const missingFields = [];
        for (const [key, value] of Object.entries(billingDetails)) {
            if (!value) {
                missingFields.push(key);
            }
        }
    
        if (missingFields.length > 0) {
            toast.error('Please fill out all billing details.');
            return;
        }
    
        // Validate payment method
        if (!paymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }
    
        console.log('Missing Fields:', missingFields);
    
        try {
            // Prepare the payload as a JSON object
            const orderData = {
                customerId,
                paymentMethod,
                billingDetails,
                pickupDate: selectedDate || undefined,  // Only send if available
                pickupTime: selectedTime || undefined,  // Only send if available
                selectedItems: selectedItems.map(item => item._id),  // Extract item IDs
            };
    
            // Make the API request
            const { data } = await axios.post('/customerOrder/createOrderCustomer', orderData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            // Handle the response
            if (data.orderId) {
                navigate(`/place-order/${customerId}/${data.orderId}`);
                toast.success(data.message || 'Order placed successfully!');
            } else {
                throw new Error(data.message || 'Order ID missing from response.');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error(error.response?.data?.message || 'Server error');
        }
    };
    
    
    

    return {
        billingDetails,
        paymentMethod,
        total,
        showCashOnDeliveryModal,
        showPickupModal,
        handleInputChange,
        handlePaymentChange,
        handlePickupPayment,
        handlePlaceOrder,
        setShowCashOnDeliveryModal,
        setShowPickupModal,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
    };
}
