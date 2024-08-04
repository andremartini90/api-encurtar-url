const { ModeloInvalidoErro } = require("../erros/typeErros");

module.exports = class UsuarioDTO {
    constructor(obj){
        obj = obj || {};
        this.id = obj.id;
        this.nome = obj.nome;
        this.email = obj.email;
        this.senha = obj.senha;
        this.dataInativacao = obj.dataInativacao;
        this.criadoEm = obj.criadoEm;
        this.atualizadoEm = obj.atualizadoEm;
    }

    modeloValidoCadastro(){
        let validacao = !!(this.email && this.senha && this.nome);

        if(!validacao){
            throw new ModeloInvalidoErro(400, "Os campos nome, e-mail, senha são obrigatórios");
        }
    }

    modeloValidoAtualizacao(){
        let validacao = !!(this.id && this.email && this.nome);

        if(!validacao){
            throw new ModeloInvalidoErro(400, "Os campos id, nome, e-mail são obrigatórios");
        }
    }
}