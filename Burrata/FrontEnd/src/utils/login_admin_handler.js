import { login_admin_request } from "@/api/requests"

export async function login_admin_request_handler(form) {
    try {
        const data = await login_admin_request(form)
    
        console.log('Logging in...')
    
        localStorage.setItem('token', data.token)
    
        return data
      } catch (error) {
        console.log('Login failed:', error.message)
      }
}

const get_admin_token = () => {
    return localStorage.getItem("token")
  }
  
export const is_admin_auth = () => {
    return !!get_admin_token()
  }
  

