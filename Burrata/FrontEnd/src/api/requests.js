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

export async function ClaimingRequest(values, userName) {
  const res = await fetch('http://localhost:8000/claims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    values: values,
    username: userName
  }) 
})

  if (!res.ok) {
    throw new Error('sending a claims failed')
}

  return res.json()
}


export async function get_all_users_request() {
  const res = await fetch('http://localhost:8000/getusersanddates', {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  },
})
  return res.json()
}