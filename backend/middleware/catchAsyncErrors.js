module.exports = (entityFunc) => (req, res, next) => {
    Promise.resolve(entityFunc(req, res, next)).catch(next);
};