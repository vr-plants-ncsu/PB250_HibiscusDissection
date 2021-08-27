//TODO move or specify
var isActive = false;
var isPlaying = false;

AFRAME.registerComponent('contextanimplay',{
  schema: {
    animName:{type: 'string', default: ""}
  },
 init: function(){
   let contextButton = document.querySelector('[ContextButton]');
   contextButton.addEventListener('context_activate', this.onContext);
   let examBoxComp = document.querySelector('[ExamBox]');
   examBoxComp.addEventListener('associated', this.whenCAnimAssociated);
   examBoxComp.addEventListener('disassociated', this.whenCAnimDisassociated);
   this.el.components["animation-mixer"].stopAction();
 },
  onContext: function(){
    if(isActive){
      if(!isPlaying){
      //we assume any entity with this component will also have an animation-mixer from a-frame-extras
        this.el.components["animation-mixer"].playAction();
        return;
      }
      if(isPlaying){
        this.el.components["animation-mixer"].stopAction();
        return;
      }
    }
  },
  whenCAnimAssociated: function(event){
    if(event.detail.associatedEntity === this.el){
      isActive = true;
    }
  },
  whenCAnimDisassociated: function(event){
        if(event.detail.associatedEntity === this.el){
      isActive = false;
    }
  }
});