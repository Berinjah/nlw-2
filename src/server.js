//servidor
const express = require("express")
const server = express()

//requisitanto funções das pages
const{pageLanding, pageStudy, pageGiveClasses, saveClasses} = require("./pages")

//configuração do nunjucks (template engine)
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

//inicio e configuração do servidor
server
//ajuste para receber os dados do re.body
.use(express.urlencoded({extended: true}))
//configurando os arquivos estáticos (css, scripts, imagens)
.use(express.static("public"))
//definição de rotas de aplicação
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)
//start do servidor
.listen(5500)