const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const customRoutes = require('./routes.json');

server.use(jsonServer.rewriter(customRoutes));


server.use(middlewares);
server.use(jsonServer.bodyParser);

// ⚠️ Remplace '/pages' par l'URL exacte appelée par ton service Angular
server.post('/page', (req, res) => {
  const db = router.db; // Récupère la base de données
  const data = db.get('page').value(); // Récupère ton objet Spring (ajuste 'pages' si ton noeud s'appelle autrement dans db.json)

  // 1. On crée la nouvelle page avec un ID unique
  const newPage = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body
  };

  // 2. On l'ajoute à la fin du tableau 'content'
  data.content.push(newPage);

  // 3. On incrémente le total pour la p-table Angular !
  data.totalElements += 1;

  // 4. On force l'écriture dans le db.json
  db.set('page', data).write();

  // 5. On renvoie le succès au composant
  res.status(201).json(newPage);
});

// On laisse json-server gérer normalement les GET, PUT, DELETE...
server.use(router);

server.listen(3000, () => {
  console.log('🚀 JSON Server customisé tourne sur le port 3000');
});
