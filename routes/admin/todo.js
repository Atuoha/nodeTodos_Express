const express = require('express'),
    app = express(),
    router = express.Router(),
    Todo = require('../../models/Todo'),
    User = require('../../models/User'),
    faker = require('faker'),
    fs = require('fs'),
    {isEmpty} = require('../../helpers/upload-helpers');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})    


router.get('/', (req, res)=>{
    
    if(req.user.role == 'Admin'){
        Todo.find()
        .then(todos=>{
            res.render('admin/todos', {todos: todos});
        })
        .catch(err=>console.log(err))

    }else{
        Todo.find({user: req.user})
        .then(todos=>{
            res.render('admin/todos', {todos: todos});
        })
        .catch(err=>console.log(err))
    }

})



router.get('/cancelled', (req, res)=>{

    if(req.user.role == 'Admin'){
        Todo.find()
        .where('status').equals(false)
        .then(todos=>{
            res.render('admin/todos/cancelled', {todos: todos});
        })
        .catch(err=>console.log(err))

    }else{
        Todo.find({user: req.user})
        .where('status').equals(false)
        .then(todos=>{
            res.render('admin/todos/cancelled', {todos: todos});
        })
        .catch(err=>console.log(err))
    }

   
})


router.get('/completed', (req, res)=>{

    if(req.user.role == 'Admin'){
        Todo.find()
        .where('completion_status').equals(true)
        .then(todos=>{
            res.render('admin/todos/completed', {todos: todos});
        })
        .catch(err=>console.log(err))

    }else{
        Todo.find({user: req.user})
        .where('completion_status').equals(true)
        .then(todos=>{
            res.render('admin/todos/completed', {todos: todos});
        })
        .catch(err=>console.log(err))
    }

})


router.get('/incompleted', (req, res)=>{


    if(req.user.role == 'Admin'){
        Todo.find()
        .where('completion_status').equals(false)
        .then(todos=>{
            res.render('admin/todos/incompleted', {todos: todos});
        })
        .catch(err=>console.log(err))

    }else{
        Todo.find({user: req.user})
        .where('completion_status').equals(false)
        .then(todos=>{
            res.render('admin/todos/incompleted', {todos: todos});
        })
        .catch(err=>console.log(err))
    }
 
})

router.get('/create', (req, res)=>{
    res.render('admin/todos/create');
})


router.get('/dummy', (req, res)=>{
    res.render('admin/todos/dummy');
})


router.get('/edit/:slug', (req, res)=>{
    Todo.findOne({slug: req.params.slug})
    .then(todo=>{
        res.render('admin/todos/edit', {todo: todo});
    })
    .catch(err=>console.log(err))
})


router.get('/show/:slug/', (req, res)=>{
    Todo.findOne({slug: req.params.slug})
    .then(todo=>{
        res.render('admin/todos/show', {todo: todo});
    })
    .catch(err=>console.log(err))
})



router.post('/create', (req, res)=>{

    Todo.findOne({subject: req.body.subject})
    .then(todo=>{
        if(todo){
            if(todo.status === 'active'){
                req.flash('error_msg', 'Subject already exists with a todo that is active')
                res.redirect('back');
            }else{
                req.flash('error_msg', 'Subject already exists with a todo that is inactive')
                res.redirect('back');
            }
        }else{

            let filename = ''
            if(!isEmpty(req.files)){
                const file = req.files.file;
                filename = Date.now() + '-' + file.name;
                const uploadDir = './public/uploads/';
                file.mv(uploadDir + filename, err=>{
                    if(err)console.log(err)
                })
            }

            const newTodo = new Todo({
                subject: req.body.subject,
                date: req.body.date,
                file: filename,
                user: req.user,
                note: req.body.note
            })

            newTodo.save()
            .then(response=>{
                req.flash('success_msg', 'Todo saved successfully :)');
                res.redirect('/admin/todos');
            })
            .catch(err=>console.log(err))

        }
    })
    .catch(err=>console.log(err))
})


