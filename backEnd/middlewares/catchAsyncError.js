//return using ES6 synax no need of calibracers and return statement

module.exports = func => (req, res, next) => 
     Promise.resolve(func(req, res, next)).catch(next)
