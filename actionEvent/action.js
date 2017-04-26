$(document).ready(function(){
  var testVariableLocal = 1;
  testScopeOfDocumentReady(testVariableLocal);
});

$(document).ready(function(){
  var secondScopeLocal = 2;
  secondScope(secondScopeLocal);
});

function testScopeOfDocumentReady(testVariable){
    if(testVariable === 1){
      var e1 = document.getElementById("e1");
      e1.addEventListener('click', function(){
        alert("Test: Click function!");
      });
  }else{
      alert("not here");
  }
}

function secondScope(testVariable2){
    if(testVariable2 === 2){
      var e1 = document.getElementById("e2");
      e1.addEventListener('mouseover', function(){
        alert("Test: Mouseover function!");
      });
  }else{
      alert("not here");
  }
}