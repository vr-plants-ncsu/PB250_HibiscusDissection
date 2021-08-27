var crossSection;
var crossSectionIsVisible = false;
var crossSectionIsActive = false;

AFRAME.registerComponent('contextvisible',{
  schema: {
    gltfName:{type: 'string', default: ""},
    isActive:{type: 'bool', default: false},
    isVisible:{type: 'bool', default: false}
  },
 init: function(){
   let contextButton = document.querySelector('[ContextButton]');
   contextButton.addEventListener('context_activate', this.onContext);
   let examBoxComp = document.querySelector('[ExamBox]');
   examBoxComp.addEventListener('associated', this.whenCVisAssociated);
   examBoxComp.addEventListener('disassociated', this.whenCVisDisassociated);
   //this.makeModel();
 },
  onContext: function(){
    if(crossSectionIsActive){
      if(!crossSectionIsVisible){
        crossSection.setAttribute('visible',true);
        crossSectionIsVisible = true;
        return;
      }
      if(crossSectionIsVisible){
        crossSection.setAttribute('visible',false);
        crossSectionIsVisible = false;
        return;
      }
    }
  },
  whenCVisAssociated: function(event){
      if(event.detail.associatedEntity.components.contextvisible){
      event.detail.associatedEntity.components.contextvisible.makeModel();
      event.detail.cloneEntity.appendChild(crossSection);
      crossSectionIsActive = true;
      }
  },
  whenCVisDisassociated: function(event){
    if(event.detail.disassociatedEntity.components.contextvisible){
      event.detail.disassociatedEntity.components.contextvisible.removeModel();
      crossSectionIsActive = false;
    }
  },
  makeModel: function(){
    //make the cross section object
   crossSection = document.createElement('a-entity');
   crossSection.setAttribute('id', 'crosssection')
   crossSection.setAttribute('gltf-model',this.data.gltfName);
   crossSection.setAttribute('visible',false);
   crossSection.setAttribute('scale',this.el.getAttribute('scale'));
  },
  removeModel: function(){
    crossSection.parentNode.removeChild(crossSection);
  }
});