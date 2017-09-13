
function roll(dieInput) {
  var parsedResult, numberOfDieToRoll, dieSize, optionList, bonusOrPenalty, optionArray;
  var rawRollResults = [], countedRollResults = [], finalValue = 0;
  
  parsedResult = dieInput.toLowerCase().replace(/\s/g, '').split(/^(\d+)?d(\d+)(([a-z]\d+)*)([\+\-](\d+))?$/);

  numberOfDieToRoll = parsedResult[1] || 1;
  dieSize           = parsedResult[2];
  optionList        = parsedResult[3];
  bonusOrPenalty    = parsedResult[5] ? parseInt(parsedResult[5]) : 0;
  
  if(optionList) {
    optionArray = optionList.match(/[a-z]\d+/g);
  }
  
  for(var i = 0; i < numberOfDieToRoll; i++) {
    rawRollResults.push(Math.ceil(Math.random() * dieSize));
  }
  
  var countedRollResults = rawRollResults.join('|').split('|'); // @todo: A better clone at some point
  
  if(optionArray) {
    optionArray.forEach(function(option) {
      var data = option.split(/([a-z])(\d+)/);
      var optionType = data[1];
      var optionValue = parseInt(data[2]);
      
      if(optionType === 'd') { // drop the lowest optionValur die rolls
        for(var i = 0; i < optionValue; i++) {
          countedRollResults.splice( countedRollResults.indexOf( Array.min(countedRollResults)), 1);
        }
      }
      if(optionType === 'h') { // drop the highest optionValue dir rolls
        for(var i = 0; i < optionValue; i++) {
          countedRollResults.splice( countedRollResults.indexOf( Array.max(countedRollResults)), 1);
        }
      }
      if(optionType === 'r') { // reroll rolls less than or equal to optionValue
        countedRollResults.forEach(function(die, index) {
          if(die <= optionValue) {
            var newRoll = roll('1d' + dieSize + 'r' + optionValue);
            countedRollResults[index] = newRoll;
          }
        });
      }
    });
  }
  
  countedRollResults.forEach(function(roll) {
    finalValue += parseInt(roll);
  });
  
  if(bonusOrPenalty) {
    finalValue += bonusOrPenalty;
  }
  
  return finalValue;
}

Array.min = function(array) {
  return Math.min.apply(Math, array);
}

Array.max = function(array) {
  return Math.max.apply(Math, array);
}
