var lastPlacement = {x:0, y:0, z:0};
const gridX = 5;
const gridY = 5;
const gridOrigin = {x:-0.6,y:0.3,z:0};
var gridFactorX = 0;
var gridFactorY = 0;

AFRAME.registerComponent('gridable',{
  schema: {
    firstPosition : {type: 'vec3',default:{x:0, y:0, z:0}},
    isGridded: {type: 'bool', default:false},
    gridCooldown: {type: 'float', default:2}
  },
  
  init: function(){
    this.data.isGridded = false;
    this.data.firstPosition.x = this.el.object3D.position.x;
    this.data.firstPosition.y = this.el.object3D.position.y;
    this.data.firstPosition.z = this.el.object3D.position.z;
    var comp = this;
    
    var gridButton = document.querySelector("#gridbutton");
    gridButton.addEventListener('mousedown', function(){
      if(comp.data.gridCooldown > 0){
        return;
      }
      
      comp.toggleGrid();
      comp.data.gridCooldown = 2;
    });
    
    window.addEventListener('keydown', function(evt){
      //the D key in decimol ascii
      var shortcutPressed = evt.keyCode === 68;
      if (!shortcutPressed || comp.data.gridCooldown > 0){
        return;
      }
      comp.toggleGrid();
      comp.data.gridCooldown = 2;
    });
    
    this.resetGrid();
  },
  tick: function(time, timeDelta){
    if(this.data.gridCooldown > 0){
      this.data.gridCooldown -= timeDelta;
    }
  },
  toggleGrid: function(){
    var entity = this.el;
    if(!this.data.isGridded){
    //go row first, column second
    if(lastPlacement.x / (gridFactorX * 2) >= gridX - 1){
      //move down
      lastPlacement.y -= (gridFactorY * 2);
      lastPlacement.x = gridOrigin.x;
    }
    lastPlacement.x += (gridFactorX * 2);
    TweenMax.to(entity.object3D, 0.4, {three:{positionX: lastPlacement.x, positionY: lastPlacement.y,positionZ: lastPlacement.z}, ease:Sine.easeIn});
    this.data.isGridded = true;
      canTabSelect = true;
      return;
    }
    if(this.data.isGridded){
      TweenMax.to(entity.object3D, 0.4,
                  {three:{positionX: this.data.firstPosition.x,
                          positionY: this.data.firstPosition.y,
                          positionZ: this.data.firstPosition.z}, ease:Sine.easeIn});
      this.resetGrid();
      this.data.isGridded = false;
      canTabSelect = false;
    }
  },
  resetGrid : function(){
    gridFactorX = (1/gridX) * (0.5);
    gridFactorY = (1/gridY) * (0.5);
    lastPlacement.x = gridOrigin.x;
    lastPlacement.y = gridOrigin.y;
    lastPlacement.z = gridOrigin.z;
  }
});