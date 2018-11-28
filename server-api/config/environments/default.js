module.exports = {
  dev: true,
  logOut: true,
  logError: true,
  urlBase: '',
  mongo: {
    url: "mongodb://"+process.env.DB_HOSTNAME+":27017/"+process.env.DB_NAME
  },
  verifyEmail: 'no-contestar@irondog.mx',
  appDomain: 'http://localhost:3004',
  secret: 'Secreto',
  whitelist: [
    undefined,
    'http://localhost:8080',
    'http://localhost:4200',
    'http://softwaredeva.com',
    'https://home-products.softwaredeva.com',
    'http://192.168.100.11:4200'
  ],
  APROBE_MESSAGE: "¡Bienvendio! Haz sido aprobado.",
  APROBE_MESSAGE_HTML: "<h1>¡Bienvendio!</h1> <p>Haz sido aprobado.</p>",
  APROBE_SUBJECT: "Aprobación Home products",
  APROBE_REQUEST_MESSAGE: "¡Orden completa! Se aprobó tu solicitud de productos.",
  APROBE_REQUEST_MESSAGE_HTML: "<h1>¡Orden completa!</h1><p>Se aprobó tu solicitud de productos.<p>",
  APROBE_REQUEST_SUBJECT: "Orden aprobada Home products",
  CREATE_ORDER_MESSAGE: "¡Nueva orden! Ingresa al portal para verificar la orden.",
  CREATE_ORDER_MESSAGE_HTML: "<h1>¡Nueva orden!</h1><p>Ingresa al portal para verificar la orden.<p>",
  CREATE_ORDER_SUBJECT: "Orden nueva Home products",
};
