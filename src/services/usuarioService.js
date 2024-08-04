const Usuario = require('../models/Usuario');
const { ModeloInvalidoErro, NaoAutorizadoErro, NaoEncontratoErro, AplicacaoErro } = require('../erros/typeErros');
const geradorToken = require('../utils/geradorToken');
const usuarioCache = require('../cache/usuarioCache');
const UsuarioDTO = require('../dtos/UsuarioDTO');

async function validarUsuario(email, senha){

    email = email.toString().toLowerCase();
    let usuario = await Usuario.findOne({ where: { email }});
    
    senha = geradorToken.gerarHashDaSenha(senha);

    if(!usuario || (usuario.senha !== senha)){
        throw new NaoAutorizadoErro(401, "Usuário ou senha inválidos");
    }

    let credencial = _criarCredencial(usuario);

    return credencial;
}


async function validarAutenticacao(token){
    let credencial = usuarioCache.obterCredencialPorToken(token);
    let data = new Date();
    if(!credencial || credencial.dataExpiracao < data){

        if(credencial){
            usuarioCache.removerNoCache(credencial.token);
        }

        return false;
    }

    return true;
}

async function cadastrar(usuarioDTO){
    let existeUsuario = await Usuario.findOne({ where: { email:usuarioDTO.email } });

    if(existeUsuario){
        throw new ModeloInvalidoErro(400, "Usuario já cadastrado "+ usuarioDTO.email);
    }
    usuarioDTO.senha = geradorToken.gerarHashDaSenha(usuarioDTO.senha);

    let usuario = await Usuario.create(usuarioDTO);

    if(!usuario){
        throw new AplicacaoErro(500, 'Falha ao cadastrar o usuario');
    }

    let dto = new UsuarioDTO(usuario);
    dto.senha = undefined;

    return dto;
}

async function atualizar(usuarioDTO){

    let usuario = await Usuario.findByPk(usuarioDTO.id);

    if(!usuario){
        throw new NaoEncontratoErro(404, "Não foi possível encontrar o usuario pelo id "+ id);
    }
    usuarioDTO.senha = usuario.senha;

    usuario = await Usuario.update(usuarioDTO, 
        { where: { id: usuarioDTO.id }}
    );

    if(!usuario || !usuario[0]){
        throw new AplicacaoErro(500, 'Falha ao atualizar o usuario com id' + usuarioDTO.id);
    }

    usuarioDTO.senha = undefined;
    return usuarioDTO;
}

function _criarCredencial(usuario){
    let dataExpiracao = geradorToken.gerarDataExpiracao();

    let credencial = usuarioCache.obterCredencial(usuario);
    let data = new Date()
    if(credencial){
        if(credencial.dataExpiracao < data){
            usuarioCache.removerNoCache(credencial.token);
        }else{
            usuarioCache.atualizarDataExpiracao(credencial.token, dataExpiracao);
            return credencial;
        }
    }

    let token = geradorToken.criarToken(usuario);
    usuario.senha = undefined;

    credencial = { token, usuario:{...usuario.dataValues}, dataExpiracao };
    
    usuarioCache.adicionarNoCache(credencial);

    return credencial;
}


module.exports = {
    validarUsuario,
    validarAutenticacao,
    cadastrar,
    atualizar
}