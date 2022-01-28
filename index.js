let costs = [];
let cost = {
    location: '',
    date: '',
    price: '',
    isEditing: false,
    id: 0,
}
getAllCosts = async () => {
    fetch('http://localhost:8000/getallcosts')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.forEach(item => {
                costs.push(item)
            })
        })
        .catch((error) => {
            console.log(error)
        })
    console.log(costs)
}

createNewCost = async (cost) => {
    cost.location = 'location'
    cost.date = 'date'
    cost.price = 200
    cost.id = 5

    fetch('http://localhost:8000/createnewcost', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .then(console.log(cost))
        .catch((error) => {
            console.log(error)
        })
}

deleteCost = async (cost) => {
    cost.id = 5

    fetch('http://localhost:8000/deletecost', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .then(console.log(cost))
        .catch((error) => {
            console.log(error)
        })
}

changeCost = async (cost) => {
    cost.location = '123456789',
        cost.date = '',
        cost.price = '',
        cost.isEditing = false,
        cost.id = 5

    fetch('http://localhost:8000/changecostinfo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .then(console.log(cost))
        .catch((error) => {
            console.log(error)
        })
}

deleteAllCosts = async () => {
    fetch('http://localhost:8000/deleteallcosts', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
    })
        .then(console.log('all costs deleted'))
        .catch((error) => {
            console.log(error)
        })
}