router.put('/update/:slug', (req, res)=>{

    Todo.findOne({slug: req.params.slug})
    .then(todo=>{

        let filename = todo.file
        if(!isEmpty(req.files)){
            const file = req.files.file;
            filename = Date.now() + '-' + file.name
            const uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, err=>{
                if(err)console.log(err);
            })

            if(todo.file !== 'img_place.png'){
                fs.unlink(uploadDir + todo.file, err=>{
                    if(err)console.log(err);
                })
            }
        }

        todo.subject = req.body.subject;
        todo.note = req.body.note;
        todo.date = req.body.date;
        todo.file = filename;
        todo.save()
        .then(response=>{
            req.flash('success_msg', 'Successfully updated todo :)');
            res.redirect('/admin/todos');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



router.put('/status/:slug', (req, res)=>{
    Todo.findOne({slug: req.params.slug})
    .then(todo=>{
        todo.status = req.body.status;
        todo.save()
        .then(response=>{
            req.flash('success_msg', 'Successfully updated todo :)');
            res.redirect('/admin/todos');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.put('/completion_status/:slug', (req, res)=>{
    Todo.findOne({slug: req.params.slug})
    .then(todo=>{
        todo.completion_status = req.body.completion_status;
        todo.save()
        .then(response=>{
            req.flash('success_msg', 'Successfully updated todo :)');
            res.redirect('/admin/todos');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})




router.post('/dummy', (req, res)=>{
    for(let i = 0; i < req.body.number; i++){

        const newTodo = new Todo({
            subject: faker.name.title(),
            date: new Date,
            completion_status: faker.random.boolean(),
            status: faker.random.boolean(),
            file: 'img_place.png',
            user: req.user,
            note: faker.lorem.sentence()
        })

        newTodo.save()
        .then(response=>{
            req.flash('success_msg', `${req.body.number} dummy todos saved :)`);
            res.redirect('/admin/todos');
        })
        .catch(err=>console.log(err))
    }
})




router.delete('/delete/:slug', (req, res)=>{
    Todo.findOne({slug: req.params.slug})
    .then(todo=>{
        if(todo.file !== 'img_place.png'){
            let delDir = './public/uploads/';
            fs.unlink(delDir + todo.file, err=>{
                if(err)console.log(err);
            })
        }

        todo.delete()
        .then(response=>{
            req.flash('success_msg', 'Todo deleted successfully :)');
            res.redirect('/admin/todos')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



router.post('/multiaction', (req, res)=>{

    if(!req.body.checkboxes){
        req.flash('error_msg', 'No input checkboxes ):');
        res.redirect('back');
    }

    Todo.find({_id: req.body.checkboxes})
    .then(todos=>{
        todos.forEach(todo=>{
            if(req.body.action == 'incomplete'){
                todo.completion_status = false;
                todo.save()
                .then(response=>{
                    req.flash('success_msg', 'Todos completion status changed to incompleted');
                    res.redirect('/admin/todos/incompleted');
                })
            }else if(req.body.action == 'complete'){
                todo.completion_status = true;
                todo.save()
                .then(response=>{
                    req.flash('success_msg', 'Todos completion status changed to completed');
                    res.redirect('/admin/todos/completed');
                })
            }else if(req.body.action == 'retrieve'){
                todo.status = true
                todo.save()
                .then(response=>{
                    req.flash('success_msg', 'Todos status changed to active');
                    res.redirect('/admin/todos');
                })
            }else if(req.body.action == 'cancel'){
                todo.status = false
                todo.save()
                .then(response=>{
                    req.flash('success_msg', 'Todos status changed to inactive');
                    res.redirect('/admin/todos');
                })
            }else if(req.body.action == 'delete'){
                if(todo.file !== 'img_place.png'){
                    let delDir = './public/uploads/';
                    fs.unlink(delDir + todo.file, err=>{
                        if(err)console.log(err);
                    })
                }
        
                todo.delete()
                .then(response=>{
                    req.flash('success_msg', 'Todo deleted successfully :)');
                    res.redirect('/admin/todos')
                })
                .catch(err=>console.log(err))
            }else{
                req.flash('success_msg', 'No operation to be handled :)');
                res.redirect('/admin/todos')
            }
        })
    })
    .catch(err=>console.log(err))
})



router.post('/search', (req, res)=>{
    let name =  req.body.searched
    let regex = new RegExp(name, 'i')
  
    Todo.find({'$or': [{'subject': regex}]})
    .then(todos=>{
        let keys =  Object.keys(todos);
        let todosCount = keys.length;
        res.render('admin/todos/searched', {todos: todos, todosCount: todosCount});
    })
    .catch(err=>console.log(err))
})



module.exports = router;