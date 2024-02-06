//..............Ship Factory.......................//
class Ship{
    constructor(Name,Size,Damage=0,PositionX,PositionY,IsSunk=false)
    {
        this.Name=Name;
        this.Size=Size;
        this.Damage=Damage;
        this.PositionX=PositionX;
        this.PositionY=PositionY;
        this.IsSunk=IsSunk;
    }
    Set_Sunk() 
    {
        if(this.Damage>=this.Size)
        {
            this.IsSunk=true;
        }   
    }
    Set_Damage()
    {
        this.Damage++;   
        this.Set_Sunk();
    }
}
let All_Ships=[];
let Computer_All_Ships=[];
let Ship_List=[{Name: "Aircraft Carrier", len:5},{Name: "Destroyer", len:4},{Name: "Submarine", len:3},{Name: "Submarine", len:3},{Name: "Speed Boat", len:2}];
let Current_Ship=0;
let Axis="Y";
let Current_Ship_Lenght=Ship_List[Current_Ship].len; 
let Game=document.getElementById('Game_Board');

let Computer_Already_Attacked=[];
let Occupied_Positions={X:[],Y:[]};



function Game_Defination()
{
    for(let x=1;x<=10;x++)
    {
        for(let y=1;y<=10;y++)
        {
            let square=document.createElement('span');
             square.addEventListener('mouseover',Mouse_Hover);
             square.addEventListener('mouseout',Mouse_Out);
            square.addEventListener('click',Set_Ship_Position);
            square.setAttribute('name',y);
            square.setAttribute('id',x);
            Game.insertAdjacentElement('beforeend',square);
        }
    }
}   
Game_Defination();


function Mouse_Hover(event)
{
    let X_axis=event.target.getAttribute('name');
    let Y_axis=event.target.id;
    let Check=Check_Ship_Position_Viability(X_axis,Y_axis);
    if(Check_length(X_axis,Y_axis) && Check_Ship_Position_Viability(X_axis,Y_axis)) {
        Set_Color(X_axis,Y_axis,"#00cae4");
    }else{
        Set_Color(X_axis,Y_axis,"#c34a4a");
        Set_Event_Listener(X_axis,Y_axis,false)
    }
    
}
function Mouse_Out(event)
{
    let X_axis=event.target.getAttribute('name');
    let Y_axis=event.target.id;
    Set_Color(X_axis,Y_axis,"#c5cae9");
    Set_Event_Listener(X_axis,Y_axis,true)
}
function Check_length(x,y)
{
    let len=Ship_List[Current_Ship].len   
    if(11-y>=len){
        return true;
    }else{
        return false;
    }
}
function Set_Color(X_axis,Y_axis,Color,Image)
{
    let Count=0;
        for(let i=Y_axis;i<=Y_axis+Ship_List[Current_Ship].len;i++)
        {
            for (const span in Game.childNodes) {
                if(Game.childNodes[span].id==i && Game.childNodes[span].getAttribute('name')==X_axis)
                {
                    if(Count<Ship_List[Current_Ship].len)
                    {
                        if(Image){
                            Game.childNodes[span].style.backgroundImage=Image;
                            Game.childNodes[span].style.backgroundColor='#c5cae9';
                        }else{
                            Game.childNodes[span].style.backgroundColor=Color;
                        }
                    }
                    Count++;
                }
            }
        }
}
function Set_Event_Listener(X_axis,Y_axis,Add,All)
{
    if(Add)
    {
        let Count=0;
        for(let i=Y_axis;i<=Y_axis+Ship_List[Current_Ship].len;i++)
        {
            for (const span in Game.childNodes) {
                if(Game.childNodes[span].id==i && Game.childNodes[span].getAttribute('name')==X_axis)
                {
                    if(Count<Ship_List[Current_Ship].len)
                    {
                        Game.childNodes[span].addEventListener('click',Set_Ship_Position);

                    }
                    Count++;
                }
            }
        }

    }else{
        let Count=0;
        for(let i=Y_axis;i<=Y_axis+Ship_List[Current_Ship].len;i++)
        {
            for (const span in Game.childNodes) {
                if(Game.childNodes[span].id==i && Game.childNodes[span].getAttribute('name')==X_axis)
                {
                    if(Count<Ship_List[Current_Ship].len)
                    {
                        Game.childNodes[span].removeEventListener('click',Set_Ship_Position);

                    }
                    Count++;
                }
            }
        }
    }
    if(All)
    {
        let Count=0;
        for(let i=Y_axis;i<=Y_axis+Ship_List[Current_Ship].len;i++)
        {
            for (const span in Game.childNodes) {
                if(Game.childNodes[span].id==i && Game.childNodes[span].getAttribute('name')==X_axis)
                {
                    if(Count<Ship_List[Current_Ship].len)
                    {            
                        Game.childNodes[span].removeEventListener('mouseover',Mouse_Hover);
                        Game.childNodes[span].removeEventListener('mouseout',Mouse_Out);
                        Game.childNodes[span].removeEventListener('click',Set_Ship_Position);
                    }
                    Count++;
                }
            }
        }
    }
}
function Check_Ship_Position_Viability(x,y)
{
    x=Number(x);
    y=Number(y);
    for(let j=0;j<=Occupied_Positions.Y.length;j++)
    {
        if(Occupied_Positions.X[j]===x && Occupied_Positions.Y[j]===y)
        {
            return false;
        }
    }
    return true;
}
function Set_Ship_Position(event)
{
    let X_axis=event.target.getAttribute('name');
    let Y_axis=event.target.id;
    let total=Number(Y_axis)+Current_Ship_Lenght
    let shipx=[];
    let shipy=[];
    for(let i=Number(Y_axis);i<total;i++)
    {
        shipx.push(Number(X_axis));
        shipy.push(i);
    }

    let ship=new Ship(Ship_List[Current_Ship].Name,Ship_List[Current_Ship].len,0,shipx,shipy,false);
    All_Ships.push(ship);
    Set_Color(X_axis,Y_axis,"#00f",'url(./Ship.svg)');
    Set_Event_Listener(X_axis,Y_axis,false,true);
    if(Current_Ship+1>Ship_List.length-1)
    {
        document.getElementById('Start_Game').style.zIndex=1;
        return
    }else{
        Set_Occupied(X_axis,Y_axis);
        Current_Ship++;
        Current_Ship_Lenght=Ship_List[Current_Ship].len;  
    }
}
function Set_Occupied(X_axis,Y_axis)
{
    let Start=0;
    let nextship=Current_Ship+1;
    if(Ship_List[nextship]){Start=Number(Y_axis)-Ship_List[nextship].len}
    let total=Number(Y_axis)+Current_Ship_Lenght+Ship_List[nextship].len;
    for(;Start<total;Start++)
    {
        if(Start>0 && Start<=10)
        {
            Occupied_Positions.X.push(Number(X_axis));
            Occupied_Positions.Y.push(Start);
        }
    }
}

