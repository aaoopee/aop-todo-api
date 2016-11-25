var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    "dialect": "sqlite",
    "storage": __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize.sync({
    force: true
}).then(function() {
    console.log('Everything is synced.');

    Todo.create({
        description: "Do something completely different."
    }).then(function(todo) {
        return Todo.create({
            description: "And yet another!"
        });
    }).then(function () {
        return Todo.findAll({
            where: {
                description: {
                    $like: "%omp%"
                }
            }
        });
    }).then(function (todos) {
        if (todos) {
            todos.forEach(function(todo) {
                console.log(todo.toJSON());
            });
        } else {
            console.log("No todo found!");
        }

    }).catch(function (error) {
        console.log(error);
    });
});
