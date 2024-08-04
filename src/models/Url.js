const { Model, DataTypes } = require('sequelize');

class Url extends Model {
    static init(connection){

        super.init({
            usuarioId: DataTypes.INTEGER,
            urlOriginal: DataTypes.STRING,
            urlEncurtada: DataTypes.STRING,
            clicks: DataTypes.INTEGER,
            dataInativacao: DataTypes.DATE,
        },{
            sequelize: connection,
            schema: 'public',
            tableName: 'urls',
            createdAt: 'criadoEm',
            updatedAt: 'atualizadoEm',
            timestamps: true,
            underscored: false
        });
    }
}

module.exports = Url;