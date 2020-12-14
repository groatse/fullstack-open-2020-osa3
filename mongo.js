const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const nimim = process.argv[3]
const puhnumero = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@fullstackclusterw3.zr9zb.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  nimi: String,
  puhnum: String,  
})

const Note = mongoose.model('Note', noteSchema)

if (!nimim){
  console.log('phonebook:')
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note.nimi + ' ' + note.puhnum)
    })
    mongoose.connection.close()
  })
}

const note = new Note({
  nimi: nimim,
  puhnum: puhnumero,
})

if(nimim){
  note.save().then(response => {
    console.log('Added ' + nimim + ' number ' + puhnumero +' to phonebook')
    mongoose.connection.close()
  })
}