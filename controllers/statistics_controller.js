var models = require('../models/models.js');
var Sequelize = require('sequelize');
var statistics = [];

// GET /quizes/statistics
exports.obtain  = function(req, res, next) {

	models.Quiz.count().then( 
		function(count) {
            		statistics[0] = { texto: "Número de preguntas", count: count };
		}).catch(function(error){next(error)});

	models.Comment.count().then( 
		function(count) {
			statistics[1] = { texto: "Número de comentarios", count: count };
			statistics[2] = { texto: "Número  medio de comentarios por pregunta", count: (count / statistics[0].count).toFixed(2) };
		}).catch(function(error){next(error)});

	models.Comment.findAll({
			attributes: ["QuizId"],
			where: { QuizId: {$ne: null}},
    			group: ["QuizId"]
		}).then( function(count) {
			statistics[3] = { texto: "Número  de preguntas sin comentarios", count: (statistics[0].count - count.length)};
    			statistics[4] = { texto: "Número  de preguntas con comentarios", count: count.length};
    		}).catch(function(error){next(error) //});
		}).finally(function() { next() });

/*
	models.Quiz.count().then(
		function(count) {
            		statistics[0] = { texto: "Número de preguntas", count: count };
    			return models.Comment.count();
	}).then(
		function(count) {
			statistics[1] = { texto: "Número de comentarios", count: count };
			statistics[2] = { texto: "Número  medio de comentarios por pregunta", count: (count / statistics[0].count).toFixed(2) };
			return models.Comment.findAll({
				attributes: ["QuizId"],
				where: { QuizId: {$ne: null}},
    				group: ["QuizId"] });
	}).then(
		function(count) {
			statistics[3] = { texto: "Número  de preguntas sin comentarios", count: (statistics[0].count - count.length)};
    			statistics[4] = { texto: "Número  de preguntas con comentarios", count: count.length};
	}).catch(function(error){next(error)
	}).finally(function() { next() });
*/

}

// GET /quizes/statistics
exports.show = function(req, res) {
	res.render('quizes/statistics.ejs', { statistics: statistics, errors: [] });
}
