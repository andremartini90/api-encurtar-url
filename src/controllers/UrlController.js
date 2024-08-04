const ulrService = require('../services/urlService');
const { ModeloInvalidoErro , NaoEncontratoErro } = require('../erros/typeErros');
const UrlDTO = require('../dtos/UrlDTO');
const shortid = require("shortid");

class UrlController {
    async encurtarUrl(req, res){
        const { urlOriginal } = req.body;
        const { authorization } = req.headers;
        let credencial
       

        try {
            if (authorization) {
                credencial = await ulrService.obterUsuarioPorToken(authorization)
            }  
            if(!urlOriginal){
                throw new ModeloInvalidoErro(400, 'Erro o criar URL Encurtada! Url Não informada.')
            }
           
            let urlDTO = new UrlDTO();
            urlDTO.urlOriginal = urlOriginal
            urlDTO.usuarioId = (credencial ? credencial.usuario.id : null)
            urlDTO.urlEncurtada = await shortid.generate();
            urlDTO.modeloValidoCadastro();
            
            let urlEncurtada = await ulrService.encurtarUrl(urlDTO);
            return res.json(urlEncurtada);
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error);
        }

    }
    async buscarUrls(req, res) {
        const { authorization } = req.headers;
        
        try {
            const credencial = await ulrService.obterUsuarioPorToken(authorization)

            if(!credencial){
                throw new NaoEncontratoErro(404, 'Usuario não encontrado!')
            }
            let  urls = await ulrService.buscarUrlsPorUsuario(credencial.usuario.id);
            return res.json(urls);
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error);
        }
    }

    async atualizaUrl(req, res) {
        const { id } = req.params;
        const { urlOriginal } = req.body;
        const { authorization } = req.headers;
       

        try {
            const credencial = await ulrService.obterUsuarioPorToken(authorization)
            const url = await ulrService.buscarUrlPorId(id, credencial.usuario.id);
            
            if (!url) {
                throw new NaoEncontratoErro(404, 'Url não encontrada!')
            }
      
            await ulrService.atualizarUrl({ id: url.id, urlOriginal: urlOriginal });
            res.json({ message: 'URL atualizada!' });
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error);
        }
    }
    
    async deletarUrl(req, res) { 
        const { id } = req.params;
        const { authorization } = req.headers;
       

        try {
            const credencial = await ulrService.obterUsuarioPorToken(authorization)
            const url = await ulrService.buscarUrlPorId(id, credencial.usuario.id);
            if (!url) {
                throw new NaoEncontratoErro(404, 'Url não encontrada!')
            }
        
            url.dataInativacao = new Date();
            await ulrService.atualizarUrl({ id: url.id, dataInativacao:  url.dataInativacao });
            res.json({ message: 'URL Deletada!' });
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error);
        }
    }

    async redirecionarUrl(req, res) {
        const { urlEncurtada } = req.params;
        try {
            const url = await ulrService.buscarUrlEncurtada(urlEncurtada);
            if (!url) {
                 throw new NaoEncontratoErro(404, 'Url não encontrada!')
            }

            url.clicks += 1;
            await ulrService.atualizarUrl({ id: url.id, clicks: url.clicks });
            res.redirect(url.urlOriginal);
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error);
        }
    }
}


module.exports = UrlController;