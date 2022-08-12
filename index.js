const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "NICE", 
      "number": "69"
    }
]

app.get('/api', (request, response) => {
  response.send(persons);
})

app.get('/api/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(!person) {
    response.status(404).end()
    return
  }
  response.send(person)
})

app.delete('/api/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(!person) {
    response.status(404).end()
    return
  }
  persons = persons.filter(p => p.id !== id);
  response.status(204).end()
})

app.post('/api/', (request, response) => {
  const person = request.body;
  if(!person.name) {
    response.status(400).send('Name is not present!')
    return
  }
  if(!person.number) {
    response.status(400).send('Number is not present!')
    return
  }
  if(persons.find(p => p.name.toLowerCase().trim() === person.name.toLowerCase().trim()) !== undefined) {
    response.status(400).send(`${person.name} is already present!`)
    return  
  }
  const maxId = Math.max(...persons.map(p => p.id));
  person.id = maxId + 1;
  persons.push(person);
  response.status(201).send(person)
})

app.get('/api/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
