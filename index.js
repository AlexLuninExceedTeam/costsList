let inputCostLocation = null;
let inputCostDate = null;
let inputCostPrice = null;
let costs = [];
let cost = {
    location: '',
    date: '',
    price: '',
    isEditing: false,
    id: 0,
}


getAllCosts = async () => {
    await fetch('http://localhost:8000/getallcosts')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            costs = [];
            data.forEach(item => {
                costs.push(item)
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

createNewCost = async (cost) => {
    await fetch('http://localhost:8000/createnewcost', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    }). then ()
        .catch((error) => {
            console.log(error)
        })
    render()
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

window.onload = async function init() {
    inputCostLocation = document.getElementById('location')
    inputCostLocation.addEventListener('change', changeCostLocation); //watch CostLocationInput
    inputCostDate = document.getElementById('date')
    inputCostDate.addEventListener('change', changeCostDate); //watch CostDateInput
    inputCostPrice = document.getElementById('price')
    inputCostPrice.addEventListener('change', changeCostPrice); //watch CostPriceInput
    await render()
}

changeCostLocation = (event) => {
    cost.location = event.target.value
}

changeCostDate = (event) => {
    cost.date = event.target.value;
}

changeCostPrice = (event) => {
    cost.price = +event.target.value
}

addCost = async () => {
    await createNewCost(cost)
}

render = async () => {
    await getAllCosts();

    costs.map(item => {
        let allCosts = document.getElementById('allCosts')
        let costContainer = document.createElement('div')
        let costLocation = document.createElement('span')
        let costDate = document.createElement('span')
        let costPrice = document.createElement('span')

        costLocation.innerText = item.location
        costDate.innerText = item.date
        costPrice.innerText = item.price
        costContainer.appendChild(costLocation)
        costContainer.appendChild(costDate)
        costContainer.appendChild(costPrice)
        allCosts.appendChild(costContainer)
    })

}

