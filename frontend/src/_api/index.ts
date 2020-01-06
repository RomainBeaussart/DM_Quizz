const axios = require('axios')

const HEADERS = {
}

const instance = axios.create({
  baseUrl: 'http://localhost:4000/', 
  timeout: 1000,
  headers: HEADERS
})

export default instance