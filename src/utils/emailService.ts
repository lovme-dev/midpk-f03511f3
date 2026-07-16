import emailjs from 'emailjs-com';
import { downloadReceipt } from './receiptUtils';

// EmailJS configuration - these should be set up in your EmailJS account
const SERVICE_ID = 'service_midasbuy'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_receipt'; // Replace with your EmailJS template ID
const USER_ID = 'user_midasbuy'; // Replace with your EmailJS user ID

interface PurchaseDetails {
  packageId: string;
  baseAmount: number;
  bonusAmount: number;
  price: number;
  playerID: string;
  username: string;
  paymentMethod: string;
  transactionId: string;
  purchaseDate: string;
  receiptFile?: File;
}

export const sendReceiptEmail = async (
  purchaseDetails: PurchaseDetails,
  receiptElement?: HTMLElement
): Promise<boolean> => {
  try {
    // Convert receipt to base64 image if receipt element is provided
    let receiptImageData = '';
    if (receiptElement) {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        backgroundColor: "#081020",
        logging: false,
        useCORS: true,
      });
      receiptImageData = canvas.toDataURL("image/png");
    }

    // Prepare email data
    const emailData = {
      to_email: 'ayubkhanzsa@gmail.com',
      from_name: 'Midasbuy Purchase System',
      player_id: purchaseDetails.playerID,
      username: purchaseDetails.username,
      uc_amount: `${purchaseDetails.baseAmount + purchaseDetails.bonusAmount} UC`,
      price: `${(purchaseDetails.price * 278.55).toFixed(2)} PKR`,
      payment_method: purchaseDetails.paymentMethod,
      transaction_id: purchaseDetails.transactionId,
      purchase_date: new Date(purchaseDetails.purchaseDate).toLocaleDateString(),
      receipt_image: receiptImageData,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      emailData,
      USER_ID
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Fallback email function using mailto (opens user's email client)
export const sendReceiptEmailFallback = (purchaseDetails: PurchaseDetails) => {
  const subject = `Midasbuy Purchase Receipt - ${purchaseDetails.transactionId}`;
  const body = `
Purchase Details:
- Player ID: ${purchaseDetails.playerID}
- Username: ${purchaseDetails.username}
- UC Amount: ${purchaseDetails.baseAmount + purchaseDetails.bonusAmount} UC
- Price: ${(purchaseDetails.price * 278.55).toFixed(2)} PKR
- Payment Method: ${purchaseDetails.paymentMethod}
- Transaction ID: ${purchaseDetails.transactionId}
- Purchase Date: ${new Date(purchaseDetails.purchaseDate).toLocaleDateString()}

Thank you for your purchase!
  `;

  const mailtoLink = `mailto:ayubkhanzsa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
};