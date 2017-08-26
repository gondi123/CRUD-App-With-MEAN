const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
mongoose.connect('mongodb://localhost/nodekb');

let db=mongoose.connection;


db.once('open',function(){
	console.log("it working");
});

db.on('error',function(err){
	console.log("error");
});


let Article=require('./model/article_one')

const app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));


app.get('/',function(req,res){
	
	/*let article=[{
		id:1,
		name:'jeevan',
		age:18
	},
	  { id:2,
		name:'xyz',
		age:20
		},
		{
		id:3,
		name:'abc',
		age:21
		}
		];
	*/
	Article.find({},function(err,articles){
		if(err){
			console.log(err);
		}
		else{
		res.render('index',{
		title:"Articles",
        articles:articles
	    });
		}
	});

});

app.post('/articles/add_article',function(req,res){
	
    let article=new Article();
	article.title=req.body.title;
	article.author=req.body.author;
	article.body=req.body.body;
	
	article.save(function(err){
		if(err){
			console.log();
			return;
		}else{
			res.redirect('/');
		}
	
	});
});

app.get('/article/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		
		res.render('article',{
		article:article
	  });
	});
});

app.get('/articles/add_article',function(req,res){
	
	
	res.render('add_article',{
		title:"Add Articles"
	});
});

app.get('/article/edit/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		
		res.render('edit_article',{
			title:"edit",
		   article:article
	  });
	});
});


app.post('/articles/edit/:id',function(req,res){
	
    let article={};
	article.title=req.body.title;
	article.author=req.body.author;
	article.body=req.body.body;
	
	let query={_id:req.params.id}
	Article.update(query,article,function(err){
		if(err){
			console.log();
			return;
		}else{
			res.redirect('/');
		}
	
	});
});


app.delete('/article/:id',function(req,res){
	
	let query={_id:req.params.id}
	Article.remove(query,function(err){
		if(err){
			console.log();
			return;
		}
		res.send("success");
	});
	
	
	
});


app.listen(8000,function(){
	console.log("server started");
});