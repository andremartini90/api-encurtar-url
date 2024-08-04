const { ModeloInvalidoErro } = require("../erros/typeErros");

module.exports = class UrlDTO {
    constructor(obj){
        obj = obj || {};
        this.id = obj.id;
        this.usuarioId = obj.usuarioId;
        this.urlOriginal = obj.urlOriginal;
        this.urlEncurtada = obj.urlEncurtada;
        this.clicks = obj.senha;
        this.dataInativacao = obj.dataInativacao;
        this.criadoEm = obj.criadoEm;
        this.atualizadoEm = obj.atualizadoEm;
    }


    modeloValidoCadastro(){
        let validacao = !!(this.urlOriginal && this.urlEncurtada);

        if(!validacao){
            throw new ModeloInvalidoErro(400, "Os campos urlOriginal, urlEncurtada são obrigatórios");
        }
    }

    modeloValidoAtualizacao(){
        let validacao = !!(this.usuarioId && this.urlOriginal && this.urlEncurtada);

        if(!validacao){
            throw new ModeloInvalidoErro(400, "Os campos usuarioId, urlOriginal, urlEncurtada são obrigatórios");
        }
    }
}