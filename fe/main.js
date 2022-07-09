import './style.css'
import {a} from './progresso'
const commandBox = document.getElementById('command')
const response = document.getElementById('response')

let previousCommand=[""]
let commandPointer=0
const escapeChar=';'

let elapsedTime=0;
let pomodoroTime=0
let pomodoroProj=0
let pomodoroData

const commands=['progresso','ar','spj','daily','monthly','duty','clear','pomodoro']
const backEnd = 'http://localhost:3002/' 

commandBox.focus();
commandBox.addEventListener('keydown',(e)=>{

        if(e.key=='ArrowUp'){
                if(previousCommand.length>commandPointer){
                        commandBox.value=previousCommand[commandPointer]
                        commandPointer++
                }else{
                        commandBox.value = ""
                }
        }

        if(e.key=='ArrowDown'){
                commandPointer--
                if(commandPointer>=0){
                        console.log(commandPointer)
                        commandBox.value=previousCommand[commandPointer]
                }else{
                        commandBox.value = ""
                        commandPointer=0
                }
        }

        if(e.key=='Enter'){
                a()
                const command = commandBox.value
                previousCommand.unshift(commandBox.value)

                console.log(previousCommand)
                commandBox.value=""
                
                const parsed=parseCommand(command);

                console.log(parsed)

                switch(parsed[0]){
                        case 0:
                                progresso(parsed)
                                break
                        case 1:
                                arvore(parsed)
                                break
                        case 2:
                                novo(parsed)
                                break
                        case 3:
                                daily(parsed,0)
                                break;
                        case 4:
                                daily(parsed,1)
                                break;
                        case 5:
                                duty(parsed)
                                break;
                        case 6:
                                document.location.reload()
                        case 7:
                                pomodoro(parsed)
                                break
                        case -1:
                                printCommand('Comando Não Encontrado')
                                break
                        default:
                                printCommand('Comando Não Encontrado')
                                break
                }
        }

})

//This function exhibits a project's tree from a given root
//The syntax is arvore name_root
const arvore = async (parsed)=>{
        
        if(parsed.length!=2){ 
                printCommand("Você precisa especificar o projeto desejado.")
                return
        }

        const response = await fetch(backEnd+'arvore',{
                method:'POST',
                body:JSON.stringify({root:parsed[1]}),
                headers:{
                        'Content-Type':'application/json'
                }
        })

        const json = await response.json();
        printCommand(JSON.stringify(json,null,4))
}

//This function measures the progress of some task tree given some root
//The syntax is 'progresso name_root' 
const progresso = async (parsed) => {
       
        if(parsed.length!=2){
                printCommand("Você precisa especificar o projeto desejado.")
                return
        }
        const response = await fetch(backEnd+'colheita',{
                method:'POST',
                headers:{
                        'Content-Type':'application/json'
                },
                body:JSON.stringify({root:parsed[1]})
        })

        const json = await response.json();

        printCommand(JSON.stringify(json,null,4))
}

//returns an array with the the first element being the commandNumber
//the following elements being arguments
//if the command does not exist, it returns -1 for the commandNumber
const parseCommand = (raw) =>{

        let returnMe=[];
        
        let spaces = raw.indexOf(' ')

        // no arguments
        if(spaces==-1){

                const commandNumber=commands.findIndex((n,i,arr)=>{
                        return n==raw
                })

                returnMe.push(commandNumber)

                return returnMe
        }

        const commandNumber=commands.findIndex((n,i,arr)=>{
                return n==raw.substring(0,spaces)
        })
        
        returnMe.push(commandNumber)
       
        let n=0;
        while(spaces!=-1){
                const pSpaces=spaces+1
                spaces=raw.indexOf(' ',pSpaces+1)

                if(spaces!=-1){
                        returnMe.push(raw.substring(pSpaces,spaces))
                }else
                        returnMe.push(raw.substring(pSpaces))
        }

        return returnMe

}

