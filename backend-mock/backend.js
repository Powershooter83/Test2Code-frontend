const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());
let steps = 0;

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    if (steps < 5) {
      steps++;
      const jsonResponse = {
        successful: true,
        isLast: false,
        step: steps
      };
      res.write(`data: ${JSON.stringify(jsonResponse)}\n\n`);
    } else {
      const jsonResponse = {
        successful: true,
        isLast: true,
        code: `
public int add(int a, int b) {
    return a + b;
}
                  `,
        step: steps
      };
      clearInterval(interval);
      res.write(`data: ${JSON.stringify(jsonResponse)}\n\n`);
      res.end();
    }
  }, 1000);
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.post('/events', (req, res) => {
  res.status(200).send({message: 'Text empfangen'});
});
const versions = {
  Python: ['Python 3.6', 'Python 3.7', 'Python 3.8', 'Python 3.9']
};

app.get('/language/:lang', (req, res) => {
  const lang = req.params.lang;
  const langVersions = versions[lang];

  if (langVersions) {
    res.json(langVersions);
  } else {
    res.status(404).json({error: 'Sprache nicht gefunden'});
  }
});

const languages = ['Python', 'Test'];

app.get('/languages', (req, res) => {
  res.json(languages);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
