AFRAME.registerComponent("hovercallout", {
  schema: {
    hoverText: { type: "string", default: "" }
  },
  init: function() {
    //on hover find the callout text and change it to hoverText
    var comp = this;
    
    this.el.addEventListener('mouseenter', function(evt){
      var calloutTextComp = document.querySelector('#callouttext');
      //TweenMax.to(comp.el.object3D, 0.4, {three:{visible: 1}, ease:Sine.easeIn});
      calloutTextComp.setAttribute('text','value',comp.data.hoverText);
    });
    this.el.addEventListener('mouseleave', function(evt){
      var calloutTextComp = document.querySelector('#callouttext');
      //TweenMax.to(comp.el.object3D, 0.4, {three:{visible: 0}, ease:Sine.easeIn});
      //todo seems like GSP isn't helping here so we'll have to do this manually
      calloutTextComp.setAttribute('text','value','');
    });
  }
});
