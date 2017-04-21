window.onload = function(){ let interval = null;

 document.querySelector("title").innerHTML = "pomodoro";

 const downs = document.querySelectorAll(".down");
 const ups = document.querySelectorAll(".up");
 const options = document.querySelectorAll(".option");
 const current = document.querySelector("#current");
 downs.forEach(down => down.innerHTML="\u23F7");
 ups.forEach(up => up.innerHTML="\u23F6");

 options.forEach(function(option){
  switch (option.dataset.name) {
   case "pause":
       option.innerHTML = "\u23f8";
       break;

   case "start":
            option.innerHTML = "\u23F5";
            break;
   case "reset":
          option.innerHTML = "\u25FC";
          break;
     default:

   }
 })

 let buttons = document.querySelectorAll(".button")

 const SESSIONS = document.querySelectorAll("button[data-type=session]");
 const  BREAKS  =document.querySelectorAll("button[data-type=break]");
 const CONTROLS = document.querySelectorAll(".option[data-type=control]");
 const CLOCK = document.querySelector(".clock .value");

//add buttons and icons to the main page
buttons.forEach(button => button.addEventListener("click",handlerClick));
addButtons(SESSIONS);
addButtons(BREAKS);

function selectValue(type){
  return document.querySelector(`.value[data-type=${type}]`);
}

function addButtons(elements){
  elements.forEach( elt => {
    if (elt.dataset.name === "value") return ;
    elt.addEventListener("mousedown", handlerClick);
  })
}

//add event listener for the buttons increase or decrease time
function handlerClick(event){
 let name = this.dataset.name;
 // console.log(this.dataset.type);
 let valueElement  = selectValue(this.dataset.type);
 let value = Number(valueElement.innerHTML);
 switch (name) {
   case "up":
      valueElement.innerHTML= value + 1 ;
     break;
   case "down" :
     valueElement.innerHTML= value -1 ;
     break;
  }
 }

//current can be "session" or "break"
let value= {current : "" ,time : {m :0 , s :0 } };

// add event listener  for the main control : start stop reset  pause
CONTROLS.forEach(control => control.addEventListener("click",function(event){
  let name = control.dataset.name;
  switch (name) {
    case "start":
        value.time.m = Number(selectValue("session").innerHTML);
        value.current = "session";
        start(value);
        break;
    case "reset":
       value = initValue("session");
       reset(CLOCK,value.time);
       break;
    case  "restart":
      start(value);
      break;
    case "pause":
      pause();
      break;}
}));


function initValue(type){
  current.innerHTML = type;
  return  { current : type ,time :{m :Number(selectValue(type).innerHTML),s:0 }}
}


// after a  "session"   there is a new call to start the clock for "break"
function start(value){
  if (interval)
    clearInterval(interval);

  let d = value.time;

  interval = setInterval(function(){

    if (d.s == 0)
      { d.m--;
        d.s=59;}
       else {
         d.s--;
       }
    if (d.m == 0 && d.s == 0)
     {clearInterval(interval);
       if (value.current == "session") // modify the current state
            value = initValue("break");
        else
            value= initValue("session");
        start(value);  }
      render(CLOCK,d);
  } ,  1000)

}


function pause(){
  clearInterval(interval);
  interval = undefined;
}

function reset(element,value){
  clearInterval(interval);
  element.innerHTML=formatHour(value.m,value.s );
}

function render(elt,{m,s}){
  elt.innerHTML=formatHour(m,s)
}

function formatHour(m,s){
  return `${padding(m) } : ${padding(s) }`;
}

function padding(n,lenght){
  return   n < 10 ? "0"+n : n;
}


}
