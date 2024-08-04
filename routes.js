const express = require('express');
const routes = express.Router();
const usuarioService = require('./src/services/usuarioService');

const UsuarioController = require('./src/controllers/UsuarioController');
const UrlController = require('./src/controllers/UrlController');
const usuarioController = new UsuarioController();
const urlController = new UrlController();
const routesUseAuthentication =[
    "/login",
    "/usuarios",
    "/encurtar-url",
    "/:urlEncurtada"
]
// Esse cara é um interceptor, ele intercepta todas as rotas e aqui podemos tomar qualquer ação antes de bater na rota especifica.
routes.use(async (req, res, next) =>{

    const { authorization } = req.headers;
    let autenticado = await usuarioService.validarAutenticacao(authorization);
    
    if(!autenticado && req.originalUrl.includes(routesUseAuthentication) && process.env.AUTENTICACAO != 'FALSE'){
        return res.status(401).json({
            status: 401,
            message:'Usuário não autenticado',
            name: 'NaoAutorizado'
        });
    }

    next();
 
});

// Rotas do usuário
routes.post("/login", usuarioController.login);
routes.post("/usuarios", usuarioController.cadastrar);
routes.put("/usuarios/:id", usuarioController.atualizar);

//Rotas do encurtador de Urls
routes.post('/encurtar-url', urlController.encurtarUrl);
routes.get('/buscarUrls', urlController.buscarUrls);
routes.put('/atualizarUrl/:id', urlController.atualizaUrl);
routes.delete('/deletarUrl/:id', urlController.deletarUrl);
routes.get('/:urlEncurtada', urlController.redirecionarUrl);

module.exports = routes;

