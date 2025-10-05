const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  const dbPath = path.join(process.cwd(), 'db.json');

  if (req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        const obj = JSON.parse(body);
        // basic validation
        if (!obj.name || !obj.message) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing name or message' }));
          return;
        }
        // read db
        let db = {};
        try {
          const txt = await fs.readFile(dbPath, 'utf8');
          db = JSON.parse(txt || '{}');
        } catch (e) {
          db = {};
        }
        // generate id
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
        db[id] = {
          id,
          name: obj.name,
          message: obj.message,
          image: obj.image || null,
          createdAt: new Date().toISOString()
        };
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ id }));
      });
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  } else if (req.method === 'GET') {
    try {
      const q = req.url.split('?')[1] || '';
      const params = new URLSearchParams(q);
      const id = params.get('id');
      if(!id){
        res.statusCode = 400;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ error: 'Missing id' }));
        return;
      }
      let db = {};
      try {
        const txt = await fs.readFile(dbPath, 'utf8');
        db = JSON.parse(txt || '{}');
      } catch (e) {
        db = {};
      }
      const item = db[id];
      if(!item){
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
      }
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify(item));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  } else {
    res.statusCode = 405;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
};
