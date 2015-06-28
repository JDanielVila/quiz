var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId))}
    }).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {  
	var filtro = '%';
	if (typeof req.query.search !== 'undefined') {
		filtro = '%'+req.query.search.toLowerCase().replace(/ +/g,'%')+'%';
	};
	models.Quiz.findAll({
			where:[ "lower(pregunta) like ? ", filtro ], order:'pregunta ASC'
		}).then( function(quizes) {
                       	res.render('quizes/index.ejs', {quizes: quizes, errors: []});
       		}).catch(function(error){next(error)}
	);
};

// GET /quizes/:id
exports.show = function(req, res) {
  	res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
  	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(	// Crea objeto quiz no persistente
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);	
        res.render('quizes/new', {quiz: quiz, errors: []});
};

// GET /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(	// Inicializa objeto quiz no persistente
		req.body.quiz
	);
	quiz.validate().then( function(err) {
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// Guarda en la BD los campos pregunta y respuesta del objeto quiz
			quiz.save({ fields: ["pregunta", "respuesta"] }).then(function() {
				res.redirect('/quizes');
			})	// Redirección HTTP (URL relativo) a lista de preguntas
		}
	});
};

// GET /author
exports.author = function(req, res) {
	res.render('author', {autor: 'J. Daniel Vila', errors: []});
};
