export async function login_admin_request(data) {
      const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await res.json()
  } 

export async function verify_user_request(unique_id_number) {
    const res = await fetch('http://localhost:8000/verifyuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'unique_id_number': unique_id_number
    })
  })
  
    return res.json()
}

export async function save_user_claims_request(values, userName) {
  const res = await fetch('http://localhost:8000/saveuserclaims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    claims: claims,
    username: userName
  }) 
})

  return res.json()
}


export async function get_all_users_request() {
  const res = await fetch('http://localhost:8000/getallusers', {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  },
})

  return res.json()
}


export async function get_all_claims_request() {
  const res = await fetch('http://localhost:8000/getallclaims', {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  },
})

  return res.json()
}


export async function get_dates_request(steps) {
  const res = await fetch('http://localhost:8000/getdates', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(steps)
  })

  return res.json()
}