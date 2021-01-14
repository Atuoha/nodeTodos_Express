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
    Todo.find()
    .then(todos=>{
        res.render('admin/todos', {todos: todos});
    })
    .catch(err=>console.log(err))
})



router.get('/cancelled', (req, res)=>{
    Todo.find({'status': 'cancelled'})
    .then(todos=>{
        res.render('admin/todos/cancelled', {todos: todos});
    })
    .catch(err=>console.log(err))
})


router.get('/completed', (req, res)=>{
    Todo.find({'status': 'completed'})
    .then(todos=>{
        res.render('admin/todos/completed', {todos: todos});
    })
    .catch(err=>console.log(err))
})


router.get('/incompleted', (req, res)=>{
    Todo.find({'status': 'incompleted'})
    .then(todos=>{
        res.render('admin/todos/incompleted', {todos: todos});
    })
    .catch(err=>console.log(err))
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

            if(todo.file !== 'image_place.png'){
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


module.exports = router;