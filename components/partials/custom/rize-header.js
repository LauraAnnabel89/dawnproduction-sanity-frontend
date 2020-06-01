import React, { Component } from 'react';
import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors-f';

export default class RizeHeader extends Component {
  constructor(...args) {
    super(...args);
    this.engine = null;
    this.renderer = null;
    this.dom = React.createRef();
  }

  componentDidMount() {
    Matter.use(MatterAttractors);

    const {
      Engine,
      Render,
      Composite,
      Composites,
      Constraint,
      MouseConstraint,
      Mouse,
      World,
      Bodies,
      Body,
    } = Matter;

    const worldsize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const bounds = {
      min: { x: 0, y: 0 },
      max: { x: worldsize.width, y: worldsize.height },
    };

    const settings = {
      backgroundGradientDegrees: 25,
      backgroundGradientStart: '#2ba7fe',
      backgroundGradientEnd: '#0a0059',
      dots: '#ffffff',
      maskDot: false,
      randomForceMultiplier: 0.05,
      dotSize: 8,
      dotScale: 1,
      stiffness: 0.0015,
      force: 1,
      damping: 0.015,
    };


    this.engine = Engine.create({
      positionIterations: 20,
      velocityIterations: 20,
      constraintIterations: 1,
    });
    this.engine.world.gravity.y = 0;

    this.renderer = Render.create({
      element: this.dom.current,
      engine: this.engine,
      options: {
        width: worldsize.width,
        height: worldsize.height,
        hasBounds: true,
        wireframes: false,
        background: 'transparent',
        pixelRatio: 'auto',
      },
      bounds,
    });

    const compBodyOpts = {
      render: {
        fillStyle: settings.dots,
        strokeStyle: 'white',
        lineWidth: 0,
      },
    };

    const stack = {
      gap: 30,
    };

    const wallOpts = {
      render: compBodyOpts.render,
      isStatic: true,
    };

    // add all of the bodies to the world
    const boundaries = 900;
    const walls = [
      Bodies.rectangle(
        worldsize.width / 2,
        0 - boundaries / 2,
        worldsize.width * 2,
        boundaries,
        wallOpts,
      ),
      Bodies.rectangle(
        worldsize.width / 2,
        worldsize.height + boundaries / 2,
        worldsize.width * 2,
        boundaries,
        wallOpts,
      ),
      Bodies.rectangle(
        worldsize.width + boundaries / 2,
        worldsize.height / 2,
        boundaries,
        worldsize.height * 2,
        wallOpts,
      ),
      Bodies.rectangle(
        0 - boundaries / 2,
        worldsize.height / 2,
        boundaries,
        worldsize.height * 2,
        wallOpts,
      ),
    ];


    const plugin = {
      attractors: [
        (bodyA, bodyB) => {
          const distance = {
            x: (bodyA.position.x - bodyB.position.x),
            y: (bodyA.position.y - bodyB.position.y),
          };

          const dir = {
            x: distance.x >= 0 ? 1 : -1,
            y: distance.y >= 0 ? 1 : -1,
          };

          const threshold = 250;

          const power = 1e-5;

          const pos = {
            x: Math.abs(Math.min(Math.abs(distance.x), threshold)),
            y: Math.abs(Math.min(Math.abs(distance.y), threshold)),
          };

          const angular = {
            x: 1 - Math.sin((Math.PI / 2) * (100 / threshold * pos.x) / 100),
            y: 1 - Math.sin((Math.PI / 2) * (100 / threshold * pos.y) / 100),
          };
          const finalAngular = angular.x * angular.y;

          const coeff = {
            x: (threshold - distance.x) / 200,
            y: (threshold - distance.y) / 200,
          };

          return {
            x: pos.x * dir.x * finalAngular * (settings.force * power * coeff.x) * -1,
            y: pos.y * dir.y * finalAngular * (settings.force * power * coeff.y) * -1,
          };
        },
      ],
    };

    const logo = Bodies.circle(
      worldsize.width / 2 + Math.random() * 2,
      worldsize.height / 2 + Math.random() * 2,
      50,
      {
        render: {
          fillStyle: 'transparent',
          visible: true,
        },
        plugin,
      },
    );

    const dotCompSize = settings.dotSize * 2 + stack.gap;
    const gridBalls = {
      x: Math.floor((worldsize.width) / dotCompSize),
      y: Math.floor((worldsize.height) / dotCompSize),
    };

    const gridPadding = {
      x: (worldsize.width - (dotCompSize * gridBalls.x - stack.gap)) / 2,
      y: (worldsize.height - (dotCompSize * gridBalls.y - stack.gap)) / 2,
    };

    const grid = Composites.stack(
      gridPadding.x,
      gridPadding.y,
      gridBalls.x,
      gridBalls.y,
      stack.gap,
      stack.gap,
      (x, y) => Bodies.circle(x, y, settings.dotSize, compBodyOpts),
    );

    const bodyMap = {};

    grid.bodies.forEach((body, i) => {
      bodyMap[grid.bodies[i].id] = i;

      Composite.add(grid, Constraint.create({
        bodyB: grid.bodies[i],
        pointA: { x: grid.bodies[i].position.x, y: grid.bodies[i].position.y },
        pointB: { x: 0, y: 0 },
        stiffness: settings.stiffness,
        damping: settings.damping,
        render: {
          visible: false,
        },
      }));
    });

    // add mouse control
    const mouse = Mouse.create(this.renderer.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(this.engine.world, [
      grid,
      ...walls,
      logo,
      mouseConstraint,
    ]);

    Engine.run(this.engine);
    Render.run(this.renderer);

    function setRandomForce() {
      const time = performance.now();
      const position = {
        x: logo.position.x,
        y: logo.position.y,
      };
      const force = {
        x: Math.cos(time / 500) * Math.cos(time / 1500) * settings.randomForceMultiplier,
        y: Math.sin(time / 1000) * Math.sin(time / 1500) * settings.randomForceMultiplier,
      };

      requestAnimationFrame(setRandomForce);

      Body.applyForce(logo, position, force);
    }
    setTimeout(setRandomForce, 3000);

  }

  componentWillUnmount() {
    Matter.Render.stop(this.renderer);
    Matter.World.clear(this.engine.world);
    Matter.Engine.clear(this.engine);

    // Free mem
    this.renderer.canvas.remove();
    this.renderer.canvas = null;
    this.renderer.context = null;
    this.renderer.textures = {};

    document.body.style = '';
  }

  render() {
    return (
      <div ref={this.dom} />
    );
  }
}
