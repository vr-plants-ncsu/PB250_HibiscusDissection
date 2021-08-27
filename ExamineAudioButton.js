AFRAME.registerComponent('examineaudio',{
  schema: {
    defAudioClip: {type:'string', default: "none"}
  },
  init: function(){
    var entity = this.el;
    let exambox = document.querySelector('[ExamBox]');
    exambox.addEventListener('associated', function(event){
      entity.components.examineaudio.data.defAudioClip = event.detail.associatedEntity.components.examinable.data.audioClipUrl;
    });
    exambox.addEventListener('disassociated', function(){
      //entity.components.examineaudio.data.defAudioClip = event.detail.associatedEntity.components.examinable.data.audioClipUrl;
    });
    this.el.addEventListener('mousedown', function(evt){
      if(entity.components.examineaudio.data.defAudioClip !== "none"){
        entity.setAttribute('sound',{src: entity.components.examineaudio.data.defAudioClip});
        entity.components.sound.playSound();
      }
    });
    window.addEventListener('keydown', function(evt){
      //the V key in decimol ascii
      var shortcutPressed = evt.keyCode === 86;
      if (!shortcutPressed){
        return;
      }
        if(entity.components.examineaudio.data.defAudioClip !== "none"){
        entity.setAttribute('sound',{src: entity.components.examineaudio.data.defAudioClip});
        entity.components.sound.playSound();
      }
      });
  }
});