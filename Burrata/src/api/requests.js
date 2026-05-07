async function logInRequest(data) {
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

  return res.json()
}

export default logInRequest