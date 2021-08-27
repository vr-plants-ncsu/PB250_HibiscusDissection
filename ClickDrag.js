AFRAME.registerComponent("clickdrag", {
  schema: {
    centerOffset: {type: "vec3", default:{x:0, y:0, z:0}},
    isMoving: { type: "bool", default: false }
  },
  init: function() {
    let comp = this;
    let entity = this.el;

    if (this.data.targetId !== "") {
      entity = document.querySelector("#" + this.data.targetId);
    }

    this.el.addEventListener("mousedown", function() {
      comp.data.isMoving = true;
    });
    document.addEventListener("mousedown", function(evt) {
      this.oldClientX = evt.clientX;
      this.oldClientY = evt.clientY;
    });
    document.addEventListener("mouseup", function() {
      comp.data.isMoving = false;
    });
    document.addEventListener("mousemove", function(evt) {
      if (comp.data.isMoving) {
        var dX;
        var dY;
        //TODO find our pivot
        //var modelPivotEl = this.modelPivotEl;
        //todo rectify
        if (!this.oldClientX) {
          return;
        }
        dX = this.oldClientX - evt.clientX;
        dY = this.oldClientY - evt.clientY;

        //get this distance between this object and the camera
        //apply the delta to the scrren space position, then unproject that
        //lerp the object to the screen space offset world position
        var camera = document.querySelector("[camera]");
        //todo use world positions here
        //var camDist = camera.object3D.position.distanceTo(entity.object3D.position);
        //find the screen position of the object
        var screenPos = comp.el.object3D.position.clone();
        comp.el.object3D.getWorldPosition(screenPos);
        screenPos.project(camera.getObject3D("camera"));
        //multiply by 2 and subtract 1 to remap from 0/1 to -1/1
        screenPos.x = ((evt.clientX/document.body.clientWidth) * 2 - 1);
        screenPos.y = -((evt.clientY/document.body.clientHeight) * 2 - 1);
        //target the local position after unprojecting
        screenPos.unproject(camera.getObject3D("camera"));
        screenPos = comp.el.object3D.parent.worldToLocal(screenPos);
        //add the offset
        screenPos.x += comp.data.centerOffset.x;
        screenPos.y += comp.data.centerOffset.y;
        screenPos.z += comp.data.centerOffset.z;

        TweenMax.to(comp.el.object3D, 0.1, {
          three: {
            positionX: screenPos.x,
            positionY: screenPos.y,
            positionZ: screenPos.z
          },
          ease: Sine.easeIn
        });

        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
        //todo this is working alright but we should use the mouse position instead of the position delta...
      }
    });
  }
});
