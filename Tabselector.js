var selectedExaminable;
var selectedExaminableId = 0;
var canTabSelect = false;
var selectionEntity;

AFRAME.registerComponent('tabselector',{
  schema: {
    firstPosition : {type: 'vec3',default:{x:0, y:0, z:0}},
    isGridded: {type: 'bool', default:false},
    gridCooldown: {type: 'float', default:2}
  },
  
  init: function(){
    //var listOfExaminable = document.querySelectorAll('[examinable]');
    selectionEntity = this.el;
    var listOfExaminable = document.querySelectorAll('[examinable]');
    window.addEventListener('keydown', function(evt){ 
      if(selectedExaminableId === 0){
        //research for bodies each loop
        listOfExaminable = document.querySelectorAll('[examinable]');
      }
      //make sure we skip any elements that don't have valid 3d objects
      while(listOfExaminable[selectedExaminableId].object3D === undefined){
        selectedExaminableId = (selectedExaminableId + 1) % listOfExaminable.length;
      }
      //the Q key in decimol ascii
      var shortcutPressed = evt.keyCode === 81;
      if (!shortcutPressed || !canTabSelect){
        return;
      }
      selectedExaminable = listOfExaminable[selectedExaminableId];
      console.log(selectedExaminable.getAttribute('id') + " is selec " + selectedExaminableId + " " + listOfExaminable.length);
      selectedExaminableId = (selectedExaminableId + 1) % listOfExaminable.length;
      var examPos = new THREE.Vector3();
      //selectedExaminable.object3D.getWorldPosition(examPos);
      examPos.x -= selectedExaminable.components.examinable.data.centerOffset.x * 7.36;
      examPos.y -= selectedExaminable.components.examinable.data.centerOffset.y * 7.36;
      examPos.z -= selectedExaminable.components.examinable.data.centerOffset.z * 7.36;
      //entity.setAttribute('position', examPos);
      //selectionEntity.flushToDOM();
      //var copy = selectionEntity.cloneNode();
      //selectedExaminable.appendChild(copy);
      //selectionEntity.parentNode.removeChild(selectionEntity);
      //selectionEntity = copy;
      //selectionEntity.setAttribute("position", selectedExaminable.components.examinable.data.centerOffset);
      selectionEntity.object3D.parent=selectedExaminable.object3D;
      selectionEntity.setAttribute("position", examPos);
      
      });
    
    window.addEventListener('keydown', function(evt){
      //the enter key in decimol ascii
      var shortcutPressed = evt.keyCode === 13;
      if (!shortcutPressed || !canTabSelect){
        return;
      }
      
      if(selectedExaminable !== null){
        console.log(selectedExaminable.getAttribute('id') + " is select ");
        let examBoxComp = document.querySelector('[ExamBox]').components.exambox;
       examBoxComp.associate(selectedExaminable, selectedExaminable.components.examinable.data.centerOffset);
      }
      
    });
      
    },
    
    //todo setup tab button
  tick: function(time, timeDelta){
    if(canTabSelect && this.el.getAttribute('visible') == false){
      this.el.setAttribute('visible', true);
    }
    if(!canTabSelect && this.el.getAttribute('visible') == true){
      this.el.setAttribute('visible', false);
    }
    }
});