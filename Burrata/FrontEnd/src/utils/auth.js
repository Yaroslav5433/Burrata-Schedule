import logInRequest from "../api/requests"

async function logIn(form) {
    try {
        const data = await logInRequest(form)
    
        console.log('Logging in...')
    
        localStorage.setItem('token', data.token)
    
      } catch (error) {
        console.log('ERROR:', error.message)
      }
}

function getToken () {
    return localStorage.getItem("token")
  }
  
function isAuth () {
    return !!getToken()
  }
  

export default { getToken, isAuth, logIn }
