var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
if (typeof process.env.DATABASE_URL === 'undefined') {
	var url = "sqlite://:@:/".match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
} else {
	var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
}
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment

// sequelize.sync() inicializa tabla de preguntas en la BD
sequelize.sync().then( function() {
	// then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then( function (count) {
		if( count===0 ) { // la tabla se inicializa sólo si está vacía
			Quiz.create({   
				pregunta: '"En lugar de" en inglés',
				respuesta: 'Instead',
				tema: 'otros' 
			});
			Quiz.create({   
				pregunta: '"En efecto" en inglés',
				respuesta: 'Indeed',
				tema: 'otros' 
			});
			Quiz.create({   
				pregunta: 'Autor de la Teoría de la Relatividad',
				respuesta: 'Einstein',
				tema: 'ciencia' 
			});
			Quiz.create({   
				pregunta: 'Bits en un byte',
				respuesta: '8',
				tema: 'tecnologia' 
			});
			Quiz.create({   
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'humanidades' 
			});
			Quiz.create({   
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'humanidades' 
			}).success(function(){ console.log('Base de datos inicializada')});
		};
	});
});

