import { logInRequest } from "../api/requests"

async function logIn(form) {
    try {
        const data = await logInRequest(form)
    
        console.log('Logging in...')
    
        localStorage.setItem('token', data.token)
    
        return data
      } catch (error) {
        console.log('ERROR:', error.message)
      }
}

const getToken = () => {
    return localStorage.getItem("token")
  }
  
const isAuth = () => {
    return !!getToken()
  }
  

export default { getToken, isAuth, logIn }
