const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categorias")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/post', (req,res) => {
    res.render("admin/index")
})

router.post("/categorias/nova", (req,res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})

    }

    if(req.body.nome.lenght < 2){
        erros.push({texto: "nome da categoría é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            console.log("Categoria salva com sucesso!")
            req.flash("sucess_msg","Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tentar novamente")
            console.log("Erro ao salvar categoria!")
            res.redirect("/admin")
        })
    }
})

router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias",{categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg","Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/edit/:id',(req,res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", (req,res) =>{
    Categoria.findOne({_id: req.body.id}).then((categoria) =>{

        var erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
    
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug inválido"})
    
        }
    
        if(req.body.nome.lenght < 2){
            erros.push({texto: "nome da categoría é muito pequeno"})
        }
    
        if(erros.length > 0){
            res.render("admin/addcategorias",{erros: erros})
        }else{
            
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editadar com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("success_msg", "Houve um erro interno ao editar a categorias")
            res.redirect("/admin/categorias")
        })
    
        }
    }).catch((err) =>{
        req.flash("error_msg","houve um erro")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar",(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens",(req,res)=>{

    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) =>{
        res.render("admin/postagens",{postagens:postagens})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
    
})

router.get("/postagens/add",(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpostagem",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
   
})

router.post("/postagens/nova",(req,res)=>{
    console.log("chegou aqui24")
    var erros = []
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Título inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})

    }

    if(req.body.titulo.lenght < 2){
        erros.push({texto: "título da categoría é muito pequeno"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "descrição inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "conteúdo inválido"})

    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoría"})
    }

    if(erros.lenght > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso@")
            res.redirect("/admin/postagens")

        }).catch((err) =>{
            req.flash("error_msg","Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id",(req,res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render("admin/editpostagens",{categorias: categorias, postagem: postagem})
        }).catch((err) =>{
            req.flash("error_msg","Houve um erro ao listar as categorias")
            res.rediresct("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um erro ao carregar o formulário de edição")
    })

})

router.post("/postagens/edit", (req,res) =>{
    Postagem.findOne({_id: req.body.id}).then((postagem) =>{
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() =>{
                req.flash("success_msg","Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err)=>{
                req.flash("error_msg","Erro interno")
                res.redirect("/admin/postagens")
            })
    }).catch((err) => { 
        req.flash("error_msg", "Houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id",(req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg","Postagem deleta com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro interno")
        res.redirect("/admin/postagens")
    })
})

module.exports = router
