const examObjectBaseScale = 0.6;

var target = null;
var clickCooldownCounter = 0;
var startingScale = 0.6;
var entity = null;

AFRAME.registerComponent('scalebutton',{
  schema: {
    clickCooldown:{type: 'float', default: 0.2},
    scaleDelta: {type: 'float', default: 0},
    scaleMin: {type: 'float', default: -1000},
    scaleMax: {type: 'float', default: 1000},
    currentScale: {type: 'float', default: 0}
  },
 init: function(){
   let examBoxComp = document.querySelector('[ExamBox]');
   entity = this.el;
   let scaleDel = this.data.scaleDelta;
   examBoxComp.addEventListener('associated', this.whenScaleAssociated);
   examBoxComp.addEventListener('disassociated', this.whenScaleDisassociated);
   startingScale = 
   this.el.addEventListener('mousedown', function(evt){
     if(clickCooldownCounter > 0){
       return;
     }
     this.components.scalebutton.resetCounter();
     //apply the scale delta till we hit the min or max
     if(target != null){
       let nextScale = entity.components.scalebutton.data.currentScale + scaleDel;
       if(scaleDel == 0)
         nextScale = examObjectBaseScale;
       if(nextScale > entity.components.scalebutton.scaleMax){
         nextScale = entity.components.scalebutton.scaleMax;
       }
       if(nextScale < entity.components.scalebutton.scaleMin){
         nextScale = entity.components.scalebutton.scaleMin;
       }
       TweenMax.to(target.object3D, 0.3, {three:{scaleX:nextScale, scaleY:nextScale, scaleZ:nextScale}, ease:Sine.easeIn});
       entity.components.scalebutton.data.currentScale = nextScale;
     }
   });
   
   window.addEventListener('keydown', function(evt){
      //the R or E key in decimol ascii
     if(scaleDel == 0){
       var shortcutPressed = evt.keyCode === 87;
     }
     if(scaleDel > 0){
      var shortcutPressed = evt.keyCode === 82;
     }
     if(scaleDel < 0){
       var shortcutPressed = evt.keyCode === 69;
     }
      if (!shortcutPressed){
        return;
      }
     
     if(clickCooldownCounter > 0){
       return;
     }
     entity.components.scalebutton.resetCounter();
     //apply the scale delta till we hit the min or max
     if(target != null){
       let nextScale = entity.components.scalebutton.data.currentScale + scaleDel;
       if(scaleDel == 0)
         nextScale = examObjectBaseScale;
       if(nextScale > entity.components.scalebutton.scaleMax){
         nextScale = entity.components.scalebutton.scaleMax;
       }
       if(nextScale < entity.components.scalebutton.scaleMin){
         nextScale = entity.components.scalebutton.scaleMin;
       }
       TweenMax.to(target.object3D, 0.3, {three:{scaleX:nextScale, scaleY:nextScale, scaleZ:nextScale}, ease:Sine.easeIn});
       entity.components.scalebutton.data.currentScale = nextScale;
      }
      });
   
 },
  tick: function(time, timeDelta){
    if(clickCooldownCounter > 0){
    clickCooldownCounter -= timeDelta/1000;
    }
  },
  resetCounter: function(){
    clickCooldownCounter = this.data.clickCooldown;
  },
  //these names have to be unique!
  whenScaleAssociated: function(event){
    //we're assuming a uniform scale to start but we'll be applying one anyway
    target = event.detail.cloneEntity;
    entity.components.scalebutton.data.currentScale = examObjectBaseScale;
  },
  whenScaleDisassociated: function(event){
    target = null;
  }
});