/* 
==============================================================================================
                                   Gold Runner Game Logic

 
 ============================================================================================== 
 *   */

/*
 * 
 * New moded by Alphateam.
 */


//main(); //load the main funtion.
window.onload=main;
var ReceivedMapJSON='var s="this is a string";'  ;//'"Map" : {                "bg" : "floor2",    "divideX" : "10",    "divideY" : "5",            "Startup" : "var usage = "test";",        "Players" : { "Player" :[{                "enabled" : "True",    "name" : "NewPlayer",    "role" : "0",    "src" : "2vdo45v",    "x" : "0",    "y" : "2",        },{                "enabled" : "True",    "name" : "NewPlayer",    "role" : "0",    "src" : "2vdo45v",    "x" : "0",    "y" : "4",        }] },        "Blocks" : "",        "Blanks" : "",        "Items" : { "Item" :[{                "code" : "0",    "img" : "tree1",    "keep" : "False",    "score" : "0",    "task" : "0",    "x" : "8",    "y" : "2",        },{                "code" : "0",    "img" : "tree2",    "keep" : "False",    "score" : "0",    "task" : "0",    "x" : "7",    "y" : "4",        },{                "code" : "0",    "img" : "1",    "keep" : "False",    "score" : "0",    "task" : "0",    "x" : "9",    "y" : "3",        }] },        "Hotpoints" : {                        "Hotpoint" : {                "count" : "0",    "x" : "2",    "y" : "2",        }    }    }}';


var global;

