var getAfricanSwallowStats = function () {
  return {
    name: 'African Swallow',
    kingdom: 'Animalia',
    genus: 'Petrochelidon',
    flapsPerSecond: 7,
    avgWingSpamInMeters: 0.029,
    airSpeedMetersPerSecond: 11,
    airSpeedMilesPerHour: 24
  };
};

/*
 TODO: Call getAfricanSwallowStats() and using destructuring
 assign the name property to a variable called name and the
 airSpeedMetersPerSecond property to a variable called
 airSpeed.
 Note: you should be able to do all of this in one line.
 */




//Checkout this sweet ES6 Template String!!
console.log(`An ${window.name} has an air speed of ${window.airSpeed} m/s.`);
