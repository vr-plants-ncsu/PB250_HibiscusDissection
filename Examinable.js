var clickCooldownCounter = 0;

AFRAME.registerComponent('examinable',{
  schema: {
    clickCooldown: {type: 'float', default: 0.2},
    headerText: {type:'string', default: "Topic"},
    contentText: {type:'string', default: "Examine content"},
    audioClipUrl: {type:'string', default: "none"},
    centerOffset: {type: "vec3", default:{x:0, y:0, z:0}}
  },
 init: function(){
   this.resetCounter();
   let entity = this.el;
   let comp = this;
   let examBoxComp = document.querySelector('[ExamBox]');
   examBoxComp.addEventListener('associated', this.whenAssociated);
   examBoxComp.addEventListener('disassociated', this.whenDisassociated);
   entity.addEventListener('mousedown', function(evt){
     if(clickCooldownCounter > 0){
       return;
     }
     this.components.examinable.resetCounter();
     //find our examination box
     let examBoxComp = document.querySelector('[ExamBox]').components.exambox;
     examBoxComp.associate(entity, comp.data.centerOffset);
   })
 },
  tick: function(time, timeDelta){
    if(clickCooldownCounter > 0){
    clickCooldownCounter -= timeDelta/1000;
      
    }
  },
  resetCounter: function(){
    clickCooldownCounter = this.data.clickCooldown;
  },
  whenAssociated: function(event){
    //if the detail entity is this entity we react locally
    if(event.detail.associatedEntity === this.el){
      return;
    }
    //if not we can use this event to react to a different entity being examined
  },
  whenDisassociated: function(event){
    //if the detail entity is this entity we react locally
    if(event.detail.disassociatedEntity === this.el){
      return;
    }
    //if not we can use this event to react to a different entity being removed
  }
});