let inputCostLocation = null;
let inputCostDate = null;
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
    costID++
    cost.id = costID
    await fetch('http://localhost:8000/createnewcost', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .catch((error) => {
            console.log(error)
        })
    await render()
}

deleteCost = async (cost) => {
    fetch('http://localhost:8000/deletecost', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .catch((error) => {
            console.log(error)
        })
    await render()
}

changeCost = async (cost) => {

    fetch('http://localhost:8000/changecostinfo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
        body: JSON.stringify(cost),
    })
        .catch((error) => {
            console.log(error)
        })
    await render();
}

deleteAllCosts = async () => {
    await fetch('http://localhost:8000/deleteallcosts', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', "Accept": "application/json"},
    })
        .catch((error) => {
            console.log(error)
        })
    await render()
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
    inputCostLocation.value = ''
    inputCostDate.value = ''
    inputCostPrice.value = ''
    cost.location = ''
    cost.price = ''
    cost.date = ''
}

deleteOneCost = async (item) => {
    await deleteCost(item);
    await render()
}

summPrices = () => {
    let summ = 0;
    costs.forEach(item => summ += item.price)
    return summ
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
    cost.date = inputEditDate.value
    cost.price = inputEditPrice.value
    cost.isEditing = false
    await changeCost(cost)
    await render()
}

render = async () => {
    await getAllCosts();
    let allCosts = document.getElementById('allCosts')
    while (allCosts.firstChild) {
        allCosts.removeChild(allCosts.firstChild)
    }
    costs.map(item => {
        let costContainer = document.createElement('div')
        let costLocation = document.createElement('span')
        let costDate = document.createElement('span')
        let costPrice = document.createElement('span')
        let deleteCostButton = document.createElement('button')
        deleteCostButton.innerText = 'delete cost'
        deleteCostButton.onclick = () => deleteOneCost(item)
        let editCostButton = document.createElement('button')
        editCostButton.innerText = 'edit cost'
        editCostButton.onclick = () => editCost(item)

        if (item.isEditing === true) {
            inputEditLocation.type = "text"
            inputEditLocation.value = item.location
            inputEditDate.type = "date"
            inputEditDate.value = item.date;
            inputEditPrice.type = "Number"
            inputEditPrice.value = item.price
            let editArea = document.createElement('div')
            let saveChangesButton = document.createElement('button')
            saveChangesButton.innerText = 'save changes'
            saveChangesButton.onclick = () => saveChanges(item)
            let cancelChangesButton = document.createElement('button')
            cancelChangesButton.innerText = 'cancel changes'
            cancelChangesButton.onclick = () => cancelChanges(item)

            editArea.appendChild(inputEditLocation)
            editArea.appendChild(inputEditDate)
            editArea.appendChild(inputEditPrice)
            editArea.appendChild(saveChangesButton)
            editArea.appendChild(cancelChangesButton)
            costContainer.appendChild(editArea)
        }


        costLocation.innerText = item.location
        costDate.innerText = item.date
        costPrice.innerText = item.price
        costContainer.appendChild(costLocation)
        costContainer.appendChild(costDate)
        costContainer.appendChild(costPrice)
        costContainer.appendChild(deleteCostButton)
        costContainer.appendChild(editCostButton)
        allCosts.appendChild(costContainer)
        costID = item.id
    })
    summPrices()
}
