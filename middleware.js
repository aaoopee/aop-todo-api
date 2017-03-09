var cryptojs = require('crypto-js');


module.exports = function(db) {
    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth') || '';

            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function(tokenInstance) {
                if(!tokenInstance) {
                    console.error('\nERROR: No matching token found.');
                    throw new Error();
                }

                req.token = tokenInstance;
                return db.user.findByToken(token);
            }).then(function(user) {
                console.log('\nUser: '+user);
                req.user = user;
                next();
            }).catch(function() {
                console.error('ERROR: Sending unauthorized.');
                res.status(401).send()
            });
        }
    }
}
