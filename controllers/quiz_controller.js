var models = require('../models/models.js');
var Sequelize = require('sequelize');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(function(quiz) {
      		if (quiz) {
      		  req.quiz = quiz;
       		 next();
      		} else { next(new Error('No existe quizId=' + quizId))}
   	}).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {  
	console.log("En GET /quizes: exports.index");
	var filtro = '%';
	if (typeof req.query.search !== 'undefined') {
		filtro = '%'+req.query.search.toLowerCase().replace(/ +/g,'%')+'%';
	};
	models.Quiz.findAll({
			where: Sequelize.or(
				[ "lower(pregunta) like ? ", filtro ],
				{ tema: filtro.replace(/%/g,'') }
			), 
			order: 'pregunta ASC'
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
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"}
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
			quiz.save({ fields: ["pregunta", "respuesta", "tema"] }).then(function() {
				res.redirect('/quizes');
			})	// Redirección HTTP (URL relativo) a lista de preguntas
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;	// Autoload de instancia de quiz
        res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then( function(err) {
		if (err) {
			res.render('quizes/edit', {quiz: quiz, errors: err.errors});
		} else {
			// Guarda en la BD los campos pregunta y respuesta del objeto quiz
			req.quiz.save({ fields: ["pregunta", "respuesta", "tema"] }).then(function() {
				res.redirect('/quizes');
			})	// Redirección HTTP (URL relativo) a lista de preguntas
		}
	});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
 	}).catch(function(error){next(error)})
};

// GET /author
exports.author = function(req, res) {
	res.render('author', {autor: 'J. Daniel Vila', errors: []});
};
