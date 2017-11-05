const expect = require("expect");
const request = require("supertest");

const {ObjectID: oid} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");

const todos = [{
        _id: new oid(),
        text: "first from test"
    },
    {
        _id: new oid(),
        text: "secnd from test",
        complete: true,
        completedAt: 332213
}];


beforeEach((done)=>{
    Todo.remove({})
        .then(()=>{
            return Todo.insertMany(todos);
        })
        .then(()=> done());
});


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