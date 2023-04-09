import { Game , GlobalMessages } from '../../src/mvc/models';

// Note : this web socket logic is kinda secured 
// it wont work with tw0 browsers at the same time

const Message = ( webSocket ) => {

webSocket.on('imTyping' , ( name : any ) => {
  name && webSocket.broadcast.emit('isTyping' , `${name} is typing ...`);
  !name && webSocket.broadcast.emit('isTyping' , name);
})


  const sendToOthers = ( arr : any ) => {
    webSocket.broadcast.emit('getGlobalMessage' , arr);
  }

    webSocket.on('message' , ( data : any ) => {
  
      GlobalMessages.create(data).then(() => {
        GlobalMessages.find({}).then((messages: any) => {
          sendToOthers(messages);
          webSocket.emit('getGlobalMessage' , messages);
          });
      })
  
   })



}
 
let webSocket;

export function connected(socket){     
    webSocket = socket;
    Message(socket);
}


  let initNumber = 0;
  let update = null ;
  let realTimeNumber = 0;
  let closeTime ;

  const GenerateNewCloseTime = () => {
    return Math.round(Math.random() * 10 ) + 1;
  }

  const handleLoading = () => {
      let init = 7;
      let interval = setInterval(() => {
      webSocket.emit('loadingToStart' , init-- )
      init === -1 ? clearInterval(interval) : null;
    } , 1000 )
  }

  const countUp = async ( reset : boolean ) => { 
    if(reset){

      Game.update({ _id: "63c295dbc1ec60e40b39499a", gameValue: 0 }).exec().then(() => {
           setTimeout( () => handleUpdate(GenerateNewCloseTime()) , 10000)
       }); 
      realTimeNumber = 0;
      realTimeNumber = await Game.find({ _id: "63c295dbc1ec60e40b39499a" }).exec();
    }
    if(!reset){
       initNumber = await Game.find({ _id: "63c295dbc1ec60e40b39499a" }).exec();
       update = await Game.update({ _id: "63c295dbc1ec60e40b39499a", gameValue: +(initNumber[0].gameValue + 0.1 ).toFixed(1) }).exec();
       realTimeNumber = await Game.find({ _id: "63c295dbc1ec60e40b39499a" }).exec();
    }     
  }

    closeTime = GenerateNewCloseTime();


export const handleUpdate = ( closeTime ) => {
  console.log(`close at : ${closeTime}`)
 
  let interval : any = setInterval(function () {
     
    if( realTimeNumber &&  Math.trunc(realTimeNumber[0].gameValue) === 4 ){
        clearInterval(interval); 
        countUp(true);
        webSocket.emit('gameValue' , 'Expired');
        setTimeout(() => {
          handleLoading();
        } , 2000)  
        return
        }

    realTimeNumber && console.log(realTimeNumber[0].gameValue);
    webSocket && realTimeNumber && webSocket.emit('gameValue' , realTimeNumber[0].gameValue )
    
    countUp(false); 
    }, 300);
}

handleUpdate(closeTime);




