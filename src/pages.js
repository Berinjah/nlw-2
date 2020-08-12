const database = require("./database/db")
const {proffys, subjects, weekdays, getSubject, convertHoursToMinutes} = require("./utils/format")

//funcionalidades das pages
function pageLanding(req, res){
    return res.render("index.html")
}

async function pageStudy(req, res){
    const filters = req.query

    if(!filters.subject || !filters.weekday || !filters.time){ //se alguma informação vier vazia ele retorna para a page sem retornar nenhuma informação de professores
        return res.render("study.html", {filters, subjects, weekdays})
    }

    //conversão horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    //query que faz a consulta baseada nas informações que o aluno inseriu no site
    const query = `
        SELECT classes.*, proffys.* 
        FROM proffys 
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = "${filters.subject}"
    `
    //tratamento de erros caso a consulta dê errado
    try {
        const db = await database
        const proffys = await db.all(query)

        proffys.map((proffy) =>{
            proffy.subject = getSubject(proffy.subject)
        })
        return res.render("study.html", {proffys, filters, subjects, weekdays})
    } catch (error) {
        console.log(error)
    }
}

function pageGiveClasses(req, res){
    
    return res.render("give-classes.html", {proffys, subjects, weekdays})    
}

async function saveClasses(req, res){ //função utilizada para salvar as informações e aulas dos professores
    const createProffy = require("./database/createProffy")
    
    proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio,
    }
    classValue = {
        subject: req.body.subject,
        cost: req.body.cost,
    }
    classScheduleValues = req.body.weekday.map((weekday, index) =>{
        return{
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {
        const db = await database
        await createProffy(db, {proffyValue, classValue, classScheduleValues})

        let queryString = "?subject=" + req.body.subject //redireciona para a página study e apresenta na página as informações que o professores acabou de cadastrar
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study" + queryString)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}