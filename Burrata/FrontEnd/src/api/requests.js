export async function logInRequest(data) {
      const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      throw new Error('Login failed')
    }

    return await res.json()
  } 

export async function VerificationRequest(unique_id_number) {
    const res = await fetch('http://localhost:8000/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'unique_id_number': unique_id_number
    })
  })
  
    if (!res.ok) {
      throw new Error('Verification failed')
  }

    return res.json()
}

