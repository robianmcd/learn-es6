class Car {
  constructor(hornNoise) {
    this.hornNoise = hornNoise;
    this.speed = 0;
  }

  honk() {
    return this.hornNoise;
  }

  accelerate() {
    this.speed++;
  }
}


/*
 TODO: make SelfDrivingCar extend Car and call Car's
 constructor.
 */
class SelfDrivingCar {
  constructor(hornNoise) {

    this.obstacleDetected = false;
  }

  accelerate() {
    /*
     TODO: call the super class's implementation of
     accelerate if this.obstacleDetected is false.
     */

  }
}