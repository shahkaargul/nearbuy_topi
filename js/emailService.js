// ============================================
// NearBuy - Email Service
// EmailJS Integration for Order Notifications
// ============================================

// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_CONFIG = {
    serviceId: 'service_xjd4051',        // Replace with your EmailJS Service ID
    customerTemplateId: 'template_kq46iee',  // Template for customer confirmation
    adminTemplateId: 'template_3ume0hb',        // Template for admin notification
    publicKey: 'VzFk1pSMsxD5gTau8'         // Replace with your EmailJS Public Key
};

// Initialize EmailJS
export function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    } else {
        console.error('EmailJS library not loaded');
    }
}

// Send customer confirmation email
export async function sendCustomerEmail(orderData) {
    try {
        const templateParams = {
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_location: orderData.location,
            order_items: formatOrderItems(orderData.items),
            order_total: `Rs. ${orderData.total.toLocaleString()}`,
            order_date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.customerTemplateId,
            templateParams
        );

        console.log('Customer email sent successfully:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending customer email:', error);
        return { success: false, error };
    }
}

// Send admin notification email
export async function sendAdminEmail(orderData) {
    try {
        const commission = orderData.total * 0.10;

        const templateParams = {
            store_name: orderData.storeName,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_location: orderData.location,
            order_items: formatOrderItems(orderData.items),
            order_total: `Rs. ${orderData.total.toLocaleString()}`,
            commission_amount: `Rs. ${commission.toLocaleString()}`,
            order_date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.adminTemplateId,
            templateParams
        );

        console.log('Admin email sent successfully:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending admin email:', error);
        return { success: false, error };
    }
}

// Format order items for email
function formatOrderItems(items) {
    return items.map(item =>
        `${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
}

// Send both emails concurrently
export async function sendOrderEmails(orderData) {
    try {
        const [customerResult, adminResult] = await Promise.all([
            sendCustomerEmail(orderData),
            sendAdminEmail(orderData)
        ]);

        return {
            success: customerResult.success && adminResult.success,
            customerEmail: customerResult,
            adminEmail: adminResult
        };
    } catch (error) {
        console.error('Error sending order emails:', error);
        return {
            success: false,
            error
        };
    }
}
