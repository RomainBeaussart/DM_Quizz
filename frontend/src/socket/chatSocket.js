const SOCKET_BASE_URL = 'http://localhost:7545/'

function initSocket (chatId) {
  const FULL_SOCKET_URL = SOCKET_BASE_URL + chatId
  return require('socket.io-client')(FULL_SOCKET_URL)
}

export default initSocket