const printCommand = (result) =>{

        const newNode = document.createTextNode('->'+result)
        const newElement = document.createElement('pre')

        newElement.className='line'
        newElement.appendChild(newNode)

        response.appendChild(newElement)
        window.scrollTo(0,document.body.scrollHeight)
}

const list = async ()=>{

        const response = await fetch('http://localhost:3002/colheita',{
                method:'POST',     
                body:JSON.stringify(data),
                headers:{
                        'Content-Type':'application/json'
                }
})

        const json = await response.json()
        console.log(json)
}

const novo = (parsed)=>{
        
        const newStuff = ['ticar','novo','renomear','deletar']

        const option = newStuff.findIndex(n=>n==parsed[1])
        
        console.log(option)
        
        
        if(parsed.length<=2){
                switch(parsed[1]){
                        case 'novo':
                                printCommand("Você deve informar o nome seguido do id do pai do subprojeto.")
                                break
                        case 'ticar':
                                printCommand("Você deve informar o sub_id.");
                                break
                        case 'renomear':
                                printCommand("Você precisar informar o sub_id e o novo nome.")
                                break
                        case 'deletar':
                                printCommand("Você precisar informar o sub_id que deseja deletar.")
                                break

                }
                return
        } 

        let data;
        switch(option){
                case 0:
                        
                        if(isNaN(parsed[2])) {
                                printCommand("Você deve informar o sub_id.");
                                return
                        }

                        data ={
                                comando:0,
                                sub_id:parsed[2],
                        }
                        post(backEnd+'subprojs',data)
                        printCommand('Ticado:')
                        printCommand(JSON.stringify(data))
                        break;
                case 1:

                        if(parsed.length<4){
                                printCommand("Você deve informar o nome seguido do id do pai do subprojeto.")
                                return
                        } 

                        if(isNaN(parsed[3])) {
                                printCommand("Você deve informar o pai_id.");
                                return
                        }


                        data ={
                                comando:1,
                                nome:parsed[2].replaceAll(escapeChar,' '),
                                pai_id:parsed[3],
                        }

                        post(backEnd+'subprojs',data)
                        printCommand('Subprojeto:')
                        printCommand(JSON.stringify(data))
                        printCommand('Criado com sucesso!')
                        break;
                case 2:

                        if(parsed.length<4){
                                printCommand("Você deve informar o sub_id seguido do novo nome.")
                                return
                        } 

                        if(isNaN(parsed[2])) {
                                printCommand("Você deve informar o sub_id.");
                                return
                        }
                                
                        data ={
                                comando:2,
                                nome:parsed[3].replace(escapeChar,' '),
                                sub_id:parsed[2],
                        }

                        printCommand('Subprojeto:')
                        post(backEnd+'subprojs',data)
                        printCommand(JSON.stringify(data))
                        printCommand('Criado com sucesso!')
                        break
                case 3:
                        console.log('Hy!')
                        data = {
                                comando:3,
                                sub_id:parsed[2]
                        }
                        printCommand('Subprojeto:')
                        post(backEnd+'subprojs',data)
                        printCommand(JSON.stringify(data))
                        printCommand('Deletado com sucesso!')
                        break
                default:
                printCommand('Esses são os argumentos possíveis para o comando novo')                
                newStuff.forEach((each)=>{
                        printCommand(each)
                })
                        break;
        }

}

