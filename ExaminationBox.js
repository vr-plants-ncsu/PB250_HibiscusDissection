var storedObject = null;
var canAssociate = true;
var storedRotation = new THREE.Vector3(0,0,0);
var storedPosition = new THREE.Vector3(0,0,0);
var storedScale = new THREE.Vector3(0,0,0);

AFRAME.registerComponent('exambox',{
  schema: {
    snapedRotation: {type: 'vec3', default:{x:0, y:0, z:0}},
    snapedScale: {type: 'vec3', default: {x:0, y:0, z:0}},
    snapedOffset: {type: 'vec3', default: {x:0, y:0, z:0}}
  },
  init: function (){
  },
  tick: function(){
  //get the location of all the entities in our check list
    
  //if any of them are close enough to our cast point and the box is empty
    //make that object our stored object and require it be removed before 
    //adding any other new objects
},
  associate: function(entity, centerOffset){
        //if we already have a stored entity, dissassocite first
    if(storedObject !== null){
      this.disassociate();
    }
    //clone the entity
    var clone3d = new THREE.Object3D();
    clone3d = entity.object3D.clone();
    var newEntity = document.createElement('a-entity');
    var childEn = document.createElement('a-entity');
    var gltfstring = entity.components['gltf-model'].data;
    console.log(gltfstring);
    //todo create an empty to make the pivot the center
    var scene = document.querySelector('a-scene');
    scene.appendChild(newEntity);
    newEntity.appendChild(childEn);
    
    childEn.setAttribute('gltf-model',gltfstring);
    childEn.setAttribute('scale',entity.object3D.scale);
    childEn.setAttribute('id',"examModelChild");
    //TODO add an offset from examinable to the local position of the childObject
    childEn.setAttribute('position',{x:centerOffset.x, y:centerOffset.y, z:centerOffset.z})
    newEntity.setAttribute('id', "examModel")
    newEntity.setAttribute('class',"dissect");
    newEntity.setAttribute('rotatable',"");
    newEntity.setAttribute('geometry',{primitive:"sphere", radius:0.4});
    newEntity.setAttribute('scale',{x: 0.3, y: 0.3, z: 0.3});
    newEntity.setAttribute('material',{opacity:0});
    entity.object3D.getWorldPosition(newEntity.object3D.position);
    //entity.object3D.getWorldQuaternion(newEntity.object3D.quaternion);
    entity.object3D.getWorldScale(newEntity.object3D.scale);

    //TweenMax.to(newEntity.object3D, 0.3, {three:{rotationX:this.data.snapedRotation.x, rotationY:this.data.snapedRotation.y, rotationZ:this.data.snapedRotation.z}, ease:Sine.easeIn});
    let offsetLocation = new THREE.Vector3(0,0,0);    
    let worldPos = new THREE.Vector3(0,0,0);
    
    offsetLocation.addVectors(this.el.object3D.position, this.data.snapedOffset);
    TweenMax.to(newEntity.object3D, 0.3, {three:{positionX: offsetLocation.x, positionY: offsetLocation.y,positionZ: offsetLocation.z}, ease:Sine.easeIn});
    //TODO have a look here for positioning
    //childEn.setAttribute('position',{x: 1, y: 0, z:0});
    storedScale = entity.object3D.scale;
    TweenMax.to(newEntity.object3D, 0.3, {three:{scaleX:this.data.snapedScale.x, scaleY:this.data.snapedScale.y, scaleZ:this.data.snapedScale.z}, ease:Sine.easeIn});
    //rotate to our ideal rotation
    storedObject = newEntity;
    //set to ideal scale
    //make it impossible to associate other objects
    canAssociate = false;
    
    this.el.emit('associated',{associatedEntity: entity, cloneEntity: newEntity},false);
  },
  disassociate: function(){
    //TweenMax.to(storedObject.object3D, 0.3, {three:{rotationX:storedRotation.x, rotationY:storedRotation.y, rotationZ:storedRotation.z}, ease:Sine.easeOut});
    //TweenMax.to(storedObject.object3D, 0.3, {three:{positionX: storedPosition.x, positionY: storedPosition.y,positionZ: storedPosition.z}, ease:Sine.easeOut});
    TweenMax.to(storedObject.object3D, 0.3, {three:{scaleX:0, scaleY:0, scaleZ:0}, ease:Sine.easeOut});
    //todo add this as a scale callout
    storedObject.parentNode.removeChild(storedObject);
    
    //TweenMax.to(storedObject.object3D, 0.3, {three:{opacity: 1.0}, ease:Sine.easeIn});
    //storedObject.object3D.rotation.set(0, 0, 0);
    this.el.emit('disassociated',{disassociatedEntity: storedObject},false);
    storedObject = null;
    canAssociate = true;
  },
  centerLocalChild: function(parent, child){
    //draw a box around the parent
    //get the center of that box
    //set the child's position to the world position of that center
  }
});