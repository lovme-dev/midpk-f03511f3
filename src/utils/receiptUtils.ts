
export const downloadReceipt = async (receiptElement: HTMLElement | null, orderId: string) => {
  if (!receiptElement) return;
  
  try {
    // Dynamically import html2canvas to avoid module loading issues
    const { default: html2canvas } = await import("html2canvas");
    
    // Create a canvas from the receipt element
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      backgroundColor: "#081020", // Darker blue background
      logging: false,
      useCORS: true,
    });
    
    // Convert canvas to image and download
    const imgData = canvas.toDataURL("image/png");
    
    // Create a link element to download the image
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `Midasbuy_Receipt_${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error generating receipt image:", error);
    alert("Failed to download receipt. Please try again.");
  }
};
