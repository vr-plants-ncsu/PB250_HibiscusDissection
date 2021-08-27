var header = null;
var content = null;
var calloutFocused = false;
var calloutStart = new THREE.Vector3();
var calloutDefRot = new THREE.Vector3();

AFRAME.registerComponent('examinecallout',{
  schema: {
    defHeader: {type:'string', default: ""},
    defContent: {type:'string', default:""},
    fullContent:{type: 'string', default:""},
    focusDepth: {type:'float', default:0.3},
    focusCooldown: {type:'float', default:0},
    contentPage: {type:'int', default:0},
    numPages: {type: 'int', default:0},
    buttonDown: {type: 'float', default: 3}
  },
  init: function(){
    calloutStart.x = this.el.object3D.position.x;
    calloutStart.y = this.el.object3D.position.y;
    calloutStart.z = this.el.object3D.position.z;
    calloutDefRot.x = this.el.object3D.rotation.x * 180 / Math.PI;
    calloutDefRot.y = this.el.object3D.rotation.y * 180 / Math.PI;
    calloutDefRot.z = this.el.object3D.rotation.z * 180 / Math.PI;
    
    var comp = this;
    window.addEventListener('keydown', function(evt){
      //the F key in decimol ascii
      var shortcutPressed = evt.keyCode === 71;
      if (!shortcutPressed || comp.data.focusCooldown > 0){
        return;
      }
      comp.focusScreen(comp);
      comp.data.focusCooldown = 2;
    });
    
    let expandButton = document.querySelector('#ExpandButton');
    expandButton.addEventListener('mousedown', function(){
      comp.focusScreen(comp);
      comp.data.focusCooldown = 2;
    });
    
    //find page buttons and setup events
    let leftCalloutButton = document.querySelector('#LeftCalloutButton');
    let rightCalloutButton = document.querySelector('#RightCalloutButton');
    //set visibility to false by default
    leftCalloutButton.setAttribute('visible', false);
    rightCalloutButton.setAttribute('visible', false);
    
    header = document.querySelector('#examinetextheader').components.text;
    content = document.querySelector('#examinetextbody').components.text;
    let ref = this.el.components.examinecallout;
    header.data.value = ref.data.defHeader;
    content.data.value = ref.data.defContent;
    let exambox = document.querySelector('[ExamBox]');
    exambox.addEventListener('associated', function(event){
      header.el.setAttribute('text','value',event.detail.associatedEntity.components.examinable.data.headerText);
      comp.data.fullContent = event.detail.associatedEntity.components.examinable.data.contentText;
      
      //setup to seperate around the 140 char mark while splitting at a space
      let pageString = comp.data.fullContent.substring(0, comp.findSpaceBefore(comp.data.fullContent, 145));
      comp.data.contentPage = 0;
      content.el.setAttribute('text','value',pageString);
      
      comp.data.numPages = event.detail.associatedEntity.components.examinable.data.contentText.length / 145;
    if(comp.data.numPages > 3){
      //console.Log("Size of pages excedes three, consider reducing text length");
    }
      if(comp.data.numPages > 1){
        rightCalloutButton.setAttribute('visible', true);
      }
    });
    exambox.addEventListener('disassociated', function(){
      header.el.setAttribute('text','value',ref.data.defHeader);
      content.el.setAttribute('text', 'value', ref.data.defContent);
    });
    
    
    leftCalloutButton.addEventListener('mousedown', function(){
      if(comp.data.contentPage == 0 || comp.data.buttonDown > 0){
        return;
      }
      comp.data.buttonDown = 3;
      comp.data.contentPage--;
      let pageString = comp.data.fullContent.substring(comp.findSpaceBefore(comp.data.fullContent,comp.data.contentPage * 145),
                                                     comp.findSpaceBefore(comp.data.fullContent,comp.data.contentPage * 145 + 145));
      content.el.setAttribute('text','value',pageString);
      if(comp.data.contentPage == 0){
        leftCalloutButton.setAttribute('visible', false);
      }
      if(comp.data.contentPage < comp.data.numPages){
        rightCalloutButton.setAttribute('visible', true);
      }
                                       });
    
    rightCalloutButton.addEventListener('mousedown', function(){
      if(comp.data.contentPage >= comp.data.numPages || comp.data.buttonDown > 0){
        return;
      }
      comp.data.buttonDown = 3;
      comp.data.contentPage++;
      let pageString = "";
      if(comp.data.contentPage * 145 < (comp.data.fullContent.length - 145)){
        //set this up to split at spaces
        pageString = comp.data.fullContent.substring(comp.findSpaceBefore(comp.data.fullContent,comp.data.contentPage * 145),
                                                     comp.findSpaceBefore(comp.data.fullContent,comp.data.contentPage * 145 + 145));
      }
      if(comp.data.contentPage * 145 >= (comp.data.fullContent.length - 145)){
        pageString = comp.data.fullContent.substring(comp.findSpaceBefore(comp.data.fullContent,comp.data.contentPage * 145), comp.data.fullContent.length);
      }
      content.el.setAttribute('text','value',pageString);
      if(comp.data.contentPage >= comp.data.numPages - 1){
        rightCalloutButton.setAttribute('visible', false);
      }
      if(comp.data.contentPage != 0){
        leftCalloutButton.setAttribute('visible', true);
      }
                                       });
                                       
    
    
  },
  tick: function(time, timeDelta){
    if(this.data.focusCooldown > 0){
      this.data.focusCooldown -= timeDelta;
    }
    if(this.data.buttonDown > 0){
      this.data.buttonDown -= timeDelta;
    }
  },
  focusScreen: function(comp){
    var entity = comp.el;
    if(!calloutFocused){
      //lerp the callout to be just in front of the viewer's camera
      var cam = entity.sceneEl.camera;
      //the fourth row contains the forward direction of the matrix, negative because openGL https://gamedev.net/forums/topic/319213-direction-vector-from-rotation-matrix/3053474/
      var forward = new THREE.Vector3( cam.matrixWorld.elements[7], cam.matrixWorld.elements[11], cam.matrixWorld.elements[15]);
      forward.multiplyScalar(-this.data.focusDepth);
      var worldCamPos = new THREE.Vector3();
      cam.getWorldPosition(worldCamPos);
      forward.addVectors(forward,worldCamPos);
      forward = entity.object3D.parent.worldToLocal(forward);
      
      //now setup rotation
      var rotTarget = new THREE.Vector3(cam.rotation.x,cam.rotation.y,cam.rotation.z);

      rotTarget.x -= entity.object3D.rotation.x;
      rotTarget.y -= entity.object3D.rotation.y;
      rotTarget.z -= entity.object3D.rotation.z;
      rotTarget.x *= 180.0 / Math.PI;
      rotTarget.y *= 180.0 / Math.PI;
      rotTarget.z *= 180.0 / Math.PI;
      rotTarget.y = (rotTarget.y - 90) % 360;
      //entity.object3D.lookAt(worldCamPos);
      
      TweenMax.to(entity.object3D, 0.4, {three:{positionX: forward.x, positionY: forward.y,positionZ: forward.z}, ease:Sine.easeIn});
      TweenMax.to(entity.object3D, 0.4, {three:{rotationX: rotTarget.x, rotationY: rotTarget.y,rotationZ: rotTarget.z}, ease:Sine.easeIn});
      calloutFocused = true;
      return;
    }
    if(calloutFocused){
      TweenMax.to(entity.object3D, 0.4, {three:{positionX: calloutStart.x, positionY: calloutStart.y,positionZ: calloutStart.z}, ease:Sine.easeIn});
      TweenMax.to(entity.object3D, 0.4, {three:{rotationX: calloutDefRot.x,
                                                rotationY: calloutDefRot.y,
                                                rotationZ: calloutDefRot.z}, ease:Sine.easeIn});
      calloutFocused = false;
    }
  },
  findSpaceBefore: function(word, index){
    if(index > word.length){
      return(index);
    }
      for(let i = index;i > 0; i--){
        if(word.charAt(i) === " "){
          return(i);
        }
      }
    return(0);
}
});