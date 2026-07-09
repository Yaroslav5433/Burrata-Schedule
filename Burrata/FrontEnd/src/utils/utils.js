export const generateEightDigitNumber = () =>
String(Math.floor(10000000 + Math.random() * 90000000));

export const demandsInputValidation = (demands, numberOfFreeWorkers) => {
    const values = Object.values(demands)
    
    if (values.includes('')) {
        return {
            'isValid': false,
            'message': 'Fill up all demands'
        }
    }
    
    for (let index = 0; index < values.length; index++) {
        const value = values[index];

        const [first, second] = value.split('/').map(Number);
        const max = numberOfFreeWorkers[index];

        if (first > max || second > max) {
            return {
                isValid: false,
                message: 'Some demands are higher than free workers'
            };
        }

        const min = first + second;
    }

    return {
        'isValid': true,
        'message': 'All demands are validated'
    }
}

export const getAllFreeWorkers = (schedule) => {
    const result = Array(7).fill(Object.values(schedule).length);

    Object.values(schedule).forEach(days => {
        days.forEach((value, index) => {
            if (value === 'X') {
                result[index] -= 1;
            }
        });
    });

    return result;
}

export const is_admin_auth = () => {
    return !!localStorage.getItem("token")
  }