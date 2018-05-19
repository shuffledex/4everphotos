var express = require('express');
var router = express.Router();

router.get('/:address', function(req, res, next) {
  res.render('book', { address: req.params.address });
});

module.exports = router;