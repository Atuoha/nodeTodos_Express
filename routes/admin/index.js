const express = require('express'),
    app = express(),
    router = express.Router(),
    User = require('../../models/User'),
    Todo = require('../../models/Todo'),
    {signinAuth} = require('../../helpers/authenticate');


router.all('/*', signinAuth, (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})    


router.get('/', (req, res)=>{

    User.findOne({_id: req.user})
    .then(profile=>{

        Todo.find({user: req.user})
        .then(all_todos=>{
            let keys =  Object.keys(all_todos);
            let todosCount = keys.length

            Todo.find({user: req.user})
            .where('status').equals(false)
            .then(cancelled_todos=>{
                let cancel_keys = Object.keys(cancelled_todos)
                let cancelledCount = cancel_keys.length

                Todo.find({user: req.user})
                .where('completion_status').equals(false)
                .then(incomplete_todos=>{
                    let incomplete_keys = Object.keys(incomplete_todos)
                    let incompletedCount = incomplete_keys.length
                    

                    Todo.find({user: req.user})
                    .where('completion_status').equals(true)
                    .then(completed_todos=>{
                        let complete_keys = Object.keys(completed_todos)
                        let completedCount = complete_keys.length


                        // ADMIN RECORDS
                            Todo.find()
                            .then(all_todos=>{
                                let all_keys = Object.keys(all_todos)
                                let all_todosCount = all_keys.length


                                Todo.find()
                                .where('completion_status').equals(true)
                                .then(all_completed_todos=>{
                                    let all_complete_keys = Object.keys(all_completed_todos)
                                    let all_completedCount = all_complete_keys.length


                                    Todo.find()
                                    .where('completion_status').equals(false)
                                    .then(all_incompleted_todos=>{
                                        let all_incomplete_keys = Object.keys(all_incompleted_todos)
                                        let all_incompletedCount = all_incomplete_keys.length


                                        User.find()
                                        .then(users=>{
                                            let users_key = Object.keys(users);
                                            let userCount = users_key.length

                                            res.render('admin', {profile: profile, todosCount: todosCount, cancelledCount: cancelledCount, incompletedCount: incompletedCount, completedCount: completedCount, userCount: userCount, all_todosCount: all_todosCount, all_completedCount: all_completedCount, all_incompletedCount: all_incompletedCount });

                                        })
                                        .catch(err=>console.log(err))
    
                                    })
                                    .catch(err=>console.log(err)) 

                                })
                                .catch(err=>console.log(err))   

                            })
                            .catch(err=>console.log(err))
                        // 
                        
                        
                    })
                    .catch(err=>console.log(err))
                    
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
})




router.get('/about', (req, res)=>{
    res.render('admin/about');
})


module.exports = router;