export async function login_admin_request(data) {
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
    
    localStorage.setItem('token', data.token)

    return res.json()
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

  if (!res.ok) {
    throw new Error('Veirfication failed')
  }
  
    return res.json()
}

export async function save_user_claims_request(claims, userName) {
  const res = await fetch('http://localhost:8000/saveuserclaims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    [userName]: claims
  }) 
})

  if (!res.ok) {
    throw new Error('Saving a claims failed')
  }

  return res.json()
}


export async function get_all_users_request(department) {
  const res = await fetch(`http://localhost:8000/getallusers?department=${department}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
})
  if (!res.ok) {
    throw new Error('Get users failed')
  }

  return res.json()
}


export async function get_all_claims_request(department, dateStep) {
  const res = await fetch(`http://localhost:8000/getallclaims?department=${department}&dateStep=${dateStep}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
})
  if (!res.ok) {
    throw new Error('Get claims failed')
  }

  return res.json()
}


export async function get_schedule_request(department, dateStep) {
  const res = await fetch(`http://localhost:8000/getschedule?department=${department}&dateStep=${dateStep}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
})

  if (!res.ok) {
    throw new Error('Get schedule failed')
  }

  return res.json()
}


export async function get_dates_request(dateStep) {
  const res = await fetch('http://localhost:8000/getdates', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dateStep)
  })

  if (!res.ok) {
    throw new Error('Getting dates failed')
  }

  return res.json()
}


export async function save_schedule_table_request(schedule, dateStep) {
  const res = await fetch(`http://localhost:8000/saveallusersclaims?dateStep=${dateStep}`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(schedule)
  })

  if (!res.ok) {
    throw new Error('Saving schedule failed')
  }

  return res.json()
}


export async function save_new_worker_request(userTextName, department, unique_id_number, is_trainee) {
  const res = await fetch('http://localhost:8000/savenewworker', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify( {
    'username': userTextName,
    'position': department,
    'unique_id_number': unique_id_number,
    'is_trainee': is_trainee,
  })
  })

  if (!res.ok) {
    throw new Error('Saving user failed')
  }

  return res.json()
}


export async function delete_user_request(username) {
  const res = await fetch(`http://localhost:8000/deleteuser?username=${username}`, {
  method: "DELETE",
  headers: {
    'Content-Type': 'application/json'
  },
})

  if (!res.ok) {
    throw new Error('Deleting user failed')
  }

  if (res.status === 204 ) {
    return {'success': true}
  }

  return res.json()
}


export async function fill_up_schedule_request(claims, demands) {
  const res = await fetch(`http://localhost:8000/fillupschedule`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'claims': claims,
    'demands': demands
  })
})

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data['detail'] || 'Request failed')
  }

  return data
}