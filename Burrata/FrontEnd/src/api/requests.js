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

export async function save_user_claims_request(claims, userName, id, text, ) {
  const res = await fetch('http://localhost:8000/saveuserclaims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'userId': id,
    'username': userName,
    'claims': claims,
    'message': text
  }) 
})

  if (!res.ok) {
    throw new Error('Saving a claims failed')
  }

  return res.json()
}


export async function get_all_users_request(department = 'all') {
  const res = await fetch(`http://localhost:8000/getallusers?department=${department}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
})

  if (res.status == 404) {
    return {}
  }

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


export async function save_schedule_table_request(schedule) {
  const res = await fetch(`http://localhost:8000/saveschedule`, {
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
    'department': department,
    'uniqueIdNumber': unique_id_number,
    'isTrainee': is_trainee,
  })
  })

  if (!res.ok) {
    throw new Error('Saving user failed')
  }

  return res.json()
}


export async function delete_user_request(user_id) {
  const res = await fetch(`http://localhost:8000/deleteuser?user_id=${user_id}`, {
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


export async function fill_up_schedule_request(claims, demands, dates, onlyLong, onlyShort) {
  const res = await fetch(`http://localhost:8000/fillupschedule`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'claims': claims,
    'demands': demands,
    'dates': dates,
    'onlyLong': onlyLong,
    'onlyShort': onlyShort
  })
})

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data['detail'] || 'Request failed')
  }

  return data
}


export async function get_messages(department, all = true, page = 1, number_of_elements = 5) {
  const res = await fetch(`http://localhost:8000/getmessages?department=${department}&all=${all}&page=${page}&number_of_elements=${number_of_elements}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
})

  if (!res.ok) {
    return []
  }

  return res.json()
}


export async function check_message_as_read(id) {
  const res = await fetch('http://localhost:8000/checkmessage', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(id)
  })

  if (!res.ok) {
    throw new Error('Failed during message check up')
  }

  return res.json()
}


export async function save_vacation(user_id, startDate, endDate) {
  const res = await fetch('http://localhost:8000/savevacation', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'userId': user_id,
    'startDate': startDate,
    'endDate': endDate
  })
  })

  if (!res.ok) {
    throw new Error('Failed during vacation saving')
  }

  return res.json()
}


export async function get_vacations() {
  const res = await fetch('http://localhost:8000/getvacations', {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }})

  if (!res.ok) {
    throw new Error('Failed during getting vacation')
  }

  return res.json()
}


export async function delete_vacation(userId) {
  const res = await fetch(`http://localhost:8000/deletevacation?user_id=${userId}`, {
  method: "DELETE",
  headers: {
    'Content-Type': 'application/json'
  },
})

  if (!res.ok) {
    throw new Error('Deleting vacation failed')
  }

  if (res.status === 204 ) {
    return {'success': true}
  }

  return res.json()
}


export async function get_allowed_shifts_values(userId) {
  const res = await fetch(`http://localhost:8000/getshiftsvalues?user_id=${userId}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  },
})

  if (!res.ok) {
    throw new Error('Getting shifts values failed')
  }

  return res.json()
}


export async function get_total_max(userId) {
  const res = await fetch(`http://localhost:8000/gettotalmax?user_id=${userId}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  },
})

  if (!res.ok) {
    throw new Error('Getting total max failed')
  }

  return res.json()
}


export async function save_new_user_settings(userId, totalMaxShifts, availableShiftsValues) {
  const res = await fetch('http://localhost:8000/saveusersettings', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'userId': userId,
    'totalMaxShifts': totalMaxShifts,
    'availableShiftsValues': availableShiftsValues
  })
  })


  if (!res.ok) {
    throw new Error('Failed during user settings saving')
  }

  return res.json()
}


export async function get_vacations_for_table(dateStep) {
const res = await fetch(`http://localhost:8000/getvacationstable?dateStep=${dateStep}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }})

  if (!res.ok) {
    throw new Error('Failed during getting vacations')
  }

  return res.json()
}


export async function get_default_shifts() {
  const res = await fetch(`http://localhost:8000/getdefaultshifts`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }})
  
    if (!res.ok) {
      throw new Error('Failed during getting shifts')
    }
  
    return res.json()
}
  

export async function save_default_shifts(shifts) {
  const res = await fetch(`http://localhost:8000/savedefaultshifts`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(shifts)
  })
  
    if (!res.ok) {
      throw new Error('Failed during saving shifts')
    }
  
    return res.json()
  }
    


export async function get_limits(username) {
  const res = await fetch(`http://localhost:8000/getlimits?username=${username}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
    if (!res.ok) {
      throw new Error('Failed during gettings limits')
    }
  
    return res.json()
  }
      