function main(){
//=========================================declarations:=======================================


//system:
var imageIndex=0;
global=this;
var currentStage=1;



var Images=new Array();
var imageLoad=0;
var imageLoaded=0;
var imageLoaderCount=false;
var imageLoaderFlag=0;

//game play:
var bCountX=0;  //count of the blocks on x axis.
var bCountY=0;

var walkBlocks=new Array();
var grids=new Array();  //a collection of grids,
var whosTurn;  //0-player's turn 10-enemies' turn
var cancelledMovement=false;  //when true, means a window popped up and needs front mani.

    
//characters:

var player;
var enemyList=new Array();   //collect all the enemy instances.   
var enemyAllFinished=new Array();  //length should be the same as it of enemylist.
var playerList=new Array();  //this is a dynamic-ranged array that stores all the available player's roles
//in the current stage. when it's the player's turn, the system will traverse each element no matter
//it's enabled or not, when enabled, will shows its walkblock and wait for the next available player.
var playerListIterator=0; //this is a pointer(iterator) that tells the system the current index in player's list.
//will ++ when the current player finishes walking, when this==playerlist.lengh, means players' moves end, turn to enemy.



//items & misc:
var itemlist=new Array();
var spotlist=new Array();

var scores=0;
var taskitem=new Array();
var dialogResult;

    

//init
init();
    











function init()
{
    //step1: preload the images.

        imageStart(1);
            //preload the system images.
            loadImage("system/walk.png");
            loadImage("system/nowalk.png");            
            loadImage("system/path.png");
    
       //pre-load all the environment assets for the game.
        loadImage("tiles/floor2.jpg");
        loadImage("obs/1.png");
        
        
        //player's images:
        //skin1:
        loadImage("chr/player/2vdo45v_11.png");
        loadImage("chr/player/2vdo45v_12.png");
        loadImage("chr/player/2vdo45v_13.png");
        loadImage("chr/player/2vdo45v_21.png");
        loadImage("chr/player/2vdo45v_22.png");
        loadImage("chr/player/2vdo45v_23.png");      
        loadImage("chr/player/2vdo45v_31.png");
        loadImage("chr/player/2vdo45v_32.png");
        loadImage("chr/player/2vdo45v_33.png");       
        loadImage("chr/player/2vdo45v_41.png");
        loadImage("chr/player/2vdo45v_42.png");
        loadImage("chr/player/2vdo45v_43.png");       
        
       //enemy's images:
       //skin1:
        loadImage("chr/em/emb1_11.png");
        loadImage("chr/em/emb1_12.png");
        loadImage("chr/em/emb1_13.png");
        loadImage("chr/em/emb1_21.png");
        loadImage("chr/em/emb1_22.png");
        loadImage("chr/em/emb1_23.png");
        loadImage("chr/em/emb1_31.png");
        loadImage("chr/em/emb1_32.png");
        loadImage("chr/em/emb1_33.png");
        loadImage("chr/em/emb1_41.png");
        loadImage("chr/em/emb1_42.png");
        loadImage("chr/em/emb1_43.png"); 
        
       
        imageEnd();
       
       
       
       //msgbox event listener.
       document.getElementById("ok").addEventListener("click",function(){closeMsg(); restore(dialogResult);},false);
       
       
       
       
       //step2: init the stage:
        currentStage=1;
        initStage(currentStage);
        
        
        
        //after we got the stage from the server:
        var stageLoader=eval(ReceivedMapJSON);
        alert(stageLoader.Map.Startup);
        
        
        
      
        
}












function initStage(stage)
{
    

    if(true)//general reset before a stage loading.
    {
        playerListIterator=0;
    }
    
    
    
    switch (stage)
    {
        case 1:
//======================stage 1;
         var mainpanel=document.getElementById("maincontainer");
         bCountX=10;
         bCountY=5;
            
         mainpanel.style.width=bCountX*36+"px";
         mainpanel.style.height=bCountY*36+"px";         
         mainpanel.style.backgroundImage="url('tiles/floor2.jpg')";
         //initialize the grids:
            initGrids(bCountX,bCountY);
            
            //set the blocks.
                addBlankObstacle(0,0);
                addBlankObstacle(1,0);
                addBlankObstacle(2,0);                
                addBlankObstacle(3,0);                
                addBlankObstacle(4,0);                
                addBlankObstacle(0,1);                
                addBlankObstacle(1,1); 
                addBlankObstacle(8,0);                
                addBlankObstacle(6,1);  
                addBlankObstacle(5,2);
                addBlankObstacle(6,2); 
                
                addBlankObstacle(0,3);  
                addBlankObstacle(1,3);  
                addBlankObstacle(2,3);  
                addBlankObstacle(3,3);  
                addBlankObstacle(4,3);
                addBlankObstacle(5,3);
                
                addBlankObstacle(9,4);
                
                
                addBlock(7,3,'tree1',3,2);                
                
                
            var playerStartX=0;
            var playerStartY=2;            
        
                //createEnemy(8,3,0); //0 means the skin id.
                //createEnemy(2,3,0);
                createEnemy(7,1,"emb1_");
                addItem(1,2,1,20,1,"gold1","msgDialog(150,150,whosTurn.toString());");
                addItem(7,1,1,20,1,"gold1","deleteBlock(3,3);setPlayerEnabled('john',true);");
                addItem(8,4,1,20,1,"gold1",'addItem(0,4,1,20,1,"gold1");');                
                
                addHotPoint(2,1,-1,"msgDialog(150,150,'Enter');","msgDialog(150,150,'Out');");
                
                

            break;
            
          
            
    }           

 //============================general init:=================================
            //player:
        
        
        player=new playerClass(playerStartX,playerStartY,"chr/player/2vdo45v_","player");
        player.setVisible(true);
        player.setFrame(1,1);    
        playerList.push(player);  //add our player to the list so that the big turn will traverse and find it.
        
        var player1;
        player1=new playerClass(1,4,"chr/player/2vdo45v_","player");
        //player1.enabled=false;
        player1.name="john";  //set a name
        player1.setVisible(true);
        player1.setFrame(1,1);
        playerList.push(player1);
        


        cancelledMovement=false;         
        //showWalkBlocks(player);
        playerTurn();


}



//========================================Commands====================================
//========================================Commands====================================
function movePlayer(player,x,y)
{
    //arg: player, the player instance which we are going to move, x/y,the new place.
    var e=player.element;
    
    e.style.left=x*36+"px";
    e.style.height=y*36+"px";
    e.x=x;
    e.y=y;
    
    
}


    function setPlayerEnabled(playerName,value)
    {
        for(var i=0;i<playerList.length;i++)
        {
            if(playerList[i].name===playerName)
            {
                playerList[i].enabled=value;  //set the value
            }
        }
    }


    function addHotPoint(x,y,number,script,outScript)
    {
        spotlist.push(new hotPoint(x,y,number,script,outScript));
    }

    function addItem(x,y,code,score,taskCount,img,script)
    {
        itemlist.push(new itemClass(x,y,code,score,taskCount,img,script));
    }




    function addBlankObstacle(x,y)
    {
        addBlock(x,y,"",3);
    }
    function addBlock(x,y,skin,value,height)
    {
           if(height==null)
            {
                height=1;
            }   
            var id=xy2int(x,y);
            
            grids[id].occupied=value; //this is a brick/obstacle.
            
            var block=document.createElement("div");
            block.style.position="absolute";
            block.style.width="36px";
            block.style.height=height*36+"px"; 
            block.id="bk"+x.toString()+y.toString();  //give it a name/id for deleting.
            
            block.style.left=grids[id].x * 36 +"px";
            block.style.top=(grids[id].y-(height-1)) * 36 +"px";
            var zo=Math.floor( id/bCountX);
            block.style.zIndex=zo;
            
            block.style.backgroundImage="url('obs/"+skin+".png')";
            document.getElementById("maincontainer").appendChild(block);
    }
    
    function deleteBlock(x,y)
    {
        var block = document.getElementById("bk"+x+y);
        if(block==null)return;
        
        //delete
        document.getElementById("maincontainer").removeChild(block);
        grids[xy2int(x,y)].occupied=0; //set to nothing.
        
    }
    
    function createEnemy(x,y,skin)
    {
            var enemy=new playerClass(x,y,"chr/em/"+skin,"enemy");
            enemy.setVisible(true);
            enemy.setFrame(2,1);
            enemyList.push(enemy);
    }


    function msgDialog(x,y,text,resultScript,icon,iconSize,iconPosition)
    {
        //return: null-nothing pressed or error
        //1-ok
        //2-cancel
        //3-yes
        //4-no
        
        var width=160;
        var height=100;
        if(text.length>16)
        {
            width=text.length*10;
        }
        document.getElementById("d5").innerHTML="<p align='middle'>"+text+"</p>";
        showWindow(x,y,width,height);
        var button=document.getElementById("ok");
        button.style.left=width/2-43+"px";
        button.style.top=height-16+"px";
        button.style.visibility="visible";
        
        var ic=document.getElementById("dialogicon");
        ic.style.width=iconSize+"px";
        ic.style.height=iconSize+"px";   
        
        
        
        
        cancelledMovement=true;
        
        
    }


//===================================================general functions=========================
//===================================================general functions=========================

    
    
    //=================system=========================
        function loadImage(path)
    {
        Images[imageIndex]=new Image();
        Images[imageIndex].src=path;
        if(imageLoaderCount) imageLoad++;
        Images[imageIndex].onload=function(){
            imageLoaded++;
            //call the event:
            imageLoadStep(Math.floor( imageLoaded/imageLoad*100),imageLoaderFlag);
            if(imageLoaded===imageLoad)
            {
                //call finish:
                imageLoadFinish(imageLoaderFlag);
            }
        };
        
        
        
        imageIndex++;
        
    }
    function clearImage()
    {
        Images=new Array();
        imageIndex=0;
    }
    function imageStart(flag)
    {
        imageLoad=0;
        imageLoaded=0;
        imageLoaderCount=true;
        imageLoaderFlag=flag;
    }
    
    function imageEnd()
    {
        imageLoaderCount=false;
    }
    
    
    
    
    
    
    
    //=================general=========================
    
    
    
    function addPath(x,y,id)
    {
        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
        {
            //the block is out of the playing range.
            //will not generate the walk block.
            return;
        }

        
        
        var wb=document.createElement("div");
        wb.style.position="absolute";
        wb.style.width='36px';
        wb.style.height='36px';        
        wb.style.left=x*36+"px";
        wb.style.top=y*36+"px";  
        
        wb.style.zIndex="1";
        

        wb.style.backgroundImage="url('system/path.png')";

        wb.setAttribute("id",id);
        document.getElementById("pathlayer").appendChild(wb);
               
    }
    
    

    function initGrids(x,y)
    {
        grids=new Array();
        for(var i=0;i<(x*y);i++)
        {
            grids[i]=new gridClass(i);
            
        }
    }
    
    
    
    
    function showWalkBlocks(character)
    {
        
        if(cancelledMovement===true)return;
        
        //get the player's position
        var playerpos= character.getPosition();
        //alert(playerpos.x+" "+playerpos.y);
        
        //up;
        createWalkBlocks(playerpos.x,playerpos.y-1,character);
        createWalkBlocks(playerpos.x,playerpos.y+1,character);
        createWalkBlocks(playerpos.x-1,playerpos.y,character);        
        createWalkBlocks(playerpos.x+1,playerpos.y,character);        
        
        whosTurn=0;  //our turn
        
    }

    function createWalkBlocks(x,y,character)   //means the 4 dirs block
    {
        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
        {
            //the block is out of the playing range.
            //will not generate the walk block.
            return;
        }

        
        
        var wb=document.createElement("div");
        wb.style.position="absolute";
        wb.style.width='36px';
        wb.style.height='36px';        
        wb.style.left=x*36+"px";
        wb.style.top=y*36+"px";  
        
        wb.style.zIndex="100";
        
        var b=grids[y*bCountX+x].occupied;
        if(b===2 || b===3)
        {
            //red block.
            wb.style.backgroundImage="url('system/nowalk.png')";
        }
        else            
        {
            wb.style.backgroundImage="url('system/walk.png')";  
            //add event
            wb.addEventListener("click",function(){walkBlockClicked(x,y,character);},true);
        }
        wb.setAttribute("id","wb");
        document.getElementById("maincontainer").appendChild(wb);
        walkBlocks.push(wb);
        
    }
    function clearWalkBlock()
    {
        
        var wb=document.getElementById("maincontainer").childNodes;
        var len=wb.length;
        for(var i=len-1;i>=0;i--)
        {
            if(wb[i].id==="wb")document.getElementById("maincontainer").removeChild(wb[i]);
            
        }        
        walkBlocks=new Array();
        
    }

    function walkBlockClicked(x,y,character)
    {
        //alert(x+" "+y);
        start2Walk(character,x,y);
    }

    function start2Walk(char,x,y)   //when the goal is confirmed, drive the character.
    {
        //arg:char: the character that we want to let it walk, includes the player.
        //x/y the goal.
        var d=1; //direction
        if(char.x===x)
        {
            if(char.y<y)
            {
                d=1;
            }
            else
            {
                d=4;
            }
        }
        else
        {
            if(char.x<x)
            {
                d=3;
            }
            else
            {
                d=2;
            }            
        }
        clearWalkBlock();
        char.startAnimation(4,d,1);
        
    }
    
     function xy2int (x,y)
    {
        return y*bCountX+x;
    };




    
    
    function refreshPath()
    {
        var container=document.getElementById("pathlayer");
        var ccc=container.childNodes.length;
        for(var k=0;k<ccc;k++) 
        {
            container.removeChild(container.childNodes[0]);
        }
        
        for(var i=0;i<enemyList.length;i++)
        {
            if(enemyList[i].route!=null)
            {
                var x,y;
                x=enemyList[i].x;
                y=enemyList[i].y;
                
                addPath(x,y,"ep"+i);
                for(var j=0;j<enemyList[i].route.length;j++)
                {
                    if(enemyList[i].route[j]===1)y++;
                    if(enemyList[i].route[j]===4)y--;                    
                    if(enemyList[i].route[j]===2)x--;                    
                    if(enemyList[i].route[j]===3)x++;                    
                    addPath(x,y,"ep"+i);
                    
                }
            }
        }
    }
    
    
    function checkPlayer(x,y)
    {
        //arg: the position of the player
        
        for(var i=0;i<itemlist.length;i++)
        {
            if(itemlist[i].x===x && itemlist[i].y===y)
            {
                //got the item:
                itemlist[i].getItem();
                itemlist.splice(i,1); //remove the item.
                refreshUI(); //update the scores, etc. on UI.
                
            }
        }
        
        for(i=0;i<spotlist.length;i++)
        {
            spotlist[i].drive();
        }
        
        
    }
    
    function refreshUI()
    {
        
    }
    
    
    
    
    
    //==============================gameplay & gamerule===========================
    
    function playerTurn()
    {
        if(cancelledMovement===true)return;
        if(whosTurn!==0) whosTurn=0;  //set to our turn
        
        if(playerList[playerListIterator].enabled===true)
        {
               showWalkBlocks(playerList[playerListIterator]);  //show walkblocks for the current player(not an enemy)     
        }
        
        
        playerListIterator++;
        


        
    }
    
    
    function checkItemsCollected()
    {
        
    }
    function checkPlayerCaught()
    {
        
    }
    
    function gameOver()
    {
        
    }
    

    function closeMsg()
    {
        document.getElementById("dialog").style.visibility='hidden';
        document.getElementById("ok").style.visibility='hidden';        
    }
    
    function showWindow(x,y,w,h)
    {
        var win=document.getElementById("dialog");
        win.style.visibility="visible";
        win.style.left=x+"px";
        win.style.top=y+"px";        
        win.style.width=64+w+"px";           
        win.style.height=64+h+"px";  

        //hide the buttons
        var button=document.getElementById("ok");
        button.style.visibility="hidden";        
        
        var win=document.getElementById("d7");       
        win.style.left="0px";
        win.style.top="0px";  
        
        var win=document.getElementById("d9");       
        win.style.left=32+w+"px";
        win.style.top="0px";          
        
        var win=document.getElementById("d1");       
        win.style.left="0px";
        win.style.top=32+h+"px";  
        
        var win=document.getElementById("d3");       
        win.style.left=32+w+"px";
        win.style.top=32+h+"px";
        
        var win=document.getElementById("d8");       
        win.style.left="32px";
        win.style.top="0px";        
        win.style.width=w+"px";           
        win.style.height="32px";       
        
        var win=document.getElementById("d2");       
        win.style.left="32px";
        win.style.top=32+h+"px";        
        win.style.width=w+"px";           
        win.style.height="32px";  
        
        var win=document.getElementById("d4");       
        win.style.left="0px";
        win.style.top="32px";        
        win.style.width="32px";           
        win.style.height=h+"px";        
        
        var win=document.getElementById("d6");       
        win.style.left=32+w+"px";
        win.style.top="32px";        
        win.style.width="32px";           
        win.style.height=h+"px";          
        
        var win=document.getElementById("d5");       
        win.style.left="32px";
        win.style.top="32px";        
        win.style.width=w+"px";           
        win.style.height=h+"px"; 
        
        
    }
    
    
//======================================Ai==================================
//======================================Ai==================================


    function checkEnemyAllFinished()
    {
        if(enemyAllFinished.length===enemyList.length)
        {
            //finished:return to player's turn.
            //showWalkBlocks(player);
            playerListIterator=0;
            playerTurn();
        }
    }
    
    function checkVision(Enemy)
    {
        //check if the player is inside the enemy's scope, if positive, return the waypoint array.
        //arg: enemy[i] in enemylist.
        
        
        ///TODO:add a structure of iteration to help an enemy to find all active players.
        //for()......
        for(var i=0;i<playerList.length;i++)
        {
            if(playerList[i].visible===false)
            {
                //if this player is set to be unvisible.
                continue;
            }
            var inhalf=false;  //when the player is in the area that the enemy is facing, returns true.

            if(Enemy.dir===1 && playerList[i].y>=Enemy.y) inhalf=true;
            if(Enemy.dir===4 && playerList[i].y<=Enemy.y) inhalf=true;        
            if(Enemy.dir===2 && playerList[i].x<=Enemy.x) inhalf=true;         
            if(Enemy.dir===3 && playerList[i].x>=Enemy.x) inhalf=true;  

            if(!inhalf) continue;        
            //check the possibility that the enemy could scope the player.
            var dx,dy;
            dx=playerList[i].x-Enemy.x;
            dy=playerList[i].y-Enemy.y;        

            var blockShape;
            var ret=new Array();
            var x=Enemy.x;
            var y=Enemy.y;        
            var accuMax;
            var accu;     
            var end=false;

            if(Math.abs(dx)>=Math.abs(dy))  //==============================wide ratio=========================
            {
                if(dy===0)
                {
                    accuMax=dx;
                }
                else if(Math.abs(dy)===1)
                {
                    accuMax=Math.floor(Math.abs(dx/2));
                }
                else
                {
                    accuMax=Math.floor(Math.abs(dx/dy));
                }

                accu=0;
                blockShape=0;

                while(end===false)
                {
                    if(dx<0) //------------------------left------------------
                    {
                        x--; //move 1 left.
                        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
                        {
                            break;
                        }
                        else
                        {
                            if(grids[xy2int(x,y)].occupied===3)
                            {
                                //meet the brick.
                                break;
                            }
                            else
                            {
                                ret.push(2); 
                                accu++;
                                if(accu===accuMax)
                                {
                                    accu=0; //reset
                                    //check if it meets the end(player).   
                                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                                        {
                                            //meet the player.
                                            return ret;
                                        }                                
                                    if(dy>0){ret.push(1);y++;}
                                    if(dy<0){ret.push(4);y--;}                     
                                    if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                                    {
                                        end=true;
                                    }
                                    else
                                    {
                                        if(grids[xy2int(x,y)].occupied===3)
                                        {
                                            //meet the brick.
                                            break;
                                        }                                    
                                    }

                                }
                            }
                        }

                    }
                    else  //-----------------------right--------------------
                    {
                        x++; //move 1 right.

                        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
                        {
                            break;
                        }
                        else
                        {
                            if(grids[xy2int(x,y)].occupied===3)
                            {
                                //meet the brick.
                                break;
                            }
                            else
                            {
                                ret.push(3); 
                                accu++;
                                if(accu===accuMax)
                                {
                                    accu=0; //reset
                                    //check if it meets the end(player).   
                                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                                        {
                                            //meet the player.
                                            return ret;
                                        }                                


                                    if(dy>0){ret.push(1);y++;}
                                    if(dy<0){ret.push(4);y--;}                          
                                    if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                                    {
                                        end=true;
                                    }
                                    else
                                    {
                                        if(grids[xy2int(x,y)].occupied===3)
                                        {
                                            //meet the brick.
                                            break;
                                        }                                    
                                    }

                                }
                            }
                        }
                    }

                    //check if it meets the end(player).   
                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                        {
                            //meet the player.
                            return ret;
                        }

                        if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                        {
                            end=true;
                        }

                }

            }
            else //==============================narrow ratio=========================
            {
                blockShape=1;

                if(dx===0)
                {
                    accuMax=dy;
                }
                else if(Math.abs(dx)===1)
                {
                    accuMax=Math.floor(Math.abs(dy/2));
                }
                else
                {
                    accuMax=Math.floor(Math.abs(dy/dx));
                }

                accu=0;
                blockShape=0;

                while(end===false)
                {
                    if(dy<0) //------------------------up------------------
                    {
                        y--; //move 1 up.
                        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
                        {
                            break;
                        }
                        else
                        {
                            if(grids[xy2int(x,y)].occupied===3)
                            {
                                //meet the brick.
                                break;
                            }
                            else
                            {
                                ret.push(4); 
                                accu++;
                                if(accu===accuMax)
                                {
                                    accu=0; //reset
                                    //check if it meets the end(player).   
                                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                                        {
                                            //meet the player.
                                            return ret;
                                        }                                
                                    if(dx>0){ret.push(3);x++;}
                                    if(dx<0){ret.push(2);x--;}                         
                                    if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                                    {
                                        end=true;
                                    }
                                    else
                                    {
                                        if(grids[xy2int(x,y)].occupied===3)
                                        {
                                            //meet the brick.
                                            break;
                                        }                                    
                                    }

                                }
                            }
                        }

                    }
                    else  //-----------------------down--------------------
                    {
                        y++; //move 1 down.
                        if(x<0 || x>=bCountX || y<0 || y>=bCountY)
                        {
                            break;
                        }
                        else
                        {
                            if(grids[xy2int(x,y)].occupied===3)
                            {
                                //meet the brick.
                                break;
                            }                        
                            else
                            {
                                ret.push(1); 
                                accu++;
                                if(accu===accuMax)
                                {
                                    accu=0; //reset     
                                    //check if it meets the end(player).   
                                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                                        {
                                            //meet the player.
                                            return ret;
                                        }                                   
                                    if(dx>0){ret.push(3);x++;}
                                    if(dx<0){ret.push(2);x--;}  
                                    if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                                    {
                                        end=true;
                                    }
                                    else
                                    {
                                        if(grids[xy2int(x,y)].occupied===3)
                                        {
                                            //meet the brick.
                                            break;
                                        }                                    
                                    }


                                }
                            }
                        }
                    }

                    //check if it meets the end(player).   
                    if(xy2int(x,y)===xy2int(playerList[i].x,playerList[i].y))
                        {
                            //meet the player.
                            return ret;
                        }   


                        if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map
                        {
                            end=true;
                        }


                }            


            }
        
        }
        
        return null; //cannot find the player.
        
        
        
    }
    
    
    


    function enemyTurn()
    {
        if(cancelledMovement===true)return;  //do nothing if we want to cancel the enemies' movement
        
        
        whosTurn=10;
        if(enemyList.length===0)
        {
            playerTurn();
            return ;
        }
        
        
        //use a for iteration to drive each enemy in their behaviors.
        enemyAllFinished=new Array(); //clear
        
        
        for(var i=0;i<enemyList.length;i++)
        {
            //--------------------for each enemy.--------------------------
            
            var visionResult=checkVision(enemyList[i]);
            if(visionResult!=null && visionResult.length>0)
            {
                //noticed the player!
                enemyList[i].alert=true;
                enemyList[i].route=visionResult;
                refreshPath();
                //alert(visionResult);
            }
            

                //if no waypoint in route object. generate one.
                if(enemyList[i].route==null || enemyList[i].route.length===0)
                {
                    var end=false;
                    while(end===false)
                    {
                        var result=pickARoute(enemyList[i]);
                        if(result!=null && result.length>0)
                        {
                            enemyList[i].route=result;
                                            refreshPath();
                            end=true; //quit the route-picking iteration.
                        }
                    }
                }
                
            if(!enemyList[i].alert)//if the enemy found us, they will not change the route
                                   //untill they get the player or lost the player when he get the place
                                   //that he lastly locked position of the player.
            {                
                //ramdomly change the route.            
                var rnd = Math.floor( Math.random()*4);            
                if(rnd===0) //randamly rethink the route(25%)
                {
                     end=false;
                    while(end===false)
                    {
                        var result=pickARoute(enemyList[i]);
                        if(result!=null  && result.length>0)
                        {
                            enemyList[i].route=result;
                                            refreshPath();
                            end=true; //quit the route-picking iteration.
                        }
                    }
                }

            }
            
            //begin to walk.
            enemyList[i].startAnimation(4,enemyList[i].route[0],1);
            enemyList[i].route.shift();
            
        }
    }
    
    
    
    
    function pickARoute(enemy)
    {
        //a function that pick a path for an enemy.
        //return an array of way-points.
        
        var rnd = Math.floor( Math.random()*4)+1;
        var vecX,vecY;
        if(rnd===1) //down
        {
            vecX=0;vecY=1;
        }
        if(rnd===2) //l
        {
            vecX=-1;vecY=0;
        }
        if(rnd===3) //r
        {
            vecX=1;vecY=0;
        }        
        if(rnd===4) //up
        {
            vecX=0;vecY=-1;
        }        
        
        var ret=new Array();
        var end=false;
        var x,y;
        x=enemy.x;
        y=enemy.y;
        while(end===false)
        {
            x+=vecX;
            y+=vecY;
            if(x<0 || x>=bCountX || y<0 || y>=bCountY) //when out of the map.
            {
                end=true;
            }
            else
            {
                var ind=xy2int(x,y);
                if(grids[ind].occupied===3)  //when hit the brick/opaque.
                {
                    end=true;
                }                
            }

            if(end!==true)
            {
                //add this block to the road point collection.
                ret.push(rnd); //add the value of rnd to the array.
            }
            
        }
        
        //return the result.
        return ret;
        
    }
    
    
    
    

//======================================classes==================================
//======================================classes==================================
function gridClass(number)
{

    this.occupied=0;
    this.x=number % bCountX;
    this.y=parseInt( number / bCountX);

    
}


function hotPoint(x,y,numberOfUse,script,outScript)
{
    this.x=x;
    this.y=y;
    this.numberOfUse=numberOfUse;
    this.script=script;
    this.outScript=outScript;
    this.enabled=true;
    this.inside=-1;  //if the player entered, will be the player's index, when the player went out, check this,
                         //if true, execute outScript.
    var that=this;
    
    
    this.drive=function ()
    {
        if(that.enabled===false)return;  //check enabled.
        
        if(playerList[playerListIterator-1].x===that.x && playerList[playerListIterator-1].y===that.y)
        {
            //hit the spot:
            if(that.numberOfUse===0)
            {
                that.enabled=false;
                
            }
            else 
            {
                //-1
                if(that.numberOfUse>0)that.numberOfUse--;
                if(that.script.length>0)    eval(that.script);
                that.inside=playerListIterator-1;
            }
                
        }
        else  //out of the spot.
        {
            if(that.inside===playerListIterator-1)
            {
                that.inside=-1;
                    eval(that.outScript);
            }
        }
            
    };
    
}



function itemClass(x,y,code,score,taskCount,img,script,keep)
{
    
    this.code=code;  //code: 0: , 1:gold1, 2:gold2, 3:
    this.score=score;  //add the score
    var that=this;   
    
    this.x=x;  //position.
    this.y=y;
    this.script="";  //script file, can be executed by the game when the player got this item.
    this.keep=keep;  //means when we get the item, it will not disappear, will not add
                     //score, will not affect taskcount, will not execute the script.
    if(script!=null)
    {
        this.script= script;
    }
    
    
    this.element=document.createElement("div");  //create the element.
    this.element.style.width="36px";
    this.element.style.height="36px";   
    this.element.style.left=x * 36 +"px";
    this.element.style.top=y * 36 +"px";   
    this.element.style.position="absolute";
    
    
    document.getElementById("maincontainer").appendChild(this.element);    
    
    
    this.taskCount=taskCount;  //if this item is required, this var should be >0.
                               //if ==0, means take it or not will not affect the mission.
                               
    this.element.style.backgroundImage="url('misc/"+img+".png')"; 
    
    
    
    this.getItem=function ()
    {
        taskitem[that.code]+=1;
        scores+=that.score;
        document.getElementById("maincontainer").removeChild(that.element);
        //execute the script:
            eval(that.script);
    };
    
    
    
    this.setVisible=function (enabled)
    {
        if(enabled===true)
        {
            that.element.style.visibility="visible";
        }
        else
        {
            that.element.style.visibility="hidden";            
        }
    };
           that.getPosition=function ()
           {
               var ret={};
               ret.x=that.x;
               ret.y=that.y;
               return ret;
           };
}




function playerClass(x,y,fileString,id,name)
{
    if(id==null)return ;
    //x & y mean the start position of the character.
    this.x=x;  //not real position, the position of grids.
    this.y=y;
            
    if(id==="player")
    {
        
        grids[xy2int(x,y)].occupied=1;    //player
    }
    else
    {
        grids[xy2int(x,y)].occupied=2;   //enemy         
    }

    this.name=name;  //player's name, will be set in map editor
    
    this.dir=1;//direction, 1:down,2:left,3:right,4:up.
    this.element=document.createElement("div"); //dom object.
    this.element.style.position="absolute";
            this.element.style.width="36px";
            this.element.style.height="36px"; 
            
            this.element.style.left=x * 36 +"px";
            this.element.style.top=y * 36 +"px";    
    this.element.style.visibility="hidden";
    this.element.id=id;
    this.alert=false;  //ai related.
    
    this.timer;  //timer obj, when animation done, use this to stop it(clearInterval()).
    this. accer=1;  //only 1/-1, this will be added when changing the frame. use currentframe + accer.
    this.route=new Array(); //route point collection. only for ai controlled players(enemy).    
    this.enabled=true;  //when false, this character will not be shown walkblocks in player's turn.
    this.visible=true;  //tells the system whether this character could be seen by any enemy.
    
    document.getElementById("maincontainer").appendChild(this.element);
    var file=fileString;
    
    
    
    
    var currentFrame=1; //current frame; 1-3. 
    var moveStep;
    var goalX,goalY;
    var that=this;
    
    //functions:
    this.startAnimation=function (step,direction,steps)
    {
        //step means the speed of moving. 
           //direction: 4-dirs
        //steps, how many grids will the char move.
        
        
        //set:
        moveStep=step;
        this.dir=direction;
        
        if(direction===1)
        {
            goalX=this.x;
            goalY=this.y+steps;
        }
        if(direction===4)
        {
            goalX=this.x;
            goalY=this.y-steps;
        }
        if(direction===2)
        {
            goalY=this.y;
            goalX=this.x-steps;
        }        
        if(direction===3)
        {
            goalY=this.y;
            goalX=this.x+steps;
        }          
        var index=xy2int(this.x,this.y);
                grids[index].occupied=0;
        
        
      //start the timer:
      this.timer=setInterval(this.tick,"60");
    };
    
    this.tick=function ()
    {
        //animation:
        
        
        if(currentFrame===3)
        {
            currentFrame=2;
            that.accer=-1;
        }
        else if(currentFrame===1)
        {
            currentFrame=2;
            that.accer=1;            
        }
        else
        {
            currentFrame+=that.accer;
            
        }
        //set the frame:
        //this.setFrame(currentFrame,this.dir);
        
        
        that.setFrame(currentFrame,that.dir);
        //move the character:
        var left_= parseInt( that.element.style.left);
        var top_= parseInt( that.element.style.top); 
        
        if(that.dir===1)
        {
            top_+=moveStep;
        }
        if(that.dir===4)
        {
            top_-=moveStep;
        }
        if(that.dir===2)
        {
            left_-=moveStep;
        }        
        if(that.dir===3)
        {
            left_+=moveStep;
        }         
        //set to the objects:
        that.element.style.left=left_+"px";
        that.element.style.top=top_+"px";
        that.element.style.zIndex=Math.floor(parseInt( that.element.style.top)/36);
        
        //detect the task.
        if(parseInt( that.element.style.left)/36===goalX &&
                parseInt( that.element.style.top)/36===goalY)
        {
            //finish:
            
            //clear timer:
                clearInterval(that.timer);
                that.x=goalX;
                that.y=goalY;
                
        if(that.id==="player")
        {
            grids[xy2int(goalX,goalY)].occupied=1;    //player
        }
        else
        {
            grids[xy2int(goalX,goalY)].occupied=2;   //enemy         
        }
                
                //check alert:
                if(that.route.length===0)
                {
                    that.alert=false;  //cancel the alert.
                }
                


                if(that.element.id==="player")
                {
                    //check if the player get any item in the current grid.
                    checkPlayer(that.x,that.y);
                    
                    
                
                            //check if all the players have walked, if yes, turn to enemy,if not make one more turn on players.
                    if(playerListIterator===playerList.length)
                    {
                        //finished all walking.
                        //playerListIterator=0; //reset
                        enemyTurn();
                    }
                    else
                    {
                        playerTurn(); //go on with the next player.
                    }
                }
                else
                {
                    enemyAllFinished.push(1);
                    checkEnemyAllFinished();
                }
                    

        }
        
        
    };
    
    
    this.setFrame=function(frame,dir)
    {
        this.element.style.backgroundImage="url('"+file+dir+frame+".png')"; 
        //console.log(file+dir+frame+".png");
    };

    
    this.setVisible=function (enabled)
    {
        if(enabled===true)
        {
            this.element.style.visibility="visible";
        }
        else
        {
            this.element.style.visibility="hidden";            
        }
    };
           this.getPosition=function ()
           {
               var ret={};
               ret.x=this.x;
               ret.y=this.y;
               return ret;
           };
    
}


//========================================Restored=========================================
//========================================Restored=========================================

function restore(eventID)
{
    //eventID: an integer that the caller will pass, it tells which event should this
    //function execute.
    //running this means we want to quit any event/dialog and move on with the game.
    
    cancelledMovement=false;
    if(eventID==null)
    {
            if(whosTurn===0)
            {
                if(playerListIterator===playerList.length)
                {
                    //finished all walking.
                    playerListIterator=0; //reset
                    enemyTurn();
                }
                else
                {
                    playerTurn(); //go on with the next player.
                }
            }
            else
            {
                showWalkBlocks(player);
            }
    }
}


function imageLoadStep(percentage,flag)
{
    
    if(flag===1)
    {
        document.getElementById("toplayer").innerHTML=percentage;
        //console.log(percentage+"% , "+imageLoaded+"/"+ imageLoad);
    }
    
    
    
}
function imageLoadFinish(flag)
{
    if(flag===1)
    {
        //initializing:
        document.getElementById("toplayer").style.visibility="hidden";
    }
}












}