const Url = require("../models/Url");
const { AplicacaoErro } = require("../erros/typeErros");
const usuarioCache = require('../cache/usuarioCache');
const UrlDTO = require('../dtos/UrlDTO');

async function encurtarUrl(urlDTO) {    
    const urlEncurtada = await Url.create(urlDTO);
    if (!urlEncurtada) {
        throw new AplicacaoErro(500, "Falha ao encurtar a Url!");
    }

    return urlEncurtada;
}

async function buscarUrlsPorUsuario(usuarioId) {
    const urls = await Url.findAll({
        where: { usuarioId: usuarioId, dataInativacao: null },
    });
   
    return urls;
}

async function buscarUrlPorId(urlId, usuarioId) {
    const url = await Url.findOne({ where: { id: urlId, usuarioId: usuarioId, dataInativacao: null }});
   
    return url;
}

async function buscarUrlEncurtada(urlEncurtada) {
    const url = await Url.findOne({ where: { urlEncurtada, dataInativacao: null } });
   
    return url;
}

async function atualizarUrl(urlDTO) {
    let url = await Url.update(urlDTO, 
        { where: { id: urlDTO.id }}
    );

    if(!url || !url[0]){
        throw new AplicacaoErro(500, 'Falha ao atualizar a URL com id ' + urlDTO.id);
    }

    return urlDTO;
}

async function obterUsuarioPorToken(token) {
    if (!token) {
        throw new AplicacaoErro(500, "token não informado!");
    }
    let credencial = usuarioCache.obterCredencialPorToken(token);
    
    return credencial;
}


module.exports = {
    encurtarUrl,
    buscarUrlsPorUsuario,
    buscarUrlPorId,
    buscarUrlEncurtada,
    atualizarUrl,
    obterUsuarioPorToken
};
