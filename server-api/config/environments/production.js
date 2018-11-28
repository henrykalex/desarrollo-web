module.exports = {
  dev: false,
  logOut: false,
  logError: true,
  urlBase: '',
  secret: process.env.JWT_SECRETE,
  appDomain: 'https://api.home-products.com',
  verifyEmail: 'no-reply@home-products.com',
  whitelist: [
    undefined,
    'https://admin.home-products.com',
    'https://distribuidor.home-products.com',
    'https://veterinario.home-products.com',
    'https://cliente.home-products.com',
    'https://www.home-products.com',
    'https://home-products.com',
  ]
};
