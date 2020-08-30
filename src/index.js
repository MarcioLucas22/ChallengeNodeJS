const express = require('express');
const { request, response } = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());

const repositories = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}]  ${url}`;

    console.log(logLabel);

    return next();
}

app.use(logRequests);

app.get('/repositories', (request, response) => {
    //const query = request.query;
    //console.log(query);

    return response.json(repositories);
});

app.post('/repositories', (request, response) => {
    const { title, url, techs, likes } = request.body;
    
    const repository = { id: uuid(), title, url, techs, likes };

    repositories.push(repository);

    return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
    const { id } = request.params;
    const { title, url, techs, likes } = request.body;
 
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    const repository = {
        id,
        title,
        url,
        techs,
        likes,
    };

    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex === -1) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    repositories[repositoryIndex] += 1; 

    return response.json(repositories[repositoryIndex]);
});

app.listen(3333, () => {
    console.log('BACK-END STARTED!');
});