/////////////////Game Logic//////////////////////////////////////////

function Game_Start()
{
    Current_Ship=0;
    Current_Ship_Lenght=Ship_List[Current_Ship].len;  
    Game_Reset();
    Computer_Ship_Placement();
    Add_Second_Playable_Area();
}
function Game_Reset()
{
    document.getElementById('Game_Board').innerHTML="";
    for(let x=1;x<=10;x++)
    {
        for(let y=1;y<=10;y++)
        {
            let square=document.createElement('span');
            square.addEventListener('mouseover',Attack_Mouse_Over);
            square.addEventListener('mouseout',Attack_Mouse_Out);
            square.addEventListener('click',Attack);
            square.setAttribute('name',y);
            square.setAttribute('id',x);
            Game.insertAdjacentElement('beforeend',square);
        }
    }
}
function Computer_Ship_Placement()
{
    let All_Xs=[];
    while(Current_Ship<=4)
    {
        let x=Math.floor(Math.random()*10+1);
        if(All_Xs.includes(x))
        {   
            x=Math.floor(Math.random()*10+1);
        }
        All_Xs.push(x);
        let y=Math.floor(Math.random()*(10-Current_Ship_Lenght)+1);
        let total=y+Current_Ship_Lenght;
        let shipx=[];
        let shipy=[];
        for(let i=y;i<total;i++)
        {
            shipx.push(x);
            shipy.push(i);
        }
        let ship=new Ship(Ship_List[Current_Ship].Name,Ship_List[Current_Ship].len,0,shipx,shipy,false);
        Computer_All_Ships.push(ship);
        Current_Ship++;
        if(Current_Ship<=4)
        {
            Current_Ship_Lenght=Ship_List[Current_Ship].len;  
        }
    }
    console.log('Computer Ships : ');
    console.log(Computer_All_Ships);

}
function Attack_Mouse_Over(event)
{
    event.currentTarget.style.backgroundColor="Red";
}
function Attack_Mouse_Out(event)
{
    event.currentTarget.style.backgroundColor="";
}
function Add_Second_Playable_Area()
{
    let Game_2=document.getElementById('Content_Wrapper_2');
    Game_2.style.display="flex";   
    Add_squares();
    Attack_Add_Computer_Ships();
}
function Add_squares()
{
    let Game=document.getElementById('Game_Board_2');
    for(let x=1;x<=10;x++)
    {
        for(let y=1;y<=10;y++)
        {
            let square=document.createElement('span');
             square.addEventListener('mouseover',Attack_Mouse_Over);
             square.addEventListener('mouseout',Attack_Mouse_Out);
            square.setAttribute('name',y);
            square.setAttribute('id',x);
            Game.insertAdjacentElement('beforeend',square);
        }
    }
}
function Attack_Add_Computer_Ships()
{
    let Game=document.getElementById('Game_Board_2');
    for (const span in Game.children)
    {
        let posy=Number(Game.children[span].id);
        let posx=Number(Game.children[span].getAttribute('name'));
        for (const ship in All_Ships) {
            for (const pos in All_Ships[ship].PositionX) {
                if(All_Ships[ship].PositionX[pos]===posx && All_Ships[ship].PositionY[pos]===posy)
                {
                    Game.children[span].style.backgroundImage="url(./Ship.svg)";
                }
            }
            
        }
    }
}
function Attack(event)
{
    
    let posy=  Number(event.target.id);
    let posx=Number(event.target.getAttribute('name'));
    if(Check_Computer_Hit(posx, posy))
    {
        event.target.style.backgroundImage="url(./Destroyed.svg)"
        event.target.style.backgroundColor="blue"
        event.target.removeEventListener('mouseover',Attack_Mouse_Over);
        event.target.removeEventListener('mouseout',Attack_Mouse_Out);
        event.target.removeEventListener('click',Attack);
        return;
    }else{
        event.target.style.backgroundColor="blue"
        event.target.removeEventListener('mouseover',Attack_Mouse_Over);
        event.target.removeEventListener('mouseout',Attack_Mouse_Out);
        event.target.removeEventListener('click',Attack);
    }
    document.getElementById('ovelay_User').style.zIndex="1";
    Computer_Attack();
}
function Check_Computer_Hit(x,y)
{
    let ret=false;
    Computer_All_Ships.forEach(ship=>{
        let Pos_X;
        let Pos_Y;
        Pos_X= ship.PositionX[0];
        ship.PositionY.forEach(pos2=>{
            Pos_Y=pos2;
            if(Pos_X===x && Pos_Y===y)
            {
                console.log(Pos_X+" : "+Pos_Y);
                ship.Set_Damage();
                console.log(ship);
                ret= true; 
            }
        });
    });
    Check_Computer_Ship_Destroyed()
    return ret;
}
function Check_Computer_Ship_Destroyed()
{
    if(Computer_All_Ships[0].IsSunk===true && Computer_All_Ships[1].IsSunk===true && Computer_All_Ships[2].IsSunk===true && Computer_All_Ships[3].IsSunk===true && Computer_All_Ships[4].IsSunk===true)
    {
        document.getElementById('Winner').style.display="flex";
        document.getElementById('Announce_Winner').innerHTML="You Won !!!";
    }
}





