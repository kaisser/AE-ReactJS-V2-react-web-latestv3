export default {
  items: [
    {
      name: "QRCODE",
      role: ["Personal-Account", "Business", "Admin"],
      url: "/qrcode",
      icon: "QrCode",
    },
    {
      name: "QR Code Scanner",
      role: ["Business", "Personal-Account"],
      url: "/qrcodeScanning",
      icon: "QrCode",
    },
    {
      name: "Upload Flyers",
      url: "/business",
      icon: "CloudUpload",
      role: ["Business", "Admin"],
      badge: {
        variant: "info",
      },
      attributes: { disabled: true },
    },
    {
      name: "Files",
      url: "/users",
      role: ["Admin", "Business", "Personal-Account"],
      icon: "PictureAsPdf",
      children: [
        {
          name: "Flyers",
          role: ["Personal-Account", "Business", "Admin"],
          url: "/flyers",
          icon: "Newspaper",
        },
        {
          name: "Coupons",
          role: ["Personal-Account", "Business", "Admin"],
          url: "/coupons",
          icon: "Discount",
        },
        {
          name: "Docs",
          role: ["Personal-Account", "Business", "Admin"],
          url: "/docs",
          icon: "DriveFileMove",
        },
      ],
    },
    {
      name: "Payment Gateway",
      role: ["Business", "Admin"],
      url: "/payment",
      icon: "Payment",
    },
    {
      name: "Support",
      role: ["Business", "Admin"],
      url: "/support",
      icon: "ContactSupport",
      badge: {
        variant: "info",
        text: "LIVE CHAT",
      },
      attributes: { disabled: true },
    },
    {
      name: "Profile",
      role: ["Business", "Personal-Account"],
      url: "/profile",
      icon: "AccountCircle",
    },



  ],
};
