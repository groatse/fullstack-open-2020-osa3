const express = require('express')
require('dotenv').config()
const app = express()
var morgan = require('morgan')
app.use(express.json()) 
app.use(morgan('tiny'))
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
const Note = require('./models/note')
app.use(express.static('build'))
app.use(express.json())


/*app.get('/info', (req, res) => {
  const people = Object.keys(puhlu).length
  const date = new Date()
  res.send('Phonebook has info for ' + people + ' people <br/><br/>' + date)
})*/

app.get('/api/persons', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {   
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)    
    
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' 
    })
  }
  const note = new Note({       
    name: body.name,
    number: body.number,     
  })
  note.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
  
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
