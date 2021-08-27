var selectedExaminable;
var selectedExaminableId = 0;
var canTabSelect = false;

AFRAME.registerComponent('tabselector',{
  schema: {
    firstPosition : {type: 'vec3',default:{x:0, y:0, z:0}},
    isGridded: {type: 'bool', default:false},
    gridCooldown: {type: 'float', default:2}
  },
  
  init: function(){
    //var listOfExaminable = document.querySelectorAll('[examinable]');
    var entity = this.el;
    var listOfExaminable = document.querySelectorAll('[examinable]');;
    window.addEventListener('keydown', function(evt){ 
      //make sure we skip any elements that don't have valid 3d objects
      while(listOfExaminable[selectedExaminableId].object3D === undefined){
        listOfExaminable = document.querySelectorAll('[examinable]');
        selectedExaminable = listOfExaminable[selectedExaminableId];
        selectedExaminableId = (selectedExaminableId + 1) % listOfExaminable.length;
      }
      //the Q key in decimol ascii
      var shortcutPressed = evt.keyCode === 81;
      if (!shortcutPressed || !canTabSelect){
        return;
      }
      selectedExaminable = listOfExaminable[selectedExaminableId];
      selectedExaminableId = (selectedExaminableId + 1) % listOfExaminable.length;
      
      var examPos = new THREE.Vector3();
      selectedExaminable.object3D.getWorldPosition(examPos);
      
      entity.setAttribute('position', examPos);
      
      
      
      });
    
    window.addEventListener('keydown', function(evt){
      //the enter key in decimol ascii
      var shortcutPressed = evt.keyCode === 13;
      if (!shortcutPressed || !canTabSelect){
        return;
      }
      
      if(selectedExaminable !== null){
        let examBoxComp = document.querySelector('[ExamBox]').components.exambox;
       examBoxComp.associate(selectedExaminable);
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