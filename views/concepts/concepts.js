const conceptSubmitBtn = document.getElementById('submitConceptBtn')
const submitChangesBtn = document.getElementById('submitEdit')

function createConcept(e) {
    e.preventDefault()
    document.getElementById('conceptsContainer').innerHTML = ''
    let conceptObj = {
        fName: document.getElementById('fName').value,
        email: document.getElementById('email').value,
        conceptName: document.getElementById('conceptName').value,
        conceptImage: document.getElementById('conceptImage').value,
        comments: document.getElementById('comments').value
    }
    if (checkInputs(conceptObj)) {
        axios.post('/conceptPost', conceptObj)
        .then(res => {
            data = res.data
        })
        document.getElementById('fName').value = ''
        document.getElementById('email').value = ''
        document.getElementById('conceptName').value = ''
        document.getElementById('conceptImage').value = ''
        document.getElementById('comments').value = ''
    }
    getConcepts(e)
}

function getConcepts(e) {
    e.preventDefault()
    axios.get('/getConcepts')
    .then(res => {
        data = res.data
        printToBrowser(data)
    })
}

function checkInputs(conceptObj) {
    let { fName, email, conceptName, conceptImage, comments } = conceptObj
    let message = `Submit your concept:`
    let response = true
    if (fName === '') {
        message += `\na first name`
        response = false
    }
    if (email === '') {
        message += `\nan email`
        response = false
    }
    if (conceptName === '') {
        message += `\nconcept name`
        response = false
    }
    if (conceptImage === '') {
        message += `\na draft image`
        response = false
    }
    if (comments === '') {
        message += `\ncomments`
        response = false
    }
    if (response === false) {
        alert(message)
    }
    return response
}

function deleteConcept(e) {
    e.preventDefault()
    document.getElementById('conceptsContainer').innerHTML = ''
    let id = e.target.getAttribute('backendId')
    axios.delete(`/deleteConcept/${id}`)
    .then(res => {
        data = res.data
    })
    document.getElementById('submitConceptBtn').classList.remove('hidden') // shows submit btn
    document.getElementById('submitEdit').classList.add('hidden') // hides submit changes btn

    document.getElementById('fName').value = ''
    document.getElementById('email').value = ''
    document.getElementById('conceptName').value = ''
    document.getElementById('comments').value = ''

    getConcepts(e)
}

function editConcept(e) {
    e.preventDefault()
    let id = e.target.getAttribute('backendIdToEdit')
    axios.get(`/editConcept/?id= ${id}`)
    .then(res => {
        data = res.data
        document.getElementById('fName').value = `${data[0].fName}`
        document.getElementById('email').value = `${data[0].email}`
        document.getElementById('conceptName').value = `${data[0].conceptName}`
        document.getElementById('grade').value = `${data[0].conceptImage}`
        document.getElementById('comments').value = `${data[0].comments}`

        document.getElementById('submitConceptBtn').classList.add('hidden') 
        document.getElementById('submitEdit').classList.remove('hidden') 
        document.getElementById(`edit${id}`).classList.add('hidden') 

        document.getElementById('submitEdit').setAttribute('current-id', id)
    })
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

function submitEdits(e) {
    e.preventDefault()
    document.getElementById('conceptsContainer').innerHTML = ''
    let id = e.target.getAttribute('current-id')
    let conceptObj = {
        fName: document.getElementById('fName').value,
        email: document.getElementById('email').value,
        conceptName: document.getElementById('conceptName').value,
        conceptImage: document.getElementById('conceptImage').value,
        comments: document.getElementById('comments').value
    }
    axios.put(`/submitEdits/${id}`, conceptObj)
    .then(res => {
        data = res.data
        document.getElementById('fName').value = ''
        document.getElementById('email').value = ''
        document.getElementById('conceptName').value = ''
        document.getElementById('conceptImage').value = ''
        document.getElementById('comments').value = ''

        document.getElementById('submitConceptBtn').classList.remove('hidden') 
        document.getElementById('submitEdit').classList.add('hidden') 
    })
    getConcepts(e)
}

function printToBrowser(data) {
    for (let i = 0; i < data.length; i++) {
        let loggedConcept = document.createElement('div')
        loggedConcept.setAttribute('class', 'conceptDivs')
        loggedConcept.innerHTML = `
        <div id="innerCardTop">
            <p id="cardName">${data[i].fName} ${data[i].email}</p>
        </div>
        <div id="innerCardMid">
            <h2 id="cardConceptName">${data[i].concept_name}</h2><br>
        </div>
        <div id="innerCardImage">
            <img id='cardImage' src="${data[i].image}" alt='user image here' style='max-width:100%;max-height:100%;'>
        </div>
        <div id="innerCardBottom">
            <p id="cardComments">Comments: ${data[i].comments}</p>
        </div>
        <div class="innerCardBtns" id="innerCardBtns${data[i].id}">
        </div>
        `
        document.getElementById('conceptsContainer').appendChild(loggedConcept)

        let editBtn = document.createElement('button')
        editBtn.id='edit' + data[i].id
        editBtn.setAttribute('backendIdToEdit', data[i].id) 
        editBtn.innerHTML = 'Edit'
        editBtn.addEventListener('click', editConcept)
        document.getElementById(`innerCardBtns${data[i].id}`).appendChild(editBtn)

        let deleteBtn = document.createElement('button')
        deleteBtn.id='delete' + data[i].id
        deleteBtn.setAttribute('backendId', data[i].id)
        deleteBtn.innerHTML = 'Delete'
        deleteBtn.addEventListener('click', deleteConcept)
        document.getElementById(`innerCardBtns${data[i].id}`).appendChild(deleteBtn)
    }
}

conceptSubmitBtn.addEventListener('click', createConcept)
submitChangesBtn.addEventListener('click', submitEdits)
window.addEventListener('load', getConcepts)