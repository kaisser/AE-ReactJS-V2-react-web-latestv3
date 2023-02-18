import React from 'react';

const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));

const Business = React.lazy((props) => import('./views/Business/Business'));

const FileBusinessViewer = React.lazy(() => import('./views/FileViewer/FileBusinessViewer'));
const FileBackupViewer = React.lazy(() => import('./views/FileViewer/FileBackupViewer'));

const businessFiles = React.lazy(() => import('./views/Files/businessFiles'));
const backupFiles = React.lazy(() => import('./views/Files/backupFiles'));
const paymentGateway = React.lazy((props) => import('./views/PaymentGateway/PaymentGateway'));

const support = React.lazy(() => import('./views/Auth/Support/Support'));

const Profile = React.lazy(() => import('./views/Profile/Profile'));
const ProfileEdit = React.lazy(() => import('./views/Profile/ProfileEdit'));
const ProfilePassword = React.lazy(() => import('./views/Profile/PasswordEdit'));
const QrCode = React.lazy(() => import('./views/QrCode/QrCode'));
const PaymentHistory = React.lazy(() => import('./views/Profile/PaymentHistory'));

//Added by Saad
const ProfileEditDB = React.lazy(() => import('./views/Profile/ProfileEditDB'));
const LandingPage = React.lazy(() => import('./views/Auth/Landing/'));
const QrCodeTest = React.lazy(() => import('./views/QrCodeTest/QrCodeTest'));



const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/business', role: ['Business', 'Admin'], name: 'Business', component: Business },

  { path: '/flyers', role: ['Personal-Account', 'Business', 'Admin'], name: 'Flyers', component: businessFiles, props: { type: "Flyers" } },
  { path: '/coupons', role: ['Personal-Account', 'Business', 'Admin'], name: 'Business', component: businessFiles, props: { type: "Coupons" } },
  { path: '/docs', role: ['Personal-Account', 'Business', 'Admin'], name: 'Docs', component: backupFiles },

  { path: '/payment', role: ['Personal-Account', 'Business', 'Admin'], name: 'Payment Gateway', component: paymentGateway },

  { path: '/support', role: ['Personal-Account', 'Business', 'Admin'], name: 'Support', component: support },


  { path: '/profile', role: ['Personal-Account', 'Business', 'Admin'], name: 'Profile', component: Profile },
  { path: '/profileEdit', role: ['Personal-Account', 'Business', 'Admin'], name: 'ProfileEdit', component: ProfileEdit },
  { path: '/changePassword', role: ['Personal-Account', 'Business', 'Admin'], name: 'Profile', component: ProfilePassword },

  { path: '/users', role: ['Admin'], exact: true, name: 'Users', component: Users },
  { path: '/users/:id', role: ['Admin'], exact: true, name: 'User Details', component: User },

  { path: '/fileviewer/:basePath/:productPlan/:key', role: ['Personal-Account', 'Business', 'Admin'], exact: true, name: 'FileBusinessViewer', component: FileBusinessViewer },
  { path: '/fileviewer/:basePath/:sub/:phone/:key', role: ['Personal-Account', 'Business', 'Admin'], exact: true, name: 'FileBackupViewer', component: FileBackupViewer },
  //{ path: '/fileviewer/:basePath/:phone/:key', role: ['Personal-Account', 'Business', 'Admin'], exact: true, name: 'FileBackupViewer', component: FileBackupViewer },

  { path: '/qrcode', role: ['Personal-Account', 'Business', 'Admin'], exact: true, name: 'QRCode', component: QrCode },
  { path: '/paymentHistory', role: ['Personal-Account', 'Business'], exact: true, name: 'PaymentHistory', component: PaymentHistory },

  //Added by Saad
  { path: '/profileEditDB', role: ['Personal-Account', 'Business', 'Admin'], name: 'ProfileEditDB', component: ProfileEditDB },
  { path: '/profileEditDB/:key', role: ['Personal-Account', 'Business', 'Admin'], name: 'ProfileEditDB', component: ProfileEditDB },
  { path: '/landingpage', role: ['Personal-Account', 'Business', 'Admin'], name: 'LandingPage', component: LandingPage },
  { path: '/qrcodeScanning', role: ['Personal-Account', 'Business', 'Admin'], exact: true, name: 'QrCodeTest', component: QrCodeTest },

];

export default routes;
