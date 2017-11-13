const expect = require("expect");
const request = require("supertest");

const {ObjectID: oid} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");

const {users, todos, seedUsers, seedTodos} = require('./seed/seed');

beforeEach(seedUsers);

beforeEach(seedTodos);


describe("POST /todos", ()=>{

    it("Should create new TODO", (done)=>{
        const text = "Another Test From Mocha"
        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }
                
                Todo.find({text})
                    .then((docs)=>{
                        expect(docs.length).toBe(1);
                        done();
                      })
                    .catch((err)=>{ done(err); });
            });
        })
    ;


    it("Should fail to create new TODO", (done)=>{
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err) return done(err);

                Todo.find()
                .then((docs)=>{
                    expect(docs.length).toBe(2);
                    done();
                  })
                .catch((err)=>{ done(err); });
            });
        })
    ;

});

describe("GET /todos", ()=>{
    it("Should get all todos", (done)=>{
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
        ;
    });
});

describe("GET /todos/:id", ()=>{

    it("Should return a todo doc",(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
        })
    ;

    it("Should return 404 if doc not found", (done)=>{
        let id = new oid();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
        })
    ;

    it("Should return 404 if id is not valid", (done)=>{
        let id = 12345
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
        ;
    });

});

describe("DELETE /todos/:id", ()=>{
    it("Should remove todo", (done)=>{
        let id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

                Todo.findById(id)  
                    .then((todo)=>{
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err)=>{
                        done(err);
                    })
                ;
            })
        ;
    });

    it("Should return 404 if todo not found", (done)=>{
        let id = new oid().toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
        ;
    });

    it("Should return 404 if id is not valid", (done)=>{
        let id = "123abc"
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
        ;
    });
});

describe("PATCH /todos/:id", ()=>{
    it("Should update the todo", (done)=>{
        let id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text: "Completed :D", complete: true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe("Completed :D");
                expect(res.body.todo.completedAt).toBeA("number");
                expect(res.body.todo.complete).toBe(true);
            })
            .end(done);
    });
    
    it("Should clear completedAt when todo isn't complete", (done)=>{
        
        let id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text: "Not Completed :D"})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe("Not Completed :D");
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.complete).toBe(false);
            })
            .end(done);
            // .end((err, res)=>{
            //     if(err) return done(err);

            //     Todo.findById(id)
            //         .then((todo)=>{
            //             expect(todo.text).toBe("Not Completed :D");
            //             expect(todo.completedAt).toNotExist();
            //             done();                
            //         })
            //         .catch((err)=> done(err))
            //     ;
            // })
    });

    it("Should return 400 for todo validation error", (done)=>{
        let id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text:""})
            .expect(400)
            .end(done);
    });

    it("Should return 404 if todo not found", (done)=>{
        let id = new oid().toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
        ;
    });

    it("Should return 404 if id is not valid", (done)=>{
        let id = "123abc"
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
        ;
    });
});

describe('GET /users/me', ()=>{
    it('Should retuen a user if authenticated', (done)=>{
        let token = users[0].tokens[0].token;
        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
        })
    ;

    it('Should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
        })
    ;
});

describe('POST /users', ()=>{
    it('Should create new user', (done)=>{
        const email = 'test@example.com';
        const password = '1234567'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.header['x-auth']).toExist();
                expect(res.body.email).toBe(email);
                expect(res.body.password).toNotBe(password);
            })
            .end((err)=>{
                if(err) return done(err);

                User.findOne({email})  
                    .then((user)=>{
                        expect(user).toExist();
                        expect(user.tokens[0].access).toBe('auth');
                        done();
                    })
                    .catch((err)=> done(err));
                })
            ;
        ;
    });

    it('Should return validation error', (done)=>{
        const email = 'testexample.com';
        const password = '1234'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
        ;
    });

    it('Should fail to create user with email in use',(done)=>{
        const email = users[0].email;
        const password = '123456'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
        ;
    });

});

describe('POST /users/login', ()=>{
    it("Should login user and return auth token", (done)=>{
        request(app)
            .post("/users/login")
            .send(users[1])
            .expect(200)
            .expect((res)=>{
                expect(res.header["x-auth"]).toExist();
                expect(res.body.email).toBe(users[1].email)
            })
            .end((err, res)=>{
                if(err) return done(err);

                User.findById(users[1]._id)
                    .then((user)=>{
                        expect(user.tokens[0]).toInclude({access: "auth", token: res.header['x-auth']});
                        done();
                    })
                    .catch((err)=> done(err))
                ;
            })
        ;    
    });


    it("Should fail to login if email not exist", (done)=>{
        request(app)
            .post('/users/login')
            .send({email:"a@b.com", password: "333333333"})
            .expect(400)
            .expect((res)=>{
                expect(res.body.error).toBe("Invalid Email")
            })
            .end(done)
        ;

    });

    
    it("Should fail to login if password not match", (done)=>{
        request(app)
        .post('/users/login')
        .send({email:users[1].email, password: "333333333"})
        .expect(400)
        .expect((res)=>{
            expect(res.body.error).toBe("Password not Match!")
        })
        .end(done);

    });
});