const daily = async (parsed,mode) =>{

        const commands = ['ticar','add','remove','rename']
        console.log(parsed)
        
        if(parsed.length==1){
                const data ={
                        mode:mode,
                        comando:0
                }
                        const response= await post(backEnd+'daily',data)
                console.log(data)
                response.forEach((item)=>{
                        const text = item.daily_id+'-'+item.nome+':'+item.complete
                        printCommand(text)
                })

                return

        }

        const option = commands.findIndex(n=>n==parsed[1])
        let data
        let response

        switch(option){

                case 0:
                if(isNaN(parsed[2])){
                        printCommand('Você precisa colocar o id que deseja ticar')
                        return
                }
                        let ids = []

                        for(let i=2;i<parsed.length;i++){
                                ids.push(parsed[i])
                        }
                        
                        data = {
                                mode:mode,
                                comando:1,
                                daily_id:ids
                        }

                        response= await post(backEnd+'daily',data)
                        printCommand('Ticado com sucesso!')
                        break
                case 1:
                        data = {
                                mode:mode,
                                comando:2,
                                nome:parsed[2].replaceAll(escapeChar,' '),
                                descricao:parsed[3].replaceAll(escapeChar,' ')
                        }
                       console.log(data) 
                        response= await post(backEnd+'daily',data)
                        printCommand('Criado com sucesso!')

                        break;

                case 2:
                        if(isNan(parsed[2])){
                                printCommand('Você precisa forncer o id.')
                                return
                        }

                        data = {
                                mode:mode,
                                comando:3,
                                daily_id:parsed[2],
                        }
                       
                        response= await post(backEnd+'daily',data)
                        printCommand('Removido com sucesso!')

                        break;
                default:
                        printCommand('A opção selecionada não existe')
        }
        }

const doneD = (parsed) => {
        if(parsed.length<2){
                printCommand('Você precisa informar o id da tarefa concluida')
        } 

        let done=parsed.slice(1)

        const data = {
                setDone:done
        }

        printCommand(JSON.stringify(data,null,4))
        
}

const doneM = (parsed) => {
        if(parsed.length<2){
                printCommand('Você precisa informar o id da tarefa concluida')
        } 

        let done=parsed.slice(1)

        const data = {
                setDone:done
        }

        printCommand(JSON.stringify(data,null,4))
        
}

const duty = async(parsed)=>{

        const data = {
                data:0
        }

        const response= await post(backEnd+'duty',data)

        printCommand('Nesse Mês Falta Fazer:')

        console.log(response.month)
        response.month.forEach((each)=>{
                printCommand(each.daily_id+'-'+each.nome)
        })

        printCommand('Hoje Falta Fazer:')

        console.log(response.month)
        response.day.forEach((each)=>{
                printCommand(each.daily_id+'-'+each.nome)
        })
}

//This function performs a post request on the 
//server, it requires 2 parameters the endpoint
//and the body content
const post = async (endpoint,data) => { 
        const response = await fetch(endpoint,{
                method:'POST',
                headers:{
                        'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
        })

        const json = await response.json()

        console.log(json)
        
        return json
}

const pomodoro = (parsed)=>{
        
        const commands = ['rest']

        if(parsed[1]=='rest'){

                pomodoroTime=5*60
                pomodoroData={
                        sub_id:-1,
                        time:pomodoroTime
                }

        }else{

                pomodoroProj=parsed[1]
                pomodoroTime = 25*60
                pomodoroData={
                        sub_id:pomodoroProj,
                        time:pomodoroTime
                }
        }


        
        const tomato = document.getElementById('tomato')
        tomato.style.visibility='visible'

        const interval = setInterval(()=>{

                elapsedTime++

                let formatedTime = elapsedTime
                let visibility 

                if(elapsedTime>60){
                 
                        const elapsedMinutes = Math.floor(elapsedTime / 60)
                        let elapsedSeconds = elapsedTime - elapsedMinutes*60

                        elapsedSeconds = '0'+elapsedSeconds

                        formatedTime = elapsedMinutes+':'+elapsedSeconds.slice(-2)
                     
                    
                }

                const clock = document.getElementById('elapsedTime')
                clock.innerHTML = formatedTime
                clock.style.visibility = visibility
                 
                console.log('tick')

                if(elapsedTime>pomodoroTime){
                        const doneAudio = new Audio('./assets/done.wav') 
                        doneAudio.play() 
                        printCommand("Time is up!!")
                        post(backEnd+'pomodoro',pomodoroData) 
                        clearInterval(interval)
                        elapsedTime=0
                        pomodoroData={}
                }
        },1000)

}
