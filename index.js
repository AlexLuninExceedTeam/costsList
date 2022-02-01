let inputCostLocation = null;
let inputCostPrice = null;
let inputEditLocation = document.createElement('input')
let inputEditDate = document.createElement('input')
let inputEditPrice = document.createElement('input')
let costs = [];
let cost = {
    location: '',
    date: '',
    price: '',
    isEditing: false,
    id: 0,
}
let costID = null;

createEditArea = (item) => {
    inputEditLocation.type = "text"
    inputEditPrice.type = "Number"
    inputEditLocation.value = item.location
    inputEditDate.value = item.date;
    inputEditPrice.value = item.price
}

getAllCosts = async () => {
    try {
        let response = await fetch('http://localhost:8000/getallcosts')
        if (response.status === 200) {
            let json = await response.json()
            costs = [...json]
        }
    } catch {
        (error) => console.log( error)
    }
}

createNewCost = async (cost) => {
    costID++
    cost.id = costID
    try {
        await fetch('http://localhost:8000/createnewcost', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', "Accept": "application/json"},
            body: JSON.stringify(cost),
        })
    } catch {
        (error) => console.log(error)
    }
    await render()
}

deleteCost = async (cost) => {
    try {
        await fetch('http://localhost:8000/deletecost', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', "Accept": "application/json"},
            body: JSON.stringify(cost),
        })
    } catch {
        (error) => console.log(error)
    }
    await render()
}

setDate = () => {
    let today = new Date;
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let year = today.getFullYear();
    today = `${day}.${month}.${year}`;
    return today
}

changeCost = async (cost) => {
    try {
        await fetch('http://localhost:8000/changecostinfo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', "Accept": "application/json"},
            body: JSON.stringify(cost),
        })
    } catch {
        (error) => console.log(error)
    }
    await render();
}

window.onload = async function init() {
    inputCostLocation = document.getElementById('location')
    inputCostLocation.addEventListener('change', changeCostLocation); //watch CostLocationInput
    inputCostPrice = document.getElementById('price')
    inputCostPrice.addEventListener('change', changeCostPrice); //watch CostPriceInput
    await render()
}

changeCostLocation = (event) => {
    let loc = event.target.value
    cost.location = `${loc[0].toUpperCase()}${loc.slice(1)}`
}

changeCostPrice = async (event) => {
    cost.price = parseFloat(event.target.value)
}

addCost = async () => {
    if (!cost.location) {
        alert('Название магазина некорректно или отсутствует')
    } else if (!cost.price) {
        alert('Сумма некорректна или отсутствует')
    } else {
        cost.date = setDate()
        await createNewCost(cost)
        inputCostLocation.value = ''
        inputCostPrice.value = ''
        cost.location = ''
        cost.price = ''
    }
}

deleteOneCost = async (item) => {
    await deleteCost(item);
    await render()
}

sumPrices = () => {
    let sum = 0;
    costs.forEach(item => sum += item.price)
    return sum
}

renderAllCostsPrices = () => {
    let allCostsPrices = sumPrices()
    let sumAllCostsPrices = document.getElementById('sumAllCostsPrices')
    sumAllCostsPrices.innerText = allCostsPrices
}

editCost = async (cost) => {
    cost.isEditing = true
    await changeCost(cost)
    await render()
}

cancelChanges = async (cost) => {
    cost.isEditing = false
    await changeCost(cost)
    await render()
}

saveChanges = async (cost) => {
    cost.location = inputEditLocation.value
    cost.price = inputEditPrice.value
    cost.isEditing = false
    await changeCost(cost)
    await render()
}

createButton = (name, cost) => {
    let button = document.createElement('button')

    let buttonsType = {
        'deleteCostButton': () => deleteOneCost(cost),
        'editCostButton': () => editCost(cost),
        'saveChangesButton': () => saveChanges(cost),
        'cancelChangesButton': () => cancelChanges(cost),
    }

    for (let key in buttonsType) {
        if (name === key) {
            button = document.createElement('div')
            button.onclick = buttonsType[key]
            button.className = key
        }
    }

    return button;
}

render = async () => {
    await getAllCosts();
    renderAllCostsPrices()

    let allCosts = document.getElementById('allCosts')

    while (allCosts.firstChild) {
        allCosts.removeChild(allCosts.firstChild)
    }

    costs.map(item => {
        let costContainer = document.createElement('div')
        let costLocation = document.createElement('span')
        let costDate = document.createElement('span')
        let costPrice = document.createElement('span')
        let deleteCostButton = createButton('deleteCostButton', item)
        let editCostButton = createButton('editCostButton', item)

        costContainer.className = 'costContainer'
        costLocation.className = 'costLocation'
        costPrice.className = 'costPrice'

        if (item.isEditing === true) {
            createEditArea(item)
            let editArea = document.createElement('div')
            let saveChangesButton = createButton('saveChangesButton', item)
            let cancelChangesButton = createButton('cancelChangesButton', item)
            editArea.className = 'editArea'
            editArea.appendChild(inputEditLocation)
            costDate.innerText = item.date
            editArea.appendChild(costDate)
            editArea.appendChild(inputEditPrice)
            editArea.appendChild(saveChangesButton)
            editArea.appendChild(cancelChangesButton)

            costContainer.appendChild(editArea)
        } else {
            costLocation.innerText = item.location
            costPrice.innerText = item.price
            costDate.innerText = item.date
            costContainer.appendChild(costLocation)
            costContainer.appendChild(costDate)
            costContainer.appendChild(costPrice)
            costContainer.appendChild(editCostButton)
            costContainer.appendChild(deleteCostButton)
        }
        allCosts.appendChild(costContainer)
        costID = item.id
    })

}
