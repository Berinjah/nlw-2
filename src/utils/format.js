//dados que servem para substituir os números que foram definidos para aulas e dias da semana
const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Eduação física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química",
]
const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]

//subtrai um numero do subject pois ele foi definido para começar no 1 mas o array começa no zero
function getSubject(subjectNumber){
    const position = +subjectNumber - 1
    return subjects[position]
}

//converte horas em minutos
function convertHoursToMinutes(time){
    const [hours, minutes] = time.split(":")
    return Number((hours * 60) + minutes)
}

module.exports = {
    subjects,
    weekdays,
    getSubject,
    convertHoursToMinutes
}