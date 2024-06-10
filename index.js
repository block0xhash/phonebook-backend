const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(cors())

const PORT = process.env.PORT || 3001

// Define a custom token for Morgan to log request body
morgan.token('postData', (req) => {
    return JSON.stringify(req.body);
});

// Add Morgan middleware with 'tiny' configuration
app.use(morgan('tiny'));

// Add Morgan middleware with custom token to log request body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData', {
  skip: (req, res) => req.method !== 'POST' // Skip logging for non-POST requests
}));

// Middleware to parse JSON request bodies
app.use(express.json());

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
    }
];

// GET request to fetch all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// GET request to get information about the phonebook
app.get('/info', (req, res) => {
    const currentTime = new Date();
    const numberOfPersons = persons.length;

    const info = `
        <p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentTime}</p>
    `;

    res.send(info);
});

// GET request to get a specific person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

// DELETE request to delete a person by ID
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
});

// POST request to add a new person
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);

    res.json(newPerson);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
