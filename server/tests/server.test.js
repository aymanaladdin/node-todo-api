const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");


beforeEach((done)=>{
    Todo.remove({})
        .then(()=>{
            return Todo.insertMany([ {text: "first from test"}, {text: "secnd from test"} ])
        })
        .then(()=> done() );
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