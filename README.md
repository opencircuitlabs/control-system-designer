# Control System Designer

`control-system-designer` is a dependency-free Node.js engineering toolkit for classical and state-space control work. It keeps the equations inspectable and turns analysis, simulation, controller synthesis, discretization, robustness, and tolerance evidence into repeatable code and CLI workflows.

## Capabilities

- Proper continuous transfer functions with polynomial, complex-root, series, parallel, and feedback operations
- Pole/zero stability analysis for continuous and discrete systems
- Complex evaluation, logarithmic Bode responses, phase unwrapping, gain margin, and phase margin
- Transfer-function to controllable-canonical state-space conversion
- RK4 state-space simulation, step responses, rise time, overshoot, settling time, and error metrics
- Realizable PID construction with a configurable derivative filter, plus IMC and Ziegler–Nichols tuning for first-order-plus-dead-time plants
- Exact zero-order-hold state-space discretization through an augmented matrix exponential
- Root-locus sweeps and deterministic Monte Carlo coefficient-tolerance yield
- Markdown engineering reports and JSON CLI output

The package has no runtime dependencies, supports Node.js 18+, and is checked in CI on Node 18, 20, and 22.

## Install and test

```sh
npm install
npm test
npm run check
```

## CLI

```sh
control-system-designer analyze examples/plant.json
control-system-designer margins examples/plant.json
control-system-designer bode examples/plant.json --start 0.01 --end 100 --points 200
control-system-designer step examples/plant.json --duration 12 --step 0.01 --output result.json
control-system-designer close-loop examples/loop.json
control-system-designer tune-pid examples/fopdt.json
control-system-designer discretize examples/plant.json --sample-time 0.01
control-system-designer root-locus examples/plant.json --gains 0,0.1,1,10,100
control-system-designer monte-carlo examples/plant.json --iterations 1000 --sigma 0.03 --seed 42
control-system-designer report examples/report.json --output report.md
```

Angular frequency is expressed in radians per second. Transfer-function coefficients use descending powers. CLI data is JSON so inputs and results can be reviewed, versioned, and passed to other OpenCircuitLabs tools.

## Library example

```js
import {
  closedLoop,
  stabilityAnalysis,
  stabilityMargins,
  stepResponse,
  stepMetrics,
  tunePidFopdt
} from '@opencircuitlabs/control-system-designer';

const plant = { numerator: [4], denominator: [1, 1, 0] };
const controlled = closedLoop(plant);

console.log(stabilityAnalysis(controlled));
console.log(stabilityMargins(plant));
console.log(stepMetrics(stepResponse(controlled, { duration: 10 })));
console.log(tunePidFopdt({
  processGain: 2,
  timeConstant: 5,
  deadTime: 1,
  method: 'imc'
}));
```

## Modeling scope

This toolkit is intended for deterministic design exploration and reproducible engineering checks. Frequency margins are found by dense logarithmic scanning and linear interpolation. Delay is represented by the FOPDT tuning model, not as an exponential transfer-function term. Validate safety-critical controllers against the full plant, nonlinear limits, sampling, quantization, uncertainty, and target hardware.

## License

MIT © 2026 OpenCircuitLabs
