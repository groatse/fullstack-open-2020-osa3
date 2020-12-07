const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json()) 
app.use(morgan('tiny'))
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
let puhlu = [
    {
        id: 1,
        name: "Arto",
        number: "040-123456"      
    },
    {
       id: 2,
       name: "Ada",
       number: "39-44-5323523"      
    },
    {
        id: 3,
        name: "Dan",
        number: "12-43-234345"      
    },
    {
        id: 4,
        name: "Mary",
        number: "39-23-6423122"     
    }
  ]


   
  app.get('/info', (req, res) => {
    const people = Object.keys(puhlu).length
    const date = new Date()
    res.send('Phonebook has info for ' + people + ' people <br/><br/>' + date)
  })

  app.get('/api/persons', (req, res) => {
    res.json(puhlu)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const puh = puhlu.find(puh => puh.id === id)
    
    if (puh) {
        response.json(puh)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    puhlu = puhlu.filter(note => note.id !== id)
  
    response.status(204).end()
  })


  app.post('/api/persons', (request, response) => {
    const body = request.body
    const nimet = body.name
    console.log(body)
    
    const nimimats = puhlu.find(puh => puh.name === nimet)
    

    if (nimimats){
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    const puh = {
        id: generateId(),
        name: body.name,
        number: body.number,      
     
    }
  
    puhlu = puhlu.concat(puh)
  
    response.json(puh)
  })

  function generateId() {    
    return Math.floor(Math.random() * (100000000));
  }

  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })