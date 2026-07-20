import { VITE_API_URL } from "@/utils/constants"

export async function login_admin_request(data) {
      const res = await fetch(`${VITE_API_URL}/login`, {
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
    const res = await fetch(`${VITE_API_URL}/verifyuser`, {
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

export async function save_user_claims_request(claims, userName, text) {
  const res = await fetch(`${VITE_API_URL}/saveuserclaims`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
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
  const res = await fetch(`${VITE_API_URL}/getallusers?department=${department}`, {
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
  const res = await fetch(`${VITE_API_URL}/getallclaims?department=${department}&dateStep=${dateStep}`, {
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
  const res = await fetch(`${VITE_API_URL}/getschedule?department=${department}&dateStep=${dateStep}`, {
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
  const res = await fetch(`${VITE_API_URL}/getdates`, {
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
  const res = await fetch(`${VITE_API_URL}/saveallusersclaims?dateStep=${dateStep}`, {
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
  const res = await fetch(`${VITE_API_URL}/savenewworker`, {
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
  const res = await fetch(`${VITE_API_URL}/deleteuser?username=${username}`, {
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


export async function fill_up_schedule_request(claims, demands, dates, only_long, only_short) {
  const res = await fetch(`${VITE_API_URL}/fillupschedule`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'claims': claims,
    'demands': demands,
    'dates': dates,
    'only_long': only_long,
    'only_short': only_short
  })
})

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data['detail'] || 'Request failed')
  }

  return data
}


export async function get_messages(department, all = true, page = 1, number_of_elements = 5) {
  const res = await fetch(`${VITE_API_URL}/getmessages?department=${department}&all=${all}&page=${page}&number_of_elements=${number_of_elements}`, {
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
  const res = await fetch(`${VITE_API_URL}/checkmessage`, {
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


export async function save_vacation(username, start_date, end_date) {
  const res = await fetch(`${VITE_API_URL}/savevacation`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'username': username,
    'start_date': start_date,
    'end_date': end_date
  })
  })

  if (!res.ok) {
    throw new Error('Failed during vacation saving')
  }

  return res.json()
}


export async function get_vacations() {
  const res = await fetch(`${VITE_API_URL}/getvacations`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }})

  if (!res.ok) {
    return []
  }

  return res.json()
}


export async function delete_vacation(username) {
  const res = await fetch(`${VITE_API_URL}/deletevacation?username=${username}`, {
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


export async function get_shifts_values(username) {
  const res = await fetch(`${VITE_API_URL}/getshiftsvalues?username=${username}`, {
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


export async function get_total_max(username) {
  const res = await fetch(`${VITE_API_URL}/gettotalmax?username=${username}`, {
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


export async function save_new_user_settings(username, totalMaxShifts, availableShiftsValues) {
  const res = await fetch(`${VITE_API_URL}/saveusersettings`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'username': username,
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
const res = await fetch(`${VITE_API_URL}/getvacationstable?dateStep=${dateStep}`, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }})

  if (!res.ok) {
    throw new Error('Failed during getting vacations')
  }

  return res.json()
}


export async function get_default_shifts(department) {
  const res = await fetch(`${VITE_API_URL}/getdefaultshifts?department=${department}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }})
  
    if (!res.ok) {
      throw new Error('Failed during getting shifts')
    }
  
    return res.json()
}
  

export async function save_default_shifts(shifts, department) {
  const res = await fetch(`${VITE_API_URL}/savedefaultshifts?department=${department}`, {
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
  const res = await fetch(`${VITE_API_URL}/getlimits?username=${username}`, {
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
      