function Computer_Attack()
{
    debugger
    let x=Math.floor(Math.random()*10+1);
    let y=Math.floor(Math.random()*10+1);
    while(Computer_Already_Attacked.includes(String(x)+String(y))){
        x=Math.floor(Math.random()*10+1);
        y=Math.floor(Math.random()*10+1);
    }
    
    let Game_Board_2 = document.getElementById("Game_Board_2");
    Computer_Already_Attacked.push(String(x)+String(y));
    if(Check_User_Hit(x,y))
    {
        for (const span in Game_Board_2.children) {
            let SpanY=Number(Game_Board_2.children[span].id);
            let SpanX=Number(Game_Board_2.children[span].getAttribute('name'));
            if(SpanY===y && SpanX === x)
            {
                Game_Board_2.children[span].style.backgroundImage="url(./Destroyed.svg)"
                Game_Board_2.children[span].style.backgroundColor="blue"
                if(!Check_User_Ship_Destroyed())
                {
                    Computer_Attack();
                }
                return;
            }
        }

    }else{
        for (const span in Game_Board_2.children) {
            let SpanY=Number(Game_Board_2.children[span].id);
            let SpanX=Number(Game_Board_2.children[span].getAttribute('name'));
            if(SpanY===y && SpanX === x)
            {
                Game_Board_2.children[span].style.backgroundColor="blue";
                document.getElementById('ovelay_User').style.zIndex="-1";
                return;
            }
        }
    }
}
function Check_User_Hit(x,y)
{
    let ret=false;
    All_Ships.forEach(ship=>{
        let Pos_X;
        let Pos_Y;
        Pos_X= ship.PositionX[0];
        ship.PositionY.forEach(pos2=>{
            Pos_Y=pos2;
            if(Pos_X===x && Pos_Y===y)
            {
                console.log(Pos_X+" : "+Pos_Y);
                ship.Set_Damage();
                console.log(ship);
                ret= true; 
            }
        });
    });
    return ret;
}
function Check_User_Ship_Destroyed()
{
    if(All_Ships[0].IsSunk===true && All_Ships[1].IsSunk===true && All_Ships[2].IsSunk===true && All_Ships[3].IsSunk===true && All_Ships[4].IsSunk===true)
    {
        document.getElementById('Winner').style.display="flex";
        document.getElementById('Announce_Winner').innerHTML="Computer Won !!!";
        return true;
    }
}