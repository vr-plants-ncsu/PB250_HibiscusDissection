AFRAME.registerComponent('rotatable',{
  schema: {
    isRotating:{type:'bool', default: false},
    targetId:{type:'string', default:""},
    rotateY:{type:'bool', default: true},
    rotateZ:{type:'bool',default:true}
  },
  init: function(){
    let comp = this;
    let entity = this.el;

    if(this.data.targetId !== ''){
      entity = document.querySelector( '#' + this.data.targetId );
    }
    
    this.el.addEventListener('mousedown', function(){
      comp.data.isRotating = true;
    });
    document.addEventListener('mousedown', function(evt){
      this.oldClientX = evt.clientX;
      this.oldClientY = evt.clientY;
    });
    document.addEventListener('mouseup', function(){
      comp.data.isRotating = false;
    });
    document.addEventListener('mousemove', function(evt){
      if(comp.data.isRotating){
      var dX;
    var dY;
    //TODO find our pivot
    //var modelPivotEl = this.modelPivotEl;
    //todo rectify
    if (!this.oldClientX) { return; }
    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;
    //we can tweak these as speeds
    if(comp.data.rotateY){
    entity.object3D.rotation.y -= dX / 100;
    }
    if(comp.data.rotateZ){
    entity.object3D.rotation.z -= dY / 200;

    // Clamp x rotation to [-90,90]
    entity.object3D.rotation.z = Math.min(Math.max(-Math.PI / 2, entity.object3D.rotation.z), Math.PI / 2);
    }

    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
    }});
    
  }
});