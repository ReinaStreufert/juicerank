(function() {
  // implement merge sort with input-supplied comparisons
  let pairsort = {};
  window.pairsort = pairsort;

  let createPairSorter = function(partialSets, mergedSets, currentMerge, limit) {
    let pairsorter = {};
    pairsorter.partialSets = partialSets;
    pairsorter.mergedSets = mergedSets;
    let initialLeftSet = partialSets[currentMerge.mergeStartIndex];
    let initialRightSet = partialSets[currentMerge.mergeStartIndex + 1];
    pairsorter.challenge = [initialLeftSet[currentMerge.leftIndex], initialRightSet[currentMerge.rightIndex]];
    pairsorter.select = function(selection) {
      let leftSet = pairsorter.partialSets[currentMerge.mergeStartIndex];
      let rightSet = pairsorter.partialSets[currentMerge.mergeStartIndex + 1];
      let trim = Math.max(0, leftSet.length + rightSet.length - limit);
      if (selection < 1) { // left side > right side
        if (currentMerge.mergeIndex >= trim) {
          currentMerge.mergedSet[currentMerge.mergeIndex - trim] = rightSet[currentMerge.rightIndex];
        }
        currentMerge.rightIndex++;
        currentMerge.mergeIndex++;
      } else {
        if (currentMerge.mergeIndex >= trim) {
          currentMerge.mergedSet[currentMerge.mergeIndex - trim] = leftSet[currentMerge.leftIndex];
        }
        currentMerge.leftIndex++;
        currentMerge.mergeIndex++;
      }
      if (currentMerge.leftIndex >= leftSet.length) {
        for (; currentMerge.rightIndex < rightSet.length; currentMerge.rightIndex++) {
          if (currentMerge.mergeIndex >= trim) {
            currentMerge.mergedSet[currentMerge.mergeIndex - trim] = rightSet[currentMerge.rightIndex];
          }
          currentMerge.mergeIndex++;
        }
      } else if (currentMerge.rightIndex >= rightSet.length) {
        for (; currentMerge.leftIndex < leftSet.length; currentMerge.leftIndex++) {
          if (currentMerge.mergeIndex >= trim) {
            currentMerge.mergedSet[currentMerge.mergeIndex - trim] = leftSet[currentMerge.leftIndex];
          }
          currentMerge.mergeIndex++;
        }
      }
      if (currentMerge.mergeIndex - trim >= currentMerge.mergedSet.length) {
        pairsorter.mergedSets[currentMerge.mergeStartIndex / 2] = currentMerge.mergedSet;
        currentMerge.mergeStartIndex += 2;
        if (currentMerge.mergeStartIndex + 1 >= pairsorter.partialSets.length) {
          if (currentMerge.mergeStartIndex < pairsorter.partialSets.length) {
            pairsorter.mergedSets[currentMerge.mergeStartIndex / 2] = pairsorter.partialSets[currentMerge.mergeStartIndex];
          }
          if (pairsorter.mergedSets.length == 1) {
            return pairsorter.mergedSets[0];
          }
          pairsorter.partialSets = pairsorter.mergedSets;
          pairsorter.mergedSets = new Array(Math.ceil(pairsorter.partialSets.length / 2))
          currentMerge.mergeStartIndex = 0;
        }
        currentMerge.leftIndex = 0;
        currentMerge.rightIndex = 0;
        currentMerge.mergeIndex = 0;
        leftSet = pairsorter.partialSets[currentMerge.mergeStartIndex];
        rightSet = pairsorter.partialSets[currentMerge.mergeStartIndex + 1];
        currentMerge.mergedSet = new Array(Math.min(leftSet.length + rightSet.length, limit));
      }
      pairsorter.challenge = [leftSet[currentMerge.leftIndex], rightSet[currentMerge.rightIndex]];
      return null;
    };
    pairsorter.introduce = function(items) {
      let oldPartialSetCount = pairsorter.partialSets;
      pairsorter.partialSets.length = pairsorter.partialSets.length + items.length;
      pairsorter.mergedSets.length = Math.ceil(pairsorter.partialSets.length / 2);
      for (let i = 0; i < items.length; i++) {
        pairsorter.partialSets[oldPartialSetCount + i] = [items[i]];
      }
    };
    pairsorter.getPairsRemaining = function() {
      let result = {
        min: 0,
        max: 0
      };
      // add to result for the current merge
      let leftSet = pairsorter.partialSets[currentMerge.mergeStartIndex];
      let rightSet = pairsorter.partialSets[currentMerge.mergeStartIndex + 1];
      result.min += Math.min(leftSet.length - currentMerge.leftIndex, rightSet.length - currentMerge.rightIndex);
      result.max += Math.max(leftSet.length + rightSet.length - 1) - currentMerge.mergeIndex;
      let simMergeIndex = currentMerge.mergeStartIndex;
      let partialSetCounts = pairsorter.partialSets.map(function(s) { return s.length; });
      let mergedSetCounts = new Array(Math.ceil(partialSetCounts.length / 2));
      // set merged set counts for merges already completed before simulation starts
      for (let i = 0; i <= simMergeIndex; i += 2) {
        let leftLength = partialSetCounts[simMergeIndex];
        let rightLength = partialSetCounts[simMergeIndex + 1];
        mergedSetCounts[i / 2] = leftLength + rightLength;
      }
      // perform simulated merges
      for (;;) {
        simMergeIndex += 2;
        if (simMergeIndex + 1 >= partialSetCounts.length) {
          if (simMergeIndex < partialSetCounts.length) {
            mergedSetCounts[simMergeIndex / 2] = partialSetCounts[simMergeIndex];
          }
          if (mergedSetCounts.length == 1) {
            return result;
          }
          simMergeIndex = 0;
          partialSetCounts = mergedSetCounts;
          mergedSetCounts = new Array(Math.ceil(partialSetCounts.length / 2));
        }
        let leftLength = partialSetCounts[simMergeIndex];
        let rightLength = partialSetCounts[simMergeIndex + 1];
        result.min += Math.min(leftLength, rightLength);
        result.max += leftLength + rightLength - 1;
        mergedSetCounts[simMergeIndex / 2] = leftLength + rightLength;
      }
    };
    pairsorter.saveState = function(itemKeyCallback) {
      let serializedPartialSets = new Array(pairsorter.partialSets.length);
      let serializedMergedSets = new Array(currentMerge.mergeStartIndex / 2);
      for (let i = 0; i < pairsorter.partialSets.length; i++) {
        serializedPartialSets[i] = pairsorter.partialSets[i].map(itemKeyCallback);
      }
      for (let i = 0; i < serializedMergedSets.length; i++) {
        serializedMergedSets[i] = pairsorter.mergedSets[i].map(itemKeyCallback);
      }
      let serializedCurrentMerge = {
        mergeStartIndex: currentMerge.mergeStartIndex,
        leftIndex: currentMerge.leftIndex,
        rightIndex: currentMerge.rightIndex,
        mergeIndex: currentMerge.mergeIndex,
        mergedSet: new Array(currentMerge.mergeIndex)
      };
      for (let i = 0; i < currentMerge.mergeIndex; i++) {
        serializedCurrentMerge.mergedSet[i] = itemKeyCallback(currentMerge.mergedSet[i]);
      }
      return JSON.stringify({
        limit: limit,
        partialSets: serializedPartialSets,
        mergedSets: serializedMergedSets,
        currentMerge: serializedCurrentMerge
      });
    };
    return pairsorter;
  }

  pairsort.new = function(items, limit) {
    let partialSets = new Array(items.length);
    let mergedSets = new Array(Math.ceil(items.length / 2))
    for (let i = 0; i < items.length; i++) {
      partialSets[i] = [items[i]];
    }
    let currentMerge = {
      mergeStartIndex: 0,
      leftIndex: 0,
      rightIndex: 0,
      mergeIndex: 0,
      mergedSet: new Array(Math.min(2, limit))
    };
    return createPairSorter(partialSets, mergedSets, currentMerge, limit);
  };

  pairsort.restoreState = function(sortStateJSON, itemValCallback) {
    let sortState = JSON.parse(sortStateJSON);
    let partialSetCount = sortState.partialSets.length;
    let partialSets = new Array(partialSetCount);
    let mergedSets = new Array(Math.ceil(partialSetCount / 2))
    for (let i = 0; i < partialSetCount; i++) {
      partialSets[i] = sortState.partialSets[i].map(itemValCallback);
    }
    for (let i = 0; i < sortState.mergedSets.length; i++) {
      mergedSets[i] = sortState.mergedSets[i].map(itemValCallback);
    }
    let currentMerge = sortState.currentMerge;
    currentMerge.mergedSet = currentMerge.mergedSet.map(itemValCallback);
    let leftSet = partialSets[currentMerge.mergeStartIndex];
    let rightSet = partialSets[currentMerge.mergeStartIndex + 1];
    currentMerge.mergedSet.length = leftSet.length + rightSet.length;
    return createPairSorter(partialSets, mergedSets, currentMerge, sortState.limit);
  };

  pairsort.pickTest = function(count) {
    let arr = new Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.round(Math.random() * 1000);
    }
    let pairsorter = pairsort.new(arr);
    for (;;) {
      let remaining = pairsorter.getPairsRemaining();
      console.log(`Pairs remaining: ${remaining.min} - ${remaining.max}`)
      console.log(`,:${pairsorter.challenge[0]} .:${pairsorter.challenge[1]}`);
      let input = prompt();
      let selectResult = null;
      if (input == ",") {
        selectResult = pairsorter.select(0);
      } else {
        selectResult = pairsorter.select(1);
      }
      if (selectResult != null) {
        console.log(selectResult);
        return;
      }
    }
  };

  pairsort.performanceTest = function(count, limit) {
    let arr = new Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.round(Math.random() * 10000);
    }
    let pairsorter = pairsort.new(arr, limit);
    let pairCount = 0;
    for (;;) {
      pairCount++;
      let state = pairsorter.saveState(function(k) { return k; });
      let selectResult = pairsorter.select(pairsorter.challenge[0] > pairsorter.challenge[1] ? 0 : 1);
      if (selectResult != null) {
        console.log(arr);
        console.log(selectResult);
        console.log(`pair count: ${pairCount}`);
        break;
      }
      if (pairsorter.challenge[0] == undefined || pairsorter.challenge[1] == undefined) {
        console.log(arr);
        console.log(state);
        break;
      }
    }
  };